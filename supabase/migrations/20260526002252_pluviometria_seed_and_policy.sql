DO $$
DECLARE
  v_empresa_id uuid;
  v_talhao_id uuid;
BEGIN
  -- Re-create policy to make sure WITH CHECK exists and restrict to authenticated
  DROP POLICY IF EXISTS "pluviometria_empresa" ON public.pluviometria;
  
  CREATE POLICY "pluviometria_empresa" ON public.pluviometria
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

  -- Seed data
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  
  IF v_empresa_id IS NOT NULL THEN
    SELECT id INTO v_talhao_id FROM public.talhoes WHERE empresa_id = v_empresa_id LIMIT 1;
    
    IF v_talhao_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM public.pluviometria WHERE talhao_id = v_talhao_id AND data = CURRENT_DATE - INTERVAL '1 day') THEN
        INSERT INTO public.pluviometria (id, empresa_id, talhao_id, data, precipitacao_mm)
        VALUES 
          (gen_random_uuid(), v_empresa_id, v_talhao_id, CURRENT_DATE - INTERVAL '1 day', 15.5),
          (gen_random_uuid(), v_empresa_id, v_talhao_id, CURRENT_DATE - INTERVAL '2 days', 5.0),
          (gen_random_uuid(), v_empresa_id, v_talhao_id, CURRENT_DATE - INTERVAL '5 days', 22.3);
      END IF;
    END IF;
  END IF;
END $$;
