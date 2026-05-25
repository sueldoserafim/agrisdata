DO $$
DECLARE
  new_user_id uuid;
  default_empresa_id uuid;
BEGIN
  -- 1. Certificar que uma empresa base existe para servir como âncora do super admin
  IF NOT EXISTS (SELECT 1 FROM public.empresas WHERE slug = 'sigma-admin') THEN
    default_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, slug, ativo, limite_usuarios)
    VALUES (default_empresa_id, 'Sigma Admin', 'sigma-admin', true, 9999);
  ELSE
    SELECT id INTO default_empresa_id FROM public.empresas WHERE slug = 'sigma-admin' LIMIT 1;
  END IF;

  -- 2. Inserir o super admin sueldo@suportesigma.com se não existir, ou atualizar perfil
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
      crypt('Skip@Pass123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Administrador SaaS"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, default_empresa_id, 'sueldo@suportesigma.com', 'Administrador SaaS', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    -- 3. Atualizar o perfil do usuário existente caso já estivesse lá mas sem as permissões corretas
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'sueldo@suportesigma.com' LIMIT 1;
    
    IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE id = new_user_id) THEN
      INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
      VALUES (new_user_id, default_empresa_id, 'sueldo@suportesigma.com', 'Administrador SaaS', 'admin_saas', true);
    ELSE
      UPDATE public.usuarios SET perfil = 'admin_saas' WHERE id = new_user_id;
    END IF;
  END IF;
END $$;
