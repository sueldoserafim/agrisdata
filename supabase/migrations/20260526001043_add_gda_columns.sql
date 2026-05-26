DO $$
BEGIN
  -- graus_dia table modifications
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS temp_maxima numeric;
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS temp_minima numeric;
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS fonte_dados character varying;
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS gda_diario numeric;
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS safra_id uuid REFERENCES public.safras(id) ON DELETE CASCADE;
  ALTER TABLE public.graus_dia ADD COLUMN IF NOT EXISTS usuario_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  
  -- cultivares table modifications
  ALTER TABLE public.cultivares ADD COLUMN IF NOT EXISTS gda_objetivo_colheita numeric;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'graus_dia_safra_id_data_key'
  ) THEN
    ALTER TABLE public.graus_dia ADD CONSTRAINT graus_dia_safra_id_data_key UNIQUE (safra_id, data);
  END IF;
END $$;

-- Seed data to demonstrate
DO $$
DECLARE
  v_empresa_id uuid;
  v_safra_id uuid;
  v_talhao_id uuid;
  v_cultivar_id uuid;
  v_user_id uuid;
  v_data date := CURRENT_DATE - 20;
  i int;
  v_max numeric;
  v_min numeric;
  v_tbase numeric := 10;
  v_gda numeric;
BEGIN
  -- Get existing or insert
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_empresa_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    
    -- Create sample cultura/cultivar/talhao/safra if not exists or use existing
    SELECT id INTO v_safra_id FROM public.safras WHERE empresa_id = v_empresa_id LIMIT 1;
    
    IF v_safra_id IS NOT NULL THEN
      SELECT talhao_id, cultivar_id INTO v_talhao_id, v_cultivar_id FROM public.safras WHERE id = v_safra_id;
      
      -- Update target
      UPDATE public.cultivares SET gda_objetivo_colheita = 350 WHERE id = v_cultivar_id;
      
      -- Ensure we don't have existing conflicting data
      DELETE FROM public.graus_dia WHERE safra_id = v_safra_id;
      
      -- Insert 15 days of data
      FOR i IN 1..15 LOOP
        v_max := 25 + (random() * 10);
        v_min := 15 + (random() * 5);
        v_gda := GREATEST(0, ((v_max + v_min) / 2) - v_tbase);
        
        INSERT INTO public.graus_dia (
          empresa_id, talhao_id, safra_id, data, 
          temp_maxima, temp_minima, temperatura_media,
          gda_diario, fonte_dados, usuario_id
        ) VALUES (
          v_empresa_id, v_talhao_id, v_safra_id, v_data + i,
          v_max, v_min, (v_max + v_min) / 2,
          v_gda, 'inmet', v_user_id
        ) ON CONFLICT (safra_id, data) DO NOTHING;
      END LOOP;
    END IF;
  END IF;
END $$;
