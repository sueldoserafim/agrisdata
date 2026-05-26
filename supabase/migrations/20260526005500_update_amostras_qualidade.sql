DO $$
BEGIN
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS safra_id uuid REFERENCES public.safras(id) ON DELETE CASCADE;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS estagio_fenologico text;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS tamanho_amostra_frutos integer;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS brix_minimo numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS brix_medio numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS brix_maximo numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS firmeza_media numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS coloracao_escala integer CHECK (coloracao_escala >= 1 AND coloracao_escala <= 9);
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS peso_medio_fruto numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS defeitos_percentual numeric CHECK (defeitos_percentual >= 0 AND defeitos_percentual <= 100);
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS acidez_titulavel numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS ratio_brix_acidez numeric;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS apto_colheita boolean DEFAULT false;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS data_estimada_colheita date;
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS fotos text[];
  ALTER TABLE public.amostras_qualidade_campo ADD COLUMN IF NOT EXISTS observacoes text;
EXCEPTION WHEN OTHERS THEN
  -- Ignore column addition errors if they somehow fail
END $$;

INSERT INTO storage.buckets (id, name, public) VALUES ('field-quality-samples', 'field-quality-samples', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "field-quality-samples-read" ON storage.objects;
CREATE POLICY "field-quality-samples-read" ON storage.objects FOR SELECT USING (bucket_id = 'field-quality-samples');

DROP POLICY IF EXISTS "field-quality-samples-insert" ON storage.objects;
CREATE POLICY "field-quality-samples-insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'field-quality-samples' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "field-quality-samples-update" ON storage.objects;
CREATE POLICY "field-quality-samples-update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'field-quality-samples' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "field-quality-samples-delete" ON storage.objects;
CREATE POLICY "field-quality-samples-delete" ON storage.objects FOR DELETE USING (bucket_id = 'field-quality-samples' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "amostras_qualidade_campo_empresa_select" ON public.amostras_qualidade_campo;
CREATE POLICY "amostras_qualidade_campo_empresa_select" ON public.amostras_qualidade_campo FOR SELECT TO authenticated USING (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "amostras_qualidade_campo_empresa_insert" ON public.amostras_qualidade_campo;
CREATE POLICY "amostras_qualidade_campo_empresa_insert" ON public.amostras_qualidade_campo FOR INSERT TO authenticated WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "amostras_qualidade_campo_empresa_update" ON public.amostras_qualidade_campo;
CREATE POLICY "amostras_qualidade_campo_empresa_update" ON public.amostras_qualidade_campo FOR UPDATE TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "amostras_qualidade_campo_empresa_delete" ON public.amostras_qualidade_campo;
CREATE POLICY "amostras_qualidade_campo_empresa_delete" ON public.amostras_qualidade_campo FOR DELETE TO authenticated USING (empresa_id = public.get_user_empresa_id());
