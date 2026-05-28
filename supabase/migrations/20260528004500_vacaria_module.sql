-- Migrations for Vacaria Module

CREATE TABLE IF NOT EXISTS public.vacaria_animais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    brinco TEXT NOT NULL,
    nome TEXT,
    raca TEXT,
    data_nascimento DATE,
    status TEXT DEFAULT 'ativo',
    foto_url TEXT,
    pai_id UUID REFERENCES public.vacaria_animais(id) ON DELETE SET NULL,
    mae_id UUID REFERENCES public.vacaria_animais(id) ON DELETE SET NULL,
    lote TEXT,
    em_quarentena BOOLEAN DEFAULT false,
    peso_atual NUMERIC,
    data_ultima_pesagem DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.vacaria_eventos_reprodutivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES public.vacaria_animais(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- cobricao, inseminacao, toque, parto
    data_evento DATE NOT NULL,
    previsao_parto DATE,
    resultado_toque TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.vacaria_producao_leite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES public.vacaria_animais(id) ON DELETE CASCADE,
    data_ordenha DATE NOT NULL,
    volume_litros NUMERIC NOT NULL,
    ccs NUMERIC,
    cbt NUMERIC,
    periodo TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.vacaria_saude_animal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES public.vacaria_animais(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- vacina, tratamento, exame, pesagem
    data_registro DATE NOT NULL,
    descricao TEXT,
    medicamento TEXT,
    resultado TEXT,
    data_proxima_dose DATE,
    peso_kg NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vacaria_animais_empresa ON public.vacaria_animais(empresa_id);
CREATE INDEX IF NOT EXISTS idx_vacaria_eventos_animal ON public.vacaria_eventos_reprodutivos(animal_id);
CREATE INDEX IF NOT EXISTS idx_vacaria_producao_animal ON public.vacaria_producao_leite(animal_id);
CREATE INDEX IF NOT EXISTS idx_vacaria_saude_animal ON public.vacaria_saude_animal(animal_id);

-- Storage configuration
INSERT INTO storage.buckets (id, name, public) VALUES ('vacaria_fotos', 'vacaria_fotos', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "vacaria_fotos_public_read" ON storage.objects;
CREATE POLICY "vacaria_fotos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'vacaria_fotos');

DROP POLICY IF EXISTS "vacaria_fotos_auth_insert" ON storage.objects;
CREATE POLICY "vacaria_fotos_auth_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vacaria_fotos');

-- RLS
ALTER TABLE public.vacaria_animais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacaria_eventos_reprodutivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacaria_producao_leite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacaria_saude_animal ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "vacaria_animais_empresa" ON public.vacaria_animais;
CREATE POLICY "vacaria_animais_empresa" ON public.vacaria_animais FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "vacaria_eventos_reprodutivos_empresa" ON public.vacaria_eventos_reprodutivos;
CREATE POLICY "vacaria_eventos_reprodutivos_empresa" ON public.vacaria_eventos_reprodutivos FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "vacaria_producao_leite_empresa" ON public.vacaria_producao_leite;
CREATE POLICY "vacaria_producao_leite_empresa" ON public.vacaria_producao_leite FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "vacaria_saude_animal_empresa" ON public.vacaria_saude_animal;
CREATE POLICY "vacaria_saude_animal_empresa" ON public.vacaria_saude_animal FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

-- TRIGGERS
CREATE OR REPLACE FUNCTION public.vacaria_previsao_parto() RETURNS trigger AS $$
BEGIN
    IF NEW.tipo IN ('cobricao', 'inseminacao') THEN
        NEW.previsao_parto := NEW.data_evento + INTERVAL '283 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vacaria_previsao_parto ON public.vacaria_eventos_reprodutivos;
CREATE TRIGGER trg_vacaria_previsao_parto
BEFORE INSERT OR UPDATE ON public.vacaria_eventos_reprodutivos
FOR EACH ROW EXECUTE FUNCTION public.vacaria_previsao_parto();

CREATE OR REPLACE FUNCTION public.vacaria_atualiza_peso() RETURNS trigger AS $$
BEGIN
    IF NEW.tipo = 'pesagem' AND NEW.peso_kg IS NOT NULL THEN
        UPDATE public.vacaria_animais SET peso_atual = NEW.peso_kg, data_ultima_pesagem = NEW.data_registro WHERE id = NEW.animal_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vacaria_atualiza_peso ON public.vacaria_saude_animal;
CREATE TRIGGER trg_vacaria_atualiza_peso
AFTER INSERT OR UPDATE ON public.vacaria_saude_animal
FOR EACH ROW EXECUTE FUNCTION public.vacaria_atualiza_peso();

CREATE OR REPLACE FUNCTION public.vacaria_queda_producao_alerta() RETURNS trigger AS $$
DECLARE
    v_media_7d NUMERIC;
    v_admin_id UUID;
    v_brinco TEXT;
BEGIN
    SELECT AVG(volume_litros) INTO v_media_7d
    FROM public.vacaria_producao_leite
    WHERE animal_id = NEW.animal_id
      AND data_ordenha >= NEW.data_ordenha - INTERVAL '7 days'
      AND data_ordenha < NEW.data_ordenha
      AND deleted_at IS NULL;

    IF v_media_7d IS NOT NULL AND v_media_7d > 0 THEN
        IF NEW.volume_litros < (v_media_7d * 0.8) THEN
            SELECT brinco INTO v_brinco FROM public.vacaria_animais WHERE id = NEW.animal_id;
            FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
                INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
                VALUES (
                    NEW.empresa_id, v_admin_id,
                    'Queda de Produção - ' || COALESCE(v_brinco, 'Desconhecido'),
                    'O animal ' || COALESCE(v_brinco, '') || ' apresentou uma queda de produção superior a 20%. Média 7d: ' || ROUND(v_media_7d, 2) || 'L, Hoje: ' || NEW.volume_litros || 'L.',
                    'queda_producao', false
                );
            END LOOP;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vacaria_queda_producao_alerta ON public.vacaria_producao_leite;
CREATE TRIGGER trg_vacaria_queda_producao_alerta
AFTER INSERT ON public.vacaria_producao_leite
FOR EACH ROW EXECUTE FUNCTION public.vacaria_queda_producao_alerta();

-- SEED DATA
DO $$
DECLARE
  new_user_id uuid;
  v_empresa_id uuid;
  v_animal_1 uuid := gen_random_uuid();
  v_animal_2 uuid := gen_random_uuid();
BEGIN
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  IF v_empresa_id IS NULL THEN
    INSERT INTO public.empresas (id, nome, slug, ativo) VALUES (gen_random_uuid(), 'Sigma Company', 'sigma', true) RETURNING id INTO v_empresa_id;
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
      new_user_id, '00000000-0000-0000-0000-000000000000', 'sueldo@suportesigma.com',
      crypt('Skip@Pass123!', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Sueldo Sigma"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Sueldo Sigma', 'admin_saas', v_empresa_id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Mock Animais
  INSERT INTO public.vacaria_animais (id, empresa_id, brinco, nome, raca, data_nascimento, status, em_quarentena)
  VALUES 
    (v_animal_1, v_empresa_id, 'BR-1001', 'Mimosa', 'Holandesa', '2020-05-10', 'ativo', false),
    (v_animal_2, v_empresa_id, 'BR-1002', 'Estrela', 'Girolando', '2021-08-15', 'ativo', true)
  ON CONFLICT DO NOTHING;

  -- Mock Producao
  INSERT INTO public.vacaria_producao_leite (empresa_id, animal_id, data_ordenha, volume_litros, ccs, cbt, periodo)
  VALUES 
    (v_empresa_id, v_animal_1, CURRENT_DATE - 3, 25.5, 200, 10, 'manha'),
    (v_empresa_id, v_animal_1, CURRENT_DATE - 2, 26.0, 210, 12, 'manha'),
    (v_empresa_id, v_animal_1, CURRENT_DATE - 1, 24.5, 195, 11, 'manha'),
    (v_empresa_id, v_animal_2, CURRENT_DATE - 2, 18.0, 300, 15, 'manha'),
    (v_empresa_id, v_animal_2, CURRENT_DATE - 1, 14.0, 350, 20, 'manha')
  ON CONFLICT DO NOTHING;

  -- Mock Repro
  INSERT INTO public.vacaria_eventos_reprodutivos (empresa_id, animal_id, tipo, data_evento, resultado_toque)
  VALUES
    (v_empresa_id, v_animal_1, 'inseminacao', CURRENT_DATE - 200, NULL),
    (v_empresa_id, v_animal_1, 'toque', CURRENT_DATE - 150, 'prenhe'),
    (v_empresa_id, v_animal_1, 'parto', CURRENT_DATE - 500, NULL),
    (v_empresa_id, v_animal_1, 'parto', CURRENT_DATE - 1000, NULL)
  ON CONFLICT DO NOTHING;
  
  -- Mock Saude
  INSERT INTO public.vacaria_saude_animal (empresa_id, animal_id, tipo, data_registro, descricao, data_proxima_dose)
  VALUES
    (v_empresa_id, v_animal_1, 'vacina', CURRENT_DATE - 100, 'Aftosa', CURRENT_DATE + 5),
    (v_empresa_id, v_animal_2, 'tratamento', CURRENT_DATE - 5, 'Mastite', NULL)
  ON CONFLICT DO NOTHING;
END $$;
