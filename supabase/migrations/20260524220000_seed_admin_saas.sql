DO $$
DECLARE
  v_empresa_id uuid;
  v_user_id uuid;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    
    -- Ensure an admin company exists
    SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
    
    IF v_empresa_id IS NULL THEN
      v_empresa_id := gen_random_uuid();
      INSERT INTO public.empresas (id, nome, email, ativo)
      VALUES (v_empresa_id, 'SaaS Root', 'admin@saas.com', true)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Create user
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
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Administrador SaaS", "role": "admin_saas"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Insert into usuarios
    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (v_user_id, v_empresa_id, 'sueldo@suportesigma.com', 'Administrador SaaS', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;

  ELSE
    -- Ensure the existing user has the correct profile
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'sueldo@suportesigma.com' LIMIT 1;
    
    IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE id = v_user_id) THEN
      SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
      
      IF v_empresa_id IS NULL THEN
        v_empresa_id := gen_random_uuid();
        INSERT INTO public.empresas (id, nome, email, ativo)
        VALUES (v_empresa_id, 'SaaS Root', 'admin@saas.com', true)
        ON CONFLICT DO NOTHING;
      END IF;

      INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
      VALUES (v_user_id, v_empresa_id, 'sueldo@suportesigma.com', 'Administrador SaaS', 'admin_saas', true)
      ON CONFLICT (id) DO NOTHING;
    ELSE
      UPDATE public.usuarios 
      SET perfil = 'admin_saas' 
      WHERE id = v_user_id;
    END IF;

  END IF;
END $$;
