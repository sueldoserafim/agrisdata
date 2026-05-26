DO $$
BEGIN
  -- 1. Add new columns to safras
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS fazenda_id UUID REFERENCES public.fazendas(id) ON DELETE CASCADE;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS ano_safra INTEGER;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS imagem_url TEXT;

  -- 2. Populate new columns safely from existing data
  UPDATE public.safras s
  SET fazenda_id = t.fazenda_id
  FROM public.talhoes t
  WHERE s.talhao_id = t.id AND s.fazenda_id IS NULL;

  UPDATE public.safras
  SET ano_safra = EXTRACT(YEAR FROM data_plantio)
  WHERE ano_safra IS NULL AND data_plantio IS NOT NULL;
  
  UPDATE public.safras
  SET ano_safra = EXTRACT(YEAR FROM created_at)
  WHERE ano_safra IS NULL;

  -- 3. Drop NOT NULL constraint on talhao_id
  ALTER TABLE public.safras ALTER COLUMN talhao_id DROP NOT NULL;

  -- Migrate statuses to the new restricted values
  UPDATE public.safras SET status = 'Planejada' WHERE status = 'planejada';
  UPDATE public.safras SET status = 'Em Andamento' WHERE status IN ('plantada', 'em_plantio', 'em_producao', 'bloqueada');
  UPDATE public.safras SET status = 'Finalizada' WHERE status = 'encerrada';
  
  -- 4. Create junction table safra_talhoes
  CREATE TABLE IF NOT EXISTS public.safra_talhoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      safra_id UUID NOT NULL REFERENCES public.safras(id) ON DELETE CASCADE,
      talhao_id UUID NOT NULL REFERENCES public.talhoes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(safra_id, talhao_id)
  );

  -- 5. Enable RLS
  ALTER TABLE public.safra_talhoes ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "safra_talhoes_empresa" ON public.safra_talhoes;
CREATE POLICY "safra_talhoes_empresa" ON public.safra_talhoes
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- 6. Migrate existing talhao_id to junction table
DO $$
BEGIN
  INSERT INTO public.safra_talhoes (empresa_id, safra_id, talhao_id)
  SELECT empresa_id, id, talhao_id
  FROM public.safras
  WHERE talhao_id IS NOT NULL
  ON CONFLICT (safra_id, talhao_id) DO NOTHING;
END $$;

-- 7. Add unique index for safra duplicates
CREATE UNIQUE INDEX IF NOT EXISTS safras_empresa_fazenda_cultivar_ano_idx 
ON public.safras(empresa_id, fazenda_id, cultivar_id, ano_safra)
WHERE fazenda_id IS NOT NULL AND ano_safra IS NOT NULL;

-- 8. Storage bucket creation and policies
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('safra-images', 'safra-images', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

DROP POLICY IF EXISTS "Public access safra-images" ON storage.objects;
CREATE POLICY "Public access safra-images" ON storage.objects FOR SELECT USING (bucket_id = 'safra-images');

DROP POLICY IF EXISTS "Auth insert safra-images" ON storage.objects;
CREATE POLICY "Auth insert safra-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'safra-images');

DROP POLICY IF EXISTS "Auth update safra-images" ON storage.objects;
CREATE POLICY "Auth update safra-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'safra-images');

DROP POLICY IF EXISTS "Auth delete safra-images" ON storage.objects;
CREATE POLICY "Auth delete safra-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'safra-images');

-- 9. Initial Seed User
DO $$
DECLARE
  new_user_id uuid;
  new_empresa_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.empresas WHERE slug = 'empresa-padrao') THEN
    new_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, ativo, slug, limite_usuarios)
    VALUES (new_empresa_id, 'Empresa Padrão', true, 'empresa-padrao', 10);
  ELSE
    SELECT id INTO new_empresa_id FROM public.empresas WHERE slug = 'empresa-padrao' LIMIT 1;
  END IF;

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

    INSERT INTO public.usuarios (id, email, nome, empresa_id, perfil, ativo)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Administrador', new_empresa_id, 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
