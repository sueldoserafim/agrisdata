-- Cost Transfer and Status Progression on Transplant
DROP TRIGGER IF EXISTS trg_transplantio_automations ON public.transplantios;

CREATE OR REPLACE FUNCTION public.transplantio_automations()
RETURNS trigger AS $function$
DECLARE
  v_centro_custo_id uuid;
BEGIN
  -- Execute only when confirmado becomes true
  IF NEW.confirmado = true AND (TG_OP = 'INSERT' OR OLD.confirmado = false) THEN
    
    -- 1. Cost Transfer
    IF NEW.custo_transferido > 0 THEN
      -- Try to find centro de custo
      SELECT id INTO v_centro_custo_id FROM public.centros_custo WHERE empresa_id = NEW.empresa_id AND nome = 'Mudas / Viveiro' LIMIT 1;
      
      IF v_centro_custo_id IS NULL THEN
        INSERT INTO public.centros_custo (empresa_id, nome, codigo) 
        VALUES (NEW.empresa_id, 'Mudas / Viveiro', 'MUD') 
        RETURNING id INTO v_centro_custo_id;
      END IF;

      INSERT INTO public.custos_talhao (
        empresa_id, talhao_id, safra_id, centro_custo_id, descricao, valor, data_lancamento
      ) VALUES (
        NEW.empresa_id, NEW.talhao_id, NEW.safra_id, v_centro_custo_id,
        'Custo Transferido - Lote de Mudas (Transplantio)',
        NEW.custo_transferido,
        NEW.data_transplantio
      );
    END IF;
    
    -- 2. Status Progression
    IF NEW.safra_id IS NOT NULL THEN
      UPDATE public.safras SET status = 'em_plantio' WHERE id = NEW.safra_id AND status = 'planejada';
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transplantio_automations
  AFTER INSERT OR UPDATE ON public.transplantios
  FOR EACH ROW EXECUTE FUNCTION public.transplantio_automations();
