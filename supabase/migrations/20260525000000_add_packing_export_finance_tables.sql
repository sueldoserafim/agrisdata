DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.pallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    codigo VARCHAR NOT NULL,
    safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL,
    peso_kg NUMERIC,
    status VARCHAR DEFAULT 'em_estoque',
    conformidade_percentual NUMERIC DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.carregamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    data_carregamento DATE,
    placa_veiculo VARCHAR,
    status VARCHAR DEFAULT 'pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.containers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    numero_container VARCHAR NOT NULL,
    destino VARCHAR,
    status VARCHAR DEFAULT 'embarcado',
    data_embarque DATE,
    cut_off DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.financeiro_lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    tipo VARCHAR NOT NULL,
    descricao VARCHAR NOT NULL,
    valor NUMERIC NOT NULL,
    data_vencimento DATE,
    status VARCHAR DEFAULT 'pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  );
END $$;

ALTER TABLE public.pallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carregamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_lancamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pallets_empresa" ON public.pallets;
CREATE POLICY "pallets_empresa" ON public.pallets
  FOR ALL TO public USING (empresa_id = (SELECT usuarios.empresa_id FROM usuarios WHERE usuarios.id = auth.uid()));

DROP POLICY IF EXISTS "carregamentos_empresa" ON public.carregamentos;
CREATE POLICY "carregamentos_empresa" ON public.carregamentos
  FOR ALL TO public USING (empresa_id = (SELECT usuarios.empresa_id FROM usuarios WHERE usuarios.id = auth.uid()));

DROP POLICY IF EXISTS "containers_empresa" ON public.containers;
CREATE POLICY "containers_empresa" ON public.containers
  FOR ALL TO public USING (empresa_id = (SELECT usuarios.empresa_id FROM usuarios WHERE usuarios.id = auth.uid()));

DROP POLICY IF EXISTS "financeiro_lancamentos_empresa" ON public.financeiro_lancamentos;
CREATE POLICY "financeiro_lancamentos_empresa" ON public.financeiro_lancamentos
  FOR ALL TO public USING (empresa_id = (SELECT usuarios.empresa_id FROM usuarios WHERE usuarios.id = auth.uid()));
