DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    tipo VARCHAR NOT NULL,
    lido BOOLEAN DEFAULT false,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  ALTER TABLE public.lotes_estoque ADD COLUMN IF NOT EXISTS data_fabricacao DATE;
  ALTER TABLE public.lotes_estoque ADD COLUMN IF NOT EXISTS localizacao VARCHAR;

  ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
END $$;

DROP POLICY IF EXISTS "alertas_empresa" ON public.alertas;
CREATE POLICY "alertas_empresa" ON public.alertas
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));
