DO $$
BEGIN
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS laboratorio TEXT;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS metodologia TEXT;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS calcio NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS magnesio NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS enxofre NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS boro NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS zinco NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS ferro NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS manganes NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS cobre NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS ctc NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS saturacao_bases NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS argila NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS areia NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS silte NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS calcario_recomendado NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS gesso_recomendado NUMERIC;
  ALTER TABLE public.analises_solo ADD COLUMN IF NOT EXISTS laudo_pdf_url TEXT;
END $$;

DROP POLICY IF EXISTS "analises_solo_empresa" ON public.analises_solo;
CREATE POLICY "analises_solo_empresa" ON public.analises_solo
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

INSERT INTO storage.buckets (id, name, public) 
VALUES ('laudos_solo', 'laudos_solo', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Laudos Solo Select" ON storage.objects;
CREATE POLICY "Laudos Solo Select" ON storage.objects 
  FOR SELECT TO authenticated USING (bucket_id = 'laudos_solo');

DROP POLICY IF EXISTS "Laudos Solo Insert" ON storage.objects;
CREATE POLICY "Laudos Solo Insert" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'laudos_solo');

DROP POLICY IF EXISTS "Laudos Solo Update" ON storage.objects;
CREATE POLICY "Laudos Solo Update" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'laudos_solo');

DROP POLICY IF EXISTS "Laudos Solo Delete" ON storage.objects;
CREATE POLICY "Laudos Solo Delete" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'laudos_solo');
