-- Create packing_recepcoes table if it does not exist
CREATE TABLE IF NOT EXISTS public.packing_recepcoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  colheita_id UUID NOT NULL,
  safra_id UUID NOT NULL REFERENCES public.safras(id) ON DELETE CASCADE,
  quantidade_ton NUMERIC NOT NULL,
  data_recepcao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Alter colheita_registros to add missing columns
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS producao_bruta_ton NUMERIC;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS perdas_ton NUMERIC DEFAULT 0;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS producao_liquida_ton NUMERIC;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS area_colhida_ha NUMERIC;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS numero_caixas INTEGER;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS brix_medio NUMERIC;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS temperatura_colheita NUMERIC;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS lote_producao VARCHAR;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS operadores JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS equipamento_id UUID REFERENCES public.equipamentos(id) ON DELETE SET NULL;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS destino_producao VARCHAR;
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS fotos TEXT[];
ALTER TABLE public.colheita_registros ADD COLUMN IF NOT EXISTS responsavel_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL;

-- Add Foreign Key from packing_recepcoes to colheita_registros
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'packing_recepcoes_colheita_id_fkey'
  ) THEN
    ALTER TABLE public.packing_recepcoes ADD CONSTRAINT packing_recepcoes_colheita_id_fkey 
      FOREIGN KEY (colheita_id) REFERENCES public.colheita_registros(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Setup RLS for packing_recepcoes
ALTER TABLE public.packing_recepcoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "packing_recepcoes_empresa" ON public.packing_recepcoes;
CREATE POLICY "packing_recepcoes_empresa" ON public.packing_recepcoes
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- Setup Storage bucket for Evidences
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidencias', 'evidencias', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "evidencias_select" ON storage.objects;
CREATE POLICY "evidencias_select" ON storage.objects 
  FOR SELECT TO public USING (bucket_id = 'evidencias');

DROP POLICY IF EXISTS "evidencias_insert" ON storage.objects;
CREATE POLICY "evidencias_insert" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidencias');
