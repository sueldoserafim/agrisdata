-- Trigger to monitor replantios and generate alerts for contingency stock

CREATE OR REPLACE FUNCTION public.check_contingency_stock_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_total_replantado integer;
  v_transplantio record;
  v_admin_id uuid;
  v_alerta_existente boolean;
  v_limite integer;
BEGIN
  -- We calculate the total replanted for this transplantio
  SELECT COALESCE(SUM(quantidade_replantada), 0)
  INTO v_total_replantado
  FROM public.replantios
  WHERE transplantio_id = NEW.transplantio_id AND deleted_at IS NULL;

  -- Get transplantio details
  SELECT t.quantidade_transplantada, t.empresa_id, s.id as safra_id, 
         COALESCE(s.nome_safra, s.codigo_safra, s.id::text) as safra_identificador, 
         th.nome as talhao_nome
  INTO v_transplantio
  FROM public.transplantios t
  LEFT JOIN public.safras s ON t.safra_id = s.id
  LEFT JOIN public.talhoes th ON t.talhao_id = th.id
  WHERE t.id = NEW.transplantio_id;

  IF FOUND AND COALESCE(v_transplantio.quantidade_transplantada, 0) > 0 THEN
    v_limite := v_transplantio.quantidade_transplantada * 0.10;

    IF v_total_replantado > v_limite THEN
      -- Check if alert already exists to prevent spam
      SELECT EXISTS (
        SELECT 1 FROM public.alertas
        WHERE empresa_id = v_transplantio.empresa_id
          AND tipo = 'alerta_replantio'
          AND lido = false
          AND descricao LIKE '%' || NEW.transplantio_id::text || '%'
      ) INTO v_alerta_existente;

      IF NOT v_alerta_existente THEN
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_transplantio.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
          INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
          VALUES (
            v_transplantio.empresa_id,
            v_admin_id,
            'Alerta de Contingência: Alto Replantio',
            'O volume de replantio (' || v_total_replantado || ' mudas) ultrapassou o limite de 10% do total transplantado na Safra ' || COALESCE(v_transplantio.safra_identificador, 'N/A') || ' - Talhão ' || COALESCE(v_transplantio.talhao_nome, 'N/A') || '. Motivo recente: ' || COALESCE(NEW.motivo, 'Não informado') || '. (Transplantio ID: ' || NEW.transplantio_id::text || ')',
            'alerta_replantio',
            false
          );
        END LOOP;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_contingency_stock_alert ON public.replantios;
CREATE TRIGGER trigger_contingency_stock_alert
 AFTER INSERT OR UPDATE ON public.replantios
 FOR EACH ROW EXECUTE FUNCTION public.check_contingency_stock_alert();
