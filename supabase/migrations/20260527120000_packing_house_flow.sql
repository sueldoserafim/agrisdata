DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pallet_status') THEN
        CREATE TYPE pallet_status AS ENUM ('em_camara', 'etiquetado', 'reservado', 'carregado', 'descartado');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.romaneios_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    numero_romaneio TEXT NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id),
    data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
    data_prevista_carregamento DATE,
    status TEXT DEFAULT 'em_aberto',
    total_pallets INTEGER DEFAULT 0,
    peso_total_kg DECIMAL DEFAULT 0,
    valor_total DECIMAL DEFAULT 0,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, numero_romaneio)
);

ALTER TABLE public.pallets DROP CONSTRAINT IF EXISTS pallets_status_check;

ALTER TABLE public.pallets 
    ADD COLUMN IF NOT EXISTS recepcao_id UUID REFERENCES public.packing_recepcoes(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS romaneio_id UUID REFERENCES public.romaneios_venda(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS codigo_pallet TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS peso_bruto_kg DECIMAL,
    ADD COLUMN IF NOT EXISTS peso_liquido_kg DECIMAL,
    ADD COLUMN IF NOT EXISTS quantidade_caixas INTEGER,
    ADD COLUMN IF NOT EXISTS calibre TEXT,
    ADD COLUMN IF NOT EXISTS data_paletizacao TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS data_saida_camara TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS temperatura_camara DECIMAL,
    ADD COLUMN IF NOT EXISTS etiqueta_impressa BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS etiqueta_zpl TEXT;

UPDATE public.pallets SET status = 'em_camara' WHERE status = 'em_estoque';
UPDATE public.pallets SET status = 'carregado' WHERE status = 'embarcado';
UPDATE public.pallets SET codigo_pallet = codigo WHERE codigo_pallet IS NULL;

CREATE TABLE IF NOT EXISTS public.etiquetas_impressas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    pallet_id UUID NOT NULL REFERENCES public.pallets(id) ON DELETE CASCADE,
    romaneio_id UUID REFERENCES public.romaneios_venda(id) ON DELETE SET NULL,
    numero_etiqueta TEXT NOT NULL,
    data_impressao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    impresso_por UUID REFERENCES auth.users(id),
    reimpressao BOOLEAN DEFAULT false,
    motivo_reimpressao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.sessoes_carregamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    romaneio_id UUID NOT NULL REFERENCES public.romaneios_venda(id) ON DELETE CASCADE,
    data_carregamento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    veiculo_placa TEXT,
    motorista_nome TEXT,
    transportadora_id UUID REFERENCES public.transportadoras(id),
    responsavel_id UUID REFERENCES auth.users(id),
    peso_confirmado_kg DECIMAL,
    temperatura_carga DECIMAL,
    status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluido', 'divergencia')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.divergencias_carregamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    sessao_id UUID NOT NULL REFERENCES public.sessoes_carregamento(id) ON DELETE CASCADE,
    pallet_id UUID REFERENCES public.pallets(id),
    tipo_divergencia TEXT CHECK (tipo_divergencia IN ('peso', 'quantidade', 'qualidade', 'produto_errado')),
    valor_esperado DECIMAL,
    valor_real DECIMAL,
    motivo TEXT,
    aprovado_por UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.romaneios_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etiquetas_impressas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes_carregamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divergencias_carregamento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "romaneios_empresa" ON public.romaneios_venda;
CREATE POLICY "romaneios_empresa" ON public.romaneios_venda FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "etiquetas_empresa" ON public.etiquetas_impressas;
CREATE POLICY "etiquetas_empresa" ON public.etiquetas_impressas FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "sessoes_empresa" ON public.sessoes_carregamento;
CREATE POLICY "sessoes_empresa" ON public.sessoes_carregamento FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

DROP POLICY IF EXISTS "divergencias_empresa" ON public.divergencias_carregamento;
CREATE POLICY "divergencias_empresa" ON public.divergencias_carregamento FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.generate_pallet_code() RETURNS trigger AS $function$
DECLARE
  v_count INT;
  v_date_str TEXT;
BEGIN
  IF NEW.codigo_pallet IS NULL THEN
    v_date_str := to_char(NOW(), 'YYYYMMDD');
    SELECT COUNT(*) INTO v_count FROM public.pallets WHERE empresa_id = NEW.empresa_id AND to_char(created_at, 'YYYYMMDD') = v_date_str;
    NEW.codigo_pallet := 'PALLET-' || v_date_str || '-' || LPAD((v_count + 1)::TEXT, 4, '0');
    IF NEW.codigo IS NULL THEN NEW.codigo := NEW.codigo_pallet; END IF;
  END IF;
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_pallet_code ON public.pallets;
CREATE TRIGGER trg_generate_pallet_code BEFORE INSERT ON public.pallets FOR EACH ROW EXECUTE FUNCTION public.generate_pallet_code();

CREATE OR REPLACE FUNCTION public.generate_romaneio_number() RETURNS trigger AS $function$
BEGIN
  IF NEW.numero_romaneio IS NULL THEN
    NEW.numero_romaneio := 'ROM-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 4));
  END IF;
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_romaneio_number ON public.romaneios_venda;
CREATE TRIGGER trg_generate_romaneio_number BEFORE INSERT ON public.romaneios_venda FOR EACH ROW EXECUTE FUNCTION public.generate_romaneio_number();

CREATE OR REPLACE FUNCTION public.update_status_on_session_concluido() RETURNS trigger AS $function$
BEGIN
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    UPDATE public.pallets SET status = 'carregado' WHERE romaneio_id = NEW.romaneio_id;
    UPDATE public.romaneios_venda SET status = 'carregado' WHERE id = NEW.romaneio_id;
  END IF;
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_status_on_session_concluido ON public.sessoes_carregamento;
CREATE TRIGGER trg_update_status_on_session_concluido AFTER UPDATE ON public.sessoes_carregamento FOR EACH ROW EXECUTE FUNCTION public.update_status_on_session_concluido();

CREATE OR REPLACE FUNCTION public.recalculate_romaneio_totals() RETURNS trigger AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.romaneio_id IS DISTINCT FROM NEW.romaneio_id THEN
      IF OLD.romaneio_id IS NOT NULL THEN
        UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL) WHERE id = OLD.romaneio_id;
      END IF;
      IF NEW.romaneio_id IS NOT NULL THEN
        UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL) WHERE id = NEW.romaneio_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    IF NEW.romaneio_id IS NOT NULL THEN
      UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL) WHERE id = NEW.romaneio_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.romaneio_id IS NOT NULL THEN
      UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL) WHERE id = OLD.romaneio_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalculate_romaneio_totals ON public.pallets;
CREATE TRIGGER trg_recalculate_romaneio_totals AFTER INSERT OR UPDATE OR DELETE ON public.pallets FOR EACH ROW EXECUTE FUNCTION public.recalculate_romaneio_totals();

DO $$
DECLARE
  new_user_id uuid;
  default_empresa_id uuid;
BEGIN
  SELECT id INTO default_empresa_id FROM public.empresas LIMIT 1;
  IF default_empresa_id IS NULL THEN
    default_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, slug, ativo) VALUES (default_empresa_id, 'Empresa Padrão', 'empresa-padrao', true) ON CONFLICT DO NOTHING;
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
      '{"name": "Sueldo Sigma"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL,
      '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Sueldo Sigma', 'admin_saas', default_empresa_id, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
