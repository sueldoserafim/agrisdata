DO $$
BEGIN
  -- Creates tables for ship and port management with required fields
END $$;

CREATE TABLE IF NOT EXISTS public.navios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_navio text NOT NULL,
  bandeira text,
  imo_number text,
  armador text,
  ano_construcao integer,
  capacidade_teus integer,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.portos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_porto text NOT NULL,
  pais text,
  cidade text,
  tipo text CHECK (tipo IN ('embarque', 'desembarque', 'ambos')),
  codigo_un_locode text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trg_navios_updated_at ON public.navios;
CREATE TRIGGER trg_navios_updated_at
  BEFORE UPDATE ON public.navios
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

DROP TRIGGER IF EXISTS trg_portos_updated_at ON public.portos;
CREATE TRIGGER trg_portos_updated_at
  BEFORE UPDATE ON public.portos
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

-- RLS Policies
ALTER TABLE public.navios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "navios_empresa" ON public.navios;
CREATE POLICY "navios_empresa" ON public.navios
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id())
  WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "portos_empresa" ON public.portos;
CREATE POLICY "portos_empresa" ON public.portos
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id())
  WITH CHECK (empresa_id = public.get_user_empresa_id());
