DO $$
BEGIN
  -- Migration setup: Creates automated alerts for critical stock and fenology
END $$;

-- Function to check critical stock
CREATE OR REPLACE FUNCTION public.check_estoque_critico()
RETURNS trigger AS $$
DECLARE
  v_produto_id uuid;
  v_empresa_id uuid;
  v_total_estoque numeric;
  v_estoque_minimo numeric;
  v_nome_produto varchar;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_produto_id := OLD.produto_id;
    v_empresa_id := OLD.empresa_id;
  ELSE
    v_produto_id := NEW.produto_id;
    v_empresa_id := NEW.empresa_id;
  END IF;

  SELECT COALESCE(SUM(quantidade), 0) INTO v_total_estoque
  FROM public.lotes_estoque
  WHERE produto_id = v_produto_id AND empresa_id = v_empresa_id AND deleted_at IS NULL;

  SELECT estoque_minimo, nome INTO v_estoque_minimo, v_nome_produto
  FROM public.produtos
  WHERE id = v_produto_id;

  IF v_estoque_minimo IS NOT NULL AND v_total_estoque <= v_estoque_minimo THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.alertas
      WHERE empresa_id = v_empresa_id
        AND tipo = 'estoque_critico'
        AND lido = false
        AND descricao LIKE '%' || v_produto_id::text || '%'
    ) THEN
      INSERT INTO public.alertas (empresa_id, titulo, descricao, tipo, lido)
      VALUES (
        v_empresa_id,
        'Estoque Crítico: ' || v_nome_produto,
        'O estoque do produto ' || v_nome_produto || ' (ID: ' || v_produto_id || ') está em ' || v_total_estoque || ', que é igual ou inferior ao mínimo de ' || v_estoque_minimo || '.',
        'estoque_critico',
        false
      );
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check stock on lotes_estoque modifications
DROP TRIGGER IF EXISTS trigger_check_estoque_critico ON public.lotes_estoque;
CREATE TRIGGER trigger_check_estoque_critico
  AFTER INSERT OR UPDATE OR DELETE ON public.lotes_estoque
  FOR EACH ROW EXECUTE FUNCTION public.check_estoque_critico();

-- Function to generate fenology alerts manually via RPC
CREATE OR REPLACE FUNCTION public.gerar_alertas_fenologia(p_empresa_id uuid)
RETURNS void AS $$
DECLARE
  r RECORD;
  v_data_esperada date;
BEGIN
  -- RLS Security Check
  IF p_empresa_id != public.get_user_empresa_id() AND NOT public.is_admin_saas() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  FOR r IN 
    SELECT 
      s.id as safra_id,
      s.nome_safra,
      s.data_plantio,
      cf.estagio,
      cf.dias_desde_plantio,
      c.nome as cultura_nome
    FROM public.safras s
    JOIN public.cultivares cv ON s.cultivar_id = cv.id
    JOIN public.culturas c ON cv.cultura_id = c.id
    JOIN public.culturas_fenologia cf ON c.id = cf.cultura_id
    WHERE s.empresa_id = p_empresa_id
      AND s.data_plantio IS NOT NULL
      AND s.status NOT IN ('encerrada', 'cancelada')
      AND s.deleted_at IS NULL
  LOOP
    v_data_esperada := s.data_plantio + r.dias_desde_plantio;
    
    IF CURRENT_DATE >= v_data_esperada THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.alertas
        WHERE empresa_id = p_empresa_id
          AND tipo = 'manejo_fenologia'
          AND descricao LIKE '%' || r.safra_id::text || '%'
          AND descricao LIKE '%' || r.estagio || '%'
      ) THEN
        INSERT INTO public.alertas (empresa_id, titulo, descricao, tipo, lido)
        VALUES (
          p_empresa_id,
          'Aviso de Manejo: ' || r.estagio,
          'A safra ' || COALESCE(r.nome_safra, 'Sem nome') || ' atingiu o estágio "' || r.estagio || '" (Safra ID: ' || r.safra_id || '). Recomendado monitoramento.',
          'manejo_fenologia',
          false
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
