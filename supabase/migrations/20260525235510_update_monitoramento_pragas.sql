DO $$
BEGIN
  -- Add new columns to monitoramento_pragas
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS safra_id UUID REFERENCES public.safras(id) ON DELETE CASCADE;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS responsavel_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS area_afetada_percentual NUMERIC;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS num_armadilhas INTEGER;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS num_capturas INTEGER;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS latitude NUMERIC;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS longitude NUMERIC;
  ALTER TABLE public.monitoramento_pragas ADD COLUMN IF NOT EXISTS fotos TEXT[];
END $$;

-- Fix RLS for monitoramento_pragas
DROP POLICY IF EXISTS "monitoramento_pragas_empresa" ON public.monitoramento_pragas;
CREATE POLICY "monitoramento_pragas_empresa" ON public.monitoramento_pragas
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- Create Storage Bucket for evidence
INSERT INTO storage.buckets (id, name, public) 
VALUES ('monitoramento-evidencias', 'monitoramento-evidencias', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT TO public 
  USING (bucket_id = 'monitoramento-evidencias');

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'monitoramento-evidencias');

DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects 
  FOR DELETE TO authenticated 
  USING (bucket_id = 'monitoramento-evidencias');
