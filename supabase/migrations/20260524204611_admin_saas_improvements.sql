-- Add new columns to empresas
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS modulos_habilitados text[] DEFAULT '{}'::text[];
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS limite_usuarios integer DEFAULT 5;

-- Ensure RLS policies are correct for admin_saas
DROP POLICY IF EXISTS "empresas_admin_saas" ON public.empresas;
CREATE POLICY "empresas_admin_saas" ON public.empresas
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "planos_admin_saas" ON public.planos;
CREATE POLICY "planos_admin_saas" ON public.planos
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "saas_faturas_admin_saas" ON public.saas_faturas;
CREATE POLICY "saas_faturas_admin_saas" ON public.saas_faturas
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "usuarios_admin_saas" ON public.usuarios;
CREATE POLICY "usuarios_admin_saas" ON public.usuarios
  FOR ALL TO authenticated USING (public.is_admin_saas());

-- Ensure admin_saas user exists securely (Idempotent seed block)
DO $seed$
DECLARE
  new_empresa_id uuid;
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    new_user_id := gen_random_uuid();
    new_empresa_id := '00000000-0000-0000-0000-000000000001'::uuid;
    
    INSERT INTO public.empresas (id, nome, slug, ativo, limite_usuarios)
    VALUES (new_empresa_id, 'Sigma SaaS', 'sigma-saas', true, 999)
    ON CONFLICT (id) DO NOTHING;

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
      '{"name": "Super Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, new_empresa_id, 'sueldo@suportesigma.com', 'Super Admin', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $seed$;
