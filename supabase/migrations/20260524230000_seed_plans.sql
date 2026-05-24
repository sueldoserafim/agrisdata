DO $$
DECLARE
  v_empresa_id uuid;
  v_user_id uuid;
BEGIN
  -- 1. Create Starter Plan
  INSERT INTO public.planos (id, nome, descricao, preco_mensal, limite_usuarios, modulos_habilitados, ativo)
  VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Starter',
    'Plano básico para pequenas propriedades',
    99.90,
    5,
    ARRAY['caderno_campo', 'estoque'],
    true
  )
  ON CONFLICT (nome) DO UPDATE 
  SET 
    descricao = EXCLUDED.descricao,
    preco_mensal = EXCLUDED.preco_mensal,
    limite_usuarios = EXCLUDED.limite_usuarios,
    modulos_habilitados = EXCLUDED.modulos_habilitados;

  -- 2. Create Professional Plan
  INSERT INTO public.planos (id, nome, descricao, preco_mensal, limite_usuarios, modulos_habilitados, ativo)
  VALUES (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Professional',
    'Plano completo para médias propriedades',
    299.90,
    15,
    ARRAY['caderno_campo', 'estoque', 'financeiro', 'qualidade'],
    true
  )
  ON CONFLICT (nome) DO UPDATE 
  SET 
    descricao = EXCLUDED.descricao,
    preco_mensal = EXCLUDED.preco_mensal,
    limite_usuarios = EXCLUDED.limite_usuarios,
    modulos_habilitados = EXCLUDED.modulos_habilitados;

  -- 3. Create Enterprise Plan
  INSERT INTO public.planos (id, nome, descricao, preco_mensal, limite_usuarios, modulos_habilitados, ativo)
  VALUES (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Enterprise',
    'Plano avançado para grandes propriedades',
    599.90,
    50,
    ARRAY['caderno_campo', 'estoque', 'financeiro', 'qualidade', 'rh'],
    true
  )
  ON CONFLICT (nome) DO UPDATE 
  SET 
    descricao = EXCLUDED.descricao,
    preco_mensal = EXCLUDED.preco_mensal,
    limite_usuarios = EXCLUDED.limite_usuarios,
    modulos_habilitados = EXCLUDED.modulos_habilitados;

  -- 4. Admin User Seed
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
