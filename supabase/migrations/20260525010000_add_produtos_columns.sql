DO $$
DECLARE
  seed_empresa_id uuid;
BEGIN
  -- 1. Add new columns for the comprehensive product catalog
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS codigo_interno text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS categoria text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS fabricante_marca text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS estoque_minimo integer;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS prazo_validade_dias integer;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS codigo_ncm text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS classe_risco text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo';
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS registro_mapa text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS classe_toxicologica text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS carencia_dias integer;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS exige_receituario boolean;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS ingrediente_ativo text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS recomendacao_uso text;
  ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS visivel_operadores boolean DEFAULT true;

  -- 2. Seed initial data to prevent empty states
  SELECT id INTO seed_empresa_id FROM public.empresas LIMIT 1;
  
  IF seed_empresa_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.produtos WHERE nome = 'Roundup Original' AND empresa_id = seed_empresa_id) THEN
      INSERT INTO public.produtos (id, empresa_id, nome, categoria, tipo, unidade_medida, preco_unitario, status, classe_toxicologica, exige_receituario, visivel_operadores)
      VALUES (gen_random_uuid(), seed_empresa_id, 'Roundup Original', 'defensivo', 'Herbicida', 'L', 45.90, 'ativo', 'classe II', true, true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.produtos WHERE nome = 'Ureia Agrícola' AND empresa_id = seed_empresa_id) THEN
      INSERT INTO public.produtos (id, empresa_id, nome, categoria, tipo, unidade_medida, preco_unitario, status, visivel_operadores)
      VALUES (gen_random_uuid(), seed_empresa_id, 'Ureia Agrícola', 'fertilizante', 'Nitrogenado', 'kg', 3.50, 'ativo', true);
    END IF;
  END IF;
END $$;
