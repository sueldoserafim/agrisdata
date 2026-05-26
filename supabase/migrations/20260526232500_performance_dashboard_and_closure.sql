-- Add column for digital technical signature
ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS data_assinatura_tecnica TIMESTAMPTZ;

-- Seed user sueldo@suportesigma.com to ensure closure testing is possible
DO $$
DECLARE
  new_user_id uuid;
BEGIN
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
      '{"name": "Sueldo Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    -- Try to attach to the first available company
    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    SELECT new_user_id, id, 'sueldo@suportesigma.com', 'Sueldo Admin', 'admin', true
    FROM public.empresas LIMIT 1
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
