DO $$
DECLARE
  v_user_id uuid;
  v_empresa_id uuid;
BEGIN
  -- Verificar se o usuário existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    v_user_id := gen_random_uuid();
    v_empresa_id := gen_random_uuid();
    
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
      '{"name": "Administrador Sigma"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.empresas (id, nome, cnpj, slug, ativo, modulos_habilitados)
    VALUES (
      v_empresa_id, 
      'Empresa Sigma', 
      '00000000000000', 
      'empresa-sigma', 
      true, 
      ARRAY['dashboard', 'fazendas', 'talhoes', 'safras', 'caderno_campo']
    ) ON CONFLICT (slug) DO NOTHING;

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
    VALUES (v_user_id, 'sueldo@suportesigma.com', 'Administrador Sigma', 'admin_saas', v_empresa_id, true)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    -- Se o usuário existe, atualizar a empresa dele para possuir os módulos padrão se vazios
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'sueldo@suportesigma.com' LIMIT 1;
    SELECT empresa_id INTO v_empresa_id FROM public.usuarios WHERE id = v_user_id LIMIT 1;
    
    IF v_empresa_id IS NOT NULL THEN
      UPDATE public.empresas
      SET modulos_habilitados = ARRAY['dashboard', 'fazendas', 'talhoes', 'safras', 'caderno_campo']
      WHERE id = v_empresa_id 
      AND (modulos_habilitados IS NULL OR array_length(modulos_habilitados, 1) IS NULL OR array_length(modulos_habilitados, 1) = 0);
    END IF;
  END IF;
END $$;
