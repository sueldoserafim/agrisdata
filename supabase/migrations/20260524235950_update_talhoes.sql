DO $$
BEGIN
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS codigo_talhao VARCHAR(50);
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS area_plantavel_ha NUMERIC;
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS altitude INTEGER;
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS tem_irrigacao BOOLEAN DEFAULT FALSE;
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS tipo_irrigacao VARCHAR(50);
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS latitude NUMERIC;
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS longitude NUMERIC;
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS numero_globalgap VARCHAR(100);
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS referencia_car VARCHAR(100);
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS status_atual VARCHAR(50) DEFAULT 'disponível';
  ALTER TABLE public.talhoes ADD COLUMN IF NOT EXISTS observacoes TEXT;
END $$;

-- Ensure RLS is properly enforced for talhoes
DROP POLICY IF EXISTS "talhoes_empresa" ON public.talhoes;
CREATE POLICY "talhoes_empresa" ON public.talhoes
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));
