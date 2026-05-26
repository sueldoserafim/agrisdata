-- Criar tabelas
CREATE TABLE IF NOT EXISTS public.estufas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('viveiro', 'propagador', 'ambiente_controlado', 'sombrite')),
    area_m2 NUMERIC,
    capacidade_lotes INTEGER,
    fazenda_id UUID REFERENCES public.fazendas(id) ON DELETE SET NULL,
    responsavel_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.lotes_mudas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    estufa_id UUID REFERENCES public.estufas(id) ON DELETE CASCADE,
    cultura_id UUID REFERENCES public.culturas(id) ON DELETE CASCADE,
    cultivar_id UUID REFERENCES public.cultivares(id) ON DELETE CASCADE,
    nome_lote TEXT NOT NULL,
    quantidade_mudas INTEGER DEFAULT 0,
    quantidade_viva INTEGER DEFAULT 0,
    data_semeadura DATE,
    data_prevista_transplantio DATE,
    custo_total NUMERIC(12,2) DEFAULT 0,
    custo_por_muda NUMERIC(12,2) DEFAULT 0,
    status TEXT CHECK (status IN ('germinando', 'em_desenvolvimento', 'pronto', 'transplantado', 'descartado')) DEFAULT 'germinando',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.perdas_estufa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    lote_muda_id UUID REFERENCES public.lotes_mudas(id) ON DELETE CASCADE,
    data_perda DATE NOT NULL,
    tipo_perda TEXT CHECK (tipo_perda IN ('pragas', 'doencas', 'estresse_hidrico', 'estresse_termico', 'falha_germinacao', 'outro')),
    quantidade_perdida INTEGER NOT NULL,
    responsavel_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    motivo TEXT,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.transplantios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    lote_muda_id UUID REFERENCES public.lotes_mudas(id) ON DELETE CASCADE,
    safra_id UUID REFERENCES public.safras(id) ON DELETE CASCADE,
    talhao_id UUID REFERENCES public.talhoes(id) ON DELETE CASCADE,
    data_transplantio TIMESTAMPTZ NOT NULL,
    quantidade_transplantada INTEGER NOT NULL,
    quantidade_replantio INTEGER DEFAULT 0,
    area_plantada_ha NUMERIC,
    densidade_plantio INTEGER,
    custo_transferido NUMERIC,
    responsavel_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    confirmado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Ativar RLS
ALTER TABLE public.estufas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes_mudas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perdas_estufa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transplantios ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "estufas_empresa" ON public.estufas;
CREATE POLICY "estufas_empresa" ON public.estufas
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "lotes_mudas_empresa" ON public.lotes_mudas;
CREATE POLICY "lotes_mudas_empresa" ON public.lotes_mudas
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "perdas_estufa_empresa" ON public.perdas_estufa;
CREATE POLICY "perdas_estufa_empresa" ON public.perdas_estufa
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "transplantios_empresa" ON public.transplantios;
CREATE POLICY "transplantios_empresa" ON public.transplantios
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

-- Triggers
CREATE OR REPLACE FUNCTION public.calcular_custo_por_muda()
RETURNS trigger AS $function$
BEGIN
    IF NEW.quantidade_mudas > 0 THEN
        NEW.custo_por_muda := NEW.custo_total / NEW.quantidade_mudas;
    ELSE
        NEW.custo_por_muda := 0;
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        IF NEW.quantidade_viva IS NULL OR NEW.quantidade_viva = 0 THEN
            NEW.quantidade_viva := NEW.quantidade_mudas;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calcular_custo_por_muda ON public.lotes_mudas;
CREATE TRIGGER trg_calcular_custo_por_muda
    BEFORE INSERT OR UPDATE ON public.lotes_mudas
    FOR EACH ROW EXECUTE FUNCTION public.calcular_custo_por_muda();


CREATE OR REPLACE FUNCTION public.atualizar_quantidade_viva_lote()
RETURNS trigger AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva - NEW.quantidade_perdida
        WHERE id = NEW.lote_muda_id AND quantidade_viva >= NEW.quantidade_perdida;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva + OLD.quantidade_perdida - NEW.quantidade_perdida
        WHERE id = NEW.lote_muda_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva + OLD.quantidade_perdida
        WHERE id = OLD.lote_muda_id;
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_atualizar_quantidade_viva_lote ON public.perdas_estufa;
CREATE TRIGGER trg_atualizar_quantidade_viva_lote
    AFTER INSERT OR UPDATE OR DELETE ON public.perdas_estufa
    FOR EACH ROW EXECUTE FUNCTION public.atualizar_quantidade_viva_lote();


CREATE OR REPLACE FUNCTION public.calcular_custo_transferido()
RETURNS trigger AS $function$
DECLARE
    v_custo_por_muda NUMERIC;
BEGIN
    SELECT custo_por_muda INTO v_custo_por_muda FROM public.lotes_mudas WHERE id = NEW.lote_muda_id;
    NEW.custo_transferido := (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) * COALESCE(v_custo_por_muda, 0);
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calcular_custo_transferido ON public.transplantios;
CREATE TRIGGER trg_calcular_custo_transferido
    BEFORE INSERT OR UPDATE ON public.transplantios
    FOR EACH ROW EXECUTE FUNCTION public.calcular_custo_transferido();

CREATE OR REPLACE FUNCTION public.set_atualizado_em()
RETURNS trigger AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_estufas_updated_at ON public.estufas;
CREATE TRIGGER trg_estufas_updated_at BEFORE UPDATE ON public.estufas FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

DROP TRIGGER IF EXISTS trg_lotes_mudas_updated_at ON public.lotes_mudas;
CREATE TRIGGER trg_lotes_mudas_updated_at BEFORE UPDATE ON public.lotes_mudas FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

DROP TRIGGER IF EXISTS trg_perdas_estufa_updated_at ON public.perdas_estufa;
CREATE TRIGGER trg_perdas_estufa_updated_at BEFORE UPDATE ON public.perdas_estufa FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

DROP TRIGGER IF EXISTS trg_transplantios_updated_at ON public.transplantios;
CREATE TRIGGER trg_transplantios_updated_at BEFORE UPDATE ON public.transplantios FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();
