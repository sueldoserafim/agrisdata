-- Function to easily check if current user is Super Admin (bypassing RLS on usuarios table)
CREATE OR REPLACE FUNCTION public.is_admin_saas()
RETURNS boolean AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid() AND perfil = 'admin_saas'
  );
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
DECLARE
  new_empresa_id uuid;
  new_user_id uuid;
BEGIN
  -- Seed Empresa for Super Admin
  new_empresa_id := '00000000-0000-0000-0000-000000000001'::uuid;
  INSERT INTO public.empresas (id, nome, slug, ativo)
  VALUES (new_empresa_id, 'Sigma SaaS', 'sigma-saas', true)
  ON CONFLICT (id) DO NOTHING;

  -- Seed User
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
      '{"name": "Super Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, new_empresa_id, 'sueldo@suportesigma.com', 'Super Admin', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Fix Auth Token Nulls just in case
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE
  confirmation_token IS NULL OR recovery_token IS NULL
  OR email_change_token_new IS NULL OR email_change IS NULL
  OR email_change_token_current IS NULL
  OR phone_change IS NULL OR phone_change_token IS NULL
  OR reauthentication_token IS NULL;

-- Policies for admin_saas

-- Empresas
DROP POLICY IF EXISTS "empresas_admin_all" ON public.empresas;
CREATE POLICY "empresas_admin_all" ON public.empresas
  FOR ALL TO authenticated USING (public.is_admin_saas());

-- Planos
DROP POLICY IF EXISTS "planos_admin_all" ON public.planos;
CREATE POLICY "planos_admin_all" ON public.planos
  FOR ALL TO authenticated USING (public.is_admin_saas());

-- Usuarios
DROP POLICY IF EXISTS "usuarios_admin_all" ON public.usuarios;
CREATE POLICY "usuarios_admin_all" ON public.usuarios
  FOR ALL TO authenticated USING (public.is_admin_saas());

-- Faturas
DROP POLICY IF EXISTS "saas_faturas_admin_all" ON public.saas_faturas;
CREATE POLICY "saas_faturas_admin_all" ON public.saas_faturas
  FOR ALL TO authenticated USING (public.is_admin_saas());

-- Tickets (Missing Policies Fix + Admin full access)
DROP POLICY IF EXISTS "suporte_tickets_admin_all" ON public.suporte_tickets;
CREATE POLICY "suporte_tickets_admin_all" ON public.suporte_tickets
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "suporte_tickets_empresa" ON public.suporte_tickets;
CREATE POLICY "suporte_tickets_empresa" ON public.suporte_tickets
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- 2FA (Missing Policies Fix + Admin full access)
DROP POLICY IF EXISTS "user_2fa_codes_admin" ON public.user_2fa_codes;
CREATE POLICY "user_2fa_codes_admin" ON public.user_2fa_codes
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "user_2fa_codes_own" ON public.user_2fa_codes;
CREATE POLICY "user_2fa_codes_own" ON public.user_2fa_codes
  FOR ALL TO authenticated USING (usuario_id = auth.uid());
