DO $$
DECLARE
  new_empresa_id uuid;
  new_user_id uuid;
BEGIN
  -- Create an initial empresa if not exists
  IF NOT EXISTS (SELECT 1 FROM public.empresas WHERE email = 'sueldo@suportesigma.com') THEN
    new_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, email, ativo)
    VALUES (new_empresa_id, 'Sigma Suporte', 'sueldo@suportesigma.com', true);
  ELSE
    SELECT id INTO new_empresa_id FROM public.empresas WHERE email = 'sueldo@suportesigma.com' LIMIT 1;
  END IF;

  -- Seed user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sueldo@suportesigma.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Sueldo"}',
      false, 'authenticated', 'authenticated',
      '',    -- confirmation_token
      '',    -- recovery_token
      '',    -- email_change_token_new
      '',    -- email_change
      '',    -- email_change_token_current
      NULL,  -- phone
      '',    -- phone_change
      '',    -- phone_change_token
      ''     -- reauthentication_token
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, new_empresa_id, 'sueldo@suportesigma.com', 'Sueldo', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DROP POLICY IF EXISTS "usuarios_own" ON public.usuarios;
CREATE POLICY "usuarios_own" ON public.usuarios
  FOR SELECT TO public USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin_saas');
