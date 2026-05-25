DO $$
BEGIN
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS nome_safra VARCHAR(150);
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS codigo_safra VARCHAR(50);
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS area_planejada_ha NUMERIC;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS densidade_plantio INTEGER;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS produtividade_planejada NUMERIC;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS meta_producao_kg NUMERIC;
  ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS orcamento_total NUMERIC;
END $$;
