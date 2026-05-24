-- Ensure idempotent policy creation
DROP POLICY IF EXISTS "usuarios_admin_read" ON public.usuarios;
CREATE POLICY "usuarios_admin_read" ON public.usuarios 
  FOR SELECT TO authenticated 
  USING (is_admin_saas() OR auth.uid() = id);

DO $$
DECLARE
  v_empresa_id uuid;
  v_user_id uuid;
BEGIN
  -- Insert or get default company for admin
  SELECT id INTO v_empresa_id FROM public.empresas WHERE slug = 'admin-saas' LIMIT 1;
  IF v_empresa_id IS NULL THEN
    v_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, slug, ativo)
    VALUES (v_empresa_id, 'Admin SaaS', 'admin-saas', true)
    ON CONFLICT (slug) DO NOTHING;
    
    -- In case of race condition
    SELECT id INTO v_empresa_id FROM public.empresas WHERE slug = 'admin-saas' LIMIT 1;
  END IF;

  -- Seed admin user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sueldo@suportesigma.com',
      crypt('Skip@Pass123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Administrador SaaS"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
    VALUES (v_user_id, 'sueldo@suportesigma.com', 'Administrador SaaS', 'admin_saas', v_empresa_id, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
