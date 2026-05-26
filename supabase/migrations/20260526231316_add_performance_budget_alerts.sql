-- Update ao_encerrar_safra to include productivity alert
CREATE OR REPLACE FUNCTION public.ao_encerrar_safra()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_produtividade numeric;
  v_total_ton numeric := 0;
  v_total_ha numeric := 0;
  v_admin_id uuid;
  v_produto_id uuid;
  v_armazem_id uuid;
  v_lote_id uuid;
  v_cultura_nome text;
BEGIN
  IF NEW.status = 'encerrada' AND OLD.status != 'encerrada' THEN
    -- Bloqueia as outras safras paralelas no mesmo talhão
    UPDATE safras SET status = 'bloqueada' WHERE talhao_id = NEW.talhao_id AND id != NEW.id AND status != 'encerrada';

    -- Calcula o somatório da colheita
    SELECT COALESCE(SUM(producao_liquida_ton), 0), COALESCE(SUM(area_colhida_ha), 0)
    INTO v_total_ton, v_total_ha
    FROM colheita_registros
    WHERE safra_id = NEW.id AND deleted_at IS NULL;

    IF v_total_ha > 0 THEN
      -- Produtividade = (Toneladas Líquidas * 1000) / Área
      v_produtividade := (v_total_ton * 1000) / v_total_ha;
      
      -- Salva o histórico consolidado de produtividade do talhão
      INSERT INTO historico_produtividade_talhao (empresa_id, talhao_id, ano, produtividade_kg_ha)
      SELECT DISTINCT NEW.empresa_id, t_id, NEW.ano_safra, v_produtividade
      FROM (
        SELECT talhao_id as t_id FROM safra_talhoes WHERE safra_id = NEW.id
        UNION
        SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
      ) as t
      WHERE t_id IS NOT NULL;

      -- NOVO: Alerta de Produtividade Abaixo da Meta
      IF NEW.produtividade_planejada IS NOT NULL AND NEW.produtividade_planejada > 0 AND v_produtividade < NEW.produtividade_planejada THEN
        FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (
                NEW.empresa_id, 
                v_admin_id, 
                'Desempenho Abaixo da Meta - ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text), 
                'A produtividade final foi de ' || ROUND(v_produtividade, 2) || ' kg/ha, ficando abaixo da meta de ' || ROUND(NEW.produtividade_planejada, 2) || ' kg/ha.', 
                'baixa_produtividade', 
                false
            );
        END LOOP;
      END IF;
    END IF;

    -- Libera os talhões vinculados para ficarem disponíveis
    UPDATE talhoes 
    SET status_atual = 'disponível' 
    WHERE id IN (
      SELECT talhao_id FROM safra_talhoes WHERE safra_id = NEW.id
      UNION
      SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
    );

    -- ESTOQUE AUTOMÁTICO
    IF v_total_ton > 0 THEN
        -- Pegar o nome da cultura
        SELECT c.nome INTO v_cultura_nome 
        FROM cultivares cv JOIN culturas c ON cv.cultura_id = c.id 
        WHERE cv.id = NEW.cultivar_id LIMIT 1;

        IF v_cultura_nome IS NOT NULL THEN
            -- Buscar produto relacionado, ou criar se não existir
            SELECT id INTO v_produto_id FROM produtos WHERE empresa_id = NEW.empresa_id AND nome = v_cultura_nome LIMIT 1;
            IF v_produto_id IS NULL THEN
                INSERT INTO produtos (empresa_id, nome, tipo, unidade_medida, status)
                VALUES (NEW.empresa_id, v_cultura_nome, 'produto_agricola', 'kg', 'ativo')
                RETURNING id INTO v_produto_id;
            END IF;

            -- Buscar armazém padrão da fazenda ou o primeiro da empresa
            IF NEW.fazenda_id IS NOT NULL THEN
                SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND fazenda_id = NEW.fazenda_id AND deleted_at IS NULL LIMIT 1;
            END IF;
            
            IF v_armazem_id IS NULL THEN
                SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND deleted_at IS NULL LIMIT 1;
            END IF;

            IF v_armazem_id IS NOT NULL THEN
                -- Criar Lote
                INSERT INTO lotes_estoque (empresa_id, produto_id, armazem_id, numero_lote, quantidade, data_entrada)
                VALUES (NEW.empresa_id, v_produto_id, v_armazem_id, 'SAFRA-' || COALESCE(NEW.codigo_safra, NEW.id::text), (v_total_ton * 1000), CURRENT_DATE)
                RETURNING id INTO v_lote_id;

                -- Movimento
                INSERT INTO estoque_movimento (empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at)
                VALUES (NEW.empresa_id, v_lote_id, 'entrada', (v_total_ton * 1000), 'Entrada de Safra Encerrada: ' || NEW.id, NOW());
                
                -- Alertas para Gestores de Estoque
                FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
                    INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
                    VALUES (NEW.empresa_id, v_admin_id, 'Entrada de Estoque - Safra', 'Lote da safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, '') || ' gerado no estoque automaticamente (' || (v_total_ton * 1000)::text || ' kg).', 'entrada_estoque', false);
                END LOOP;
            END IF;
        END IF;
    END IF;

    -- Notifica os gestores da empresa sobre o fechamento
    FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (NEW.empresa_id, v_admin_id, 'Safra Encerrada', 'A safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text) || ' foi encerrada e está bloqueada para edições.', 'safra_encerrada', false);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create new function for budget alerts
CREATE OR REPLACE FUNCTION public.check_limite_orcamentario()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_total_custos numeric;
  v_orcamento_total numeric;
  v_empresa_id uuid;
  v_safra_id uuid;
  v_safra_identificador text;
  v_admin_id uuid;
  v_alerta_existente boolean;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_safra_id := OLD.safra_id;
    v_empresa_id := OLD.empresa_id;
  ELSE
    v_safra_id := NEW.safra_id;
    v_empresa_id := NEW.empresa_id;
  END IF;

  SELECT orcamento_total, COALESCE(nome_safra, codigo_safra, id::text)
  INTO v_orcamento_total, v_safra_identificador
  FROM public.safras
  WHERE id = v_safra_id;

  IF v_orcamento_total IS NULL OR v_orcamento_total <= 0 THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(SUM(valor), 0)
  INTO v_total_custos
  FROM public.custos_talhao
  WHERE safra_id = v_safra_id AND deleted_at IS NULL;

  IF v_total_custos > v_orcamento_total THEN
    SELECT EXISTS (
      SELECT 1 FROM public.alertas
      WHERE empresa_id = v_empresa_id
        AND tipo = 'estouro_orcamento'
        AND lido = false
        AND descricao LIKE '%' || v_safra_id::text || '%'
    ) INTO v_alerta_existente;

    IF NOT v_alerta_existente THEN
      FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = v_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (
          v_empresa_id,
          v_admin_id,
          'Orçamento Excedido - ' || v_safra_identificador,
          'O custo total acumulado (' || ROUND(v_total_custos, 2) || ') ultrapassou o limite orçamentário de ' || ROUND(v_orcamento_total, 2) || '. (Safra ID: ' || v_safra_id::text || ')',
          'estouro_orcamento',
          false
        );
      END LOOP;
    END IF;
  END IF;

  RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_check_limite_orcamentario ON public.custos_talhao;
CREATE TRIGGER trigger_check_limite_orcamentario
AFTER INSERT OR UPDATE ON public.custos_talhao
FOR EACH ROW EXECUTE FUNCTION public.check_limite_orcamentario();
