DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento_enum') THEN
    CREATE TYPE tipo_documento_enum AS ENUM ('bl', 'awb', 'co', 'phytosanitary', 'certificate_origin', 'fumigation', 'packing_list', 'commercial_invoice', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_documento_enum') THEN
    CREATE TYPE status_documento_enum AS ENUM ('valido', 'vencido', 'pendente');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motivo_rolagem_enum') THEN
    CREATE TYPE motivo_rolagem_enum AS ENUM ('atraso_navio', 'falta_espaco', 'problema_documentacao', 'outro');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_rolagem_enum') THEN
    CREATE TYPE status_rolagem_enum AS ENUM ('pendente', 'aprovada', 'executada', 'cancelada');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.documentos_exportacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    container_id UUID REFERENCES public.containers(id) ON DELETE CASCADE,
    tipo_documento tipo_documento_enum NOT NULL,
    numero_documento TEXT,
    data_emissao DATE,
    data_validade DATE,
    arquivo_url TEXT,
    status status_documento_enum DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.rolagens_container (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    container_id UUID NOT NULL REFERENCES public.containers(id) ON DELETE CASCADE,
    booking_original_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_novo_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    motivo_rolagem motivo_rolagem_enum NOT NULL,
    data_solicitacao DATE DEFAULT CURRENT_DATE,
    data_aprovacao DATE,
    aprovado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    custo_rolagem_usd DECIMAL(12,2) DEFAULT 0,
    status status_rolagem_enum DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.documentos_exportacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rolagens_container ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documentos_exportacao_empresa" ON public.documentos_exportacao;
CREATE POLICY "documentos_exportacao_empresa" ON public.documentos_exportacao
    FOR ALL TO authenticated
    USING (empresa_id = public.get_user_empresa_id())
    WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "rolagens_container_empresa" ON public.rolagens_container;
CREATE POLICY "rolagens_container_empresa" ON public.rolagens_container
    FOR ALL TO authenticated
    USING (empresa_id = public.get_user_empresa_id())
    WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_documentos_exportacao_updated_at ON public.documentos_exportacao;
CREATE TRIGGER trigger_documentos_exportacao_updated_at BEFORE UPDATE ON public.documentos_exportacao FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_rolagens_container_updated_at ON public.rolagens_container;
CREATE TRIGGER trigger_rolagens_container_updated_at BEFORE UPDATE ON public.rolagens_container FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
