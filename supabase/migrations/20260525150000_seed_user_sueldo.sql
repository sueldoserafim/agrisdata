DO $$
DECLARE
  new_user_id uuid;
  new_empresa_id uuid;
BEGIN
  -- Cria a empresa padrão caso não exista e captura o ID
  IF NOT EXISTS (SELECT 1 FROM public.empresas WHERE slug = 'empresa-padrao') THEN
    new_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, ativo, slug, limite_usuarios)
    VALUES (new_empresa_id, 'Empresa Padrão', true, 'empresa-padrao', 10);
  ELSE
    SELECT id INTO new_empresa_id FROM public.empresas WHERE slug = 'empresa-padrao' LIMIT 1;
  END IF;

  -- Insere o usuário na tabela auth.users de forma idempotente
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
      '{"name": "Administrador"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Insere no perfil de usuários
    INSERT INTO public.usuarios (id, email, nome, empresa_id, perfil, ativo)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Administrador', new_empresa_id, 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
