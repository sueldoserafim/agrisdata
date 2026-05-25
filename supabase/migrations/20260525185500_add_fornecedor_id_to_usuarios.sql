DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='usuarios' AND column_name='fornecedor_id') THEN
    ALTER TABLE public.usuarios ADD COLUMN fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Recreate RLS
DROP POLICY IF EXISTS "usuarios_admin_read" ON public.usuarios;
CREATE POLICY "usuarios_admin_read" ON public.usuarios FOR SELECT TO authenticated
  USING (is_admin_saas() OR (auth.uid() = id) OR (empresa_id = get_user_empresa_id()));

DROP POLICY IF EXISTS "fornecedores_portal_read" ON public.fornecedores;
CREATE POLICY "fornecedores_portal_read" ON public.fornecedores FOR SELECT TO authenticated
  USING (id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid()) OR empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "compras_cotacoes_fornecedor_read" ON public.compras_cotacoes;
CREATE POLICY "compras_cotacoes_fornecedor_read" ON public.compras_cotacoes FOR SELECT TO authenticated
  USING (
    empresa_id = get_user_empresa_id() OR
    id IN (SELECT cotacao_id FROM public.compras_cotacao_fornecedores WHERE fornecedor_id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "compras_cotacao_fornecedores_portal_read" ON public.compras_cotacao_fornecedores;
CREATE POLICY "compras_cotacao_fornecedores_portal_read" ON public.compras_cotacao_fornecedores FOR SELECT TO authenticated
  USING (
    empresa_id = get_user_empresa_id() OR
    fornecedor_id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "compras_cotacao_fornecedores_portal_update" ON public.compras_cotacao_fornecedores;
CREATE POLICY "compras_cotacao_fornecedores_portal_update" ON public.compras_cotacao_fornecedores FOR UPDATE TO authenticated
  USING (
    empresa_id = get_user_empresa_id() OR
    fornecedor_id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid())
  ) WITH CHECK (
    empresa_id = get_user_empresa_id() OR
    fornecedor_id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid())
  );

-- Seed System Empresa and Admin
DO $$
DECLARE
  sys_empresa_id uuid := '00000000-0000-0000-0000-000000000000';
  new_user_id uuid;
BEGIN
  INSERT INTO public.empresas (id, nome, slug, ativo)
  VALUES (sys_empresa_id, 'System SaaS', 'system-saas', true)
  ON CONFLICT (id) DO NOTHING;

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
      '{"name": "Admin SaaS", "role": "admin_saas"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Admin SaaS', 'admin_saas', sys_empresa_id, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
