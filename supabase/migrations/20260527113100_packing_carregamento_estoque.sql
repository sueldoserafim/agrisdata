DO $BODY$
BEGIN
  DROP POLICY IF EXISTS "divergencias_empresa" ON public.divergencias_carregamento;
END $BODY$;

CREATE POLICY "divergencias_empresa" ON public.divergencias_carregamento
  FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.create_saida_estoque_on_carregamento()
RETURNS trigger AS $BODY$
DECLARE
  v_pallet RECORD;
  v_lote_id uuid;
BEGIN
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    FOR v_pallet IN SELECT * FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL LOOP
      SELECT id INTO v_lote_id FROM public.lotes_estoque 
      WHERE produto_id = v_pallet.produto_id AND empresa_id = NEW.empresa_id AND quantidade >= COALESCE(v_pallet.peso_liquido_kg, 0) 
      ORDER BY data_entrada ASC LIMIT 1;
      
      IF v_lote_id IS NOT NULL AND COALESCE(v_pallet.peso_liquido_kg, 0) > 0 THEN
        UPDATE public.lotes_estoque SET quantidade = quantidade - v_pallet.peso_liquido_kg WHERE id = v_lote_id;
        INSERT INTO public.estoque_movimento (empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at)
        VALUES (NEW.empresa_id, v_lote_id, 'saída', v_pallet.peso_liquido_kg, 'Expedição - Romaneio ' || COALESCE((SELECT numero_romaneio FROM public.romaneios_venda WHERE id = NEW.romaneio_id), ''), NOW());
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_saida_estoque_carregamento ON public.sessoes_carregamento;
CREATE TRIGGER trg_saida_estoque_carregamento
AFTER UPDATE ON public.sessoes_carregamento
FOR EACH ROW EXECUTE FUNCTION public.create_saida_estoque_on_carregamento();
