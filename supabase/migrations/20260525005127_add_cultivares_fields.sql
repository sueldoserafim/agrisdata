ALTER TABLE public.cultivares 
  ADD COLUMN IF NOT EXISTS codigo_interno TEXT,
  ADD COLUMN IF NOT EXISTS pais_origem TEXT,
  ADD COLUMN IF NOT EXISTS detentor_licenciador TEXT,
  ADD COLUMN IF NOT EXISTS produtividade_esperada_t_ha NUMERIC,
  ADD COLUMN IF NOT EXISTS shelf_life_ideal_dias INTEGER,
  ADD COLUMN IF NOT EXISTS shelf_life_minimo_dias INTEGER;
