-- Adicionar restrição única para permitir upsert em balanco_massas
ALTER TABLE public.balanco_massas ADD CONSTRAINT IF NOT EXISTS balanco_massas_safra_id_key UNIQUE (safra_id);

-- Adicionar novas colunas no balanco_massas (Módulo F)
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS exportacao_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS mercado_interno_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS doacao_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS descarte_qualidade_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS descarte_excesso_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS perda_campo_kg NUMERIC DEFAULT 0;
ALTER TABLE public.balanco_massas ADD COLUMN IF NOT EXISTS perda_packing_kg NUMERIC DEFAULT 0;

-- Adicionar coluna de destino em pallets para rastreio
ALTER TABLE public.pallets ADD COLUMN IF NOT EXISTS destino VARCHAR DEFAULT 'mercado_interno';

-- Função para verificar Carência Restante via RPC (Frontend)
CREATE OR REPLACE FUNCTION public.verificar_carencia_safra(p_safra_id uuid, p_data_colheita date)
RETURNS jsonb AS $function$
DECLARE
    v_carencia_ativa boolean := false;
    v_produto_nome text;
    v_dias_restantes integer;
BEGIN
    SELECT 
        true, p.nome, (p.carencia_dias - (p_data_colheita - oc.data_conclusao))
    INTO v_carencia_ativa, v_produto_nome, v_dias_restantes
    FROM public.operacoes_campo oc
    JOIN public.operacao_insumos oi ON oi.operacao_id = oc.id
    JOIN public.produtos p ON oi.produto_id = p.id
    WHERE oc.safra_id = p_safra_id
      AND oc.status = 'concluída'
      AND p.carencia_dias IS NOT NULL
      AND p.carencia_dias > 0
      AND oc.data_conclusao IS NOT NULL
      AND (p_data_colheita - oc.data_conclusao) < p.carencia_dias
    ORDER BY (p.carencia_dias - (p_data_colheita - oc.data_conclusao)) DESC
    LIMIT 1;

    IF v_carencia_ativa THEN
        RETURN json_build_object('ativa', true, 'produto', v_produto_nome, 'dias', v_dias_restantes)::jsonb;
    ELSE
        RETURN json_build_object('ativa', false)::jsonb;
    END IF;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função e Trigger de bloqueio duro no BD para Carência
CREATE OR REPLACE FUNCTION public.check_carencia_antes_colheita()
RETURNS trigger AS $function$
DECLARE
    v_safra_talhao uuid;
    v_carencia_ativa boolean;
    v_produto_nome text;
    v_dias_restantes integer;
BEGIN
    SELECT talhao_id INTO v_safra_talhao FROM public.safras WHERE id = NEW.safra_id;

    IF v_safra_talhao IS NOT NULL THEN
        SELECT 
            true, p.nome, (p.carencia_dias - (NEW.data_colheita - oc.data_conclusao))
        INTO v_carencia_ativa, v_produto_nome, v_dias_restantes
        FROM public.operacoes_campo oc
        JOIN public.operacao_insumos oi ON oi.operacao_id = oc.id
        JOIN public.produtos p ON oi.produto_id = p.id
        WHERE oc.safra_id = NEW.safra_id
          AND oc.status = 'concluída'
          AND p.carencia_dias IS NOT NULL
          AND p.carencia_dias > 0
          AND oc.data_conclusao IS NOT NULL
          AND (NEW.data_colheita - oc.data_conclusao) < p.carencia_dias
        LIMIT 1;

        IF v_carencia_ativa THEN
            RAISE EXCEPTION 'Não é permitido registrar colheita. O produto % ainda está em período de carência (% dias restantes).', v_produto_nome, v_dias_restantes;
        END IF;
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_carencia ON public.colheita_registros;
CREATE TRIGGER trg_check_carencia
BEFORE INSERT ON public.colheita_registros
FOR EACH ROW EXECUTE FUNCTION public.check_carencia_antes_colheita();

-- Função e Trigger para Atualizar Balanço de Massas (Colheita)
CREATE OR REPLACE FUNCTION public.update_balanco_massas_on_harvest()
RETURNS trigger AS $function$
DECLARE
    v_kg_colhidos numeric;
    v_perdas_kg numeric;
BEGIN
    v_kg_colhidos := COALESCE(NEW.producao_liquida_ton, 0) * 1000;
    v_perdas_kg := COALESCE(NEW.perdas_ton, 0) * 1000;

    INSERT INTO public.balanco_massas (empresa_id, safra_id, quantidade_colhida_kg, perda_campo_kg)
    VALUES (NEW.empresa_id, NEW.safra_id, v_kg_colhidos, v_perdas_kg)
    ON CONFLICT (safra_id) 
    DO UPDATE SET 
        quantidade_colhida_kg = COALESCE(public.balanco_massas.quantidade_colhida_kg, 0) + EXCLUDED.quantidade_colhida_kg,
        perda_campo_kg = COALESCE(public.balanco_massas.perda_campo_kg, 0) + EXCLUDED.perda_campo_kg;

    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_mass_balance_on_harvest ON public.colheita_registros;
CREATE TRIGGER trg_update_mass_balance_on_harvest
AFTER INSERT ON public.colheita_registros
FOR EACH ROW EXECUTE FUNCTION public.update_balanco_massas_on_harvest();

-- Função e Trigger para Atualizar Balanço de Massas (Pallets / Embarque)
CREATE OR REPLACE FUNCTION public.update_balanco_massas_on_pallet()
RETURNS trigger AS $function$
DECLARE
    v_safra_id uuid;
BEGIN
    IF NEW.status = 'embarcado' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'embarcado') THEN
        v_safra_id := NEW.safra_id;
        
        IF v_safra_id IS NOT NULL THEN
            INSERT INTO public.balanco_massas (empresa_id, safra_id, exportacao_kg, mercado_interno_kg)
            VALUES (
                NEW.empresa_id, 
                v_safra_id, 
                CASE WHEN NEW.destino = 'exportacao' THEN NEW.peso_kg ELSE 0 END,
                CASE WHEN NEW.destino != 'exportacao' THEN NEW.peso_kg ELSE 0 END
            )
            ON CONFLICT (safra_id)
            DO UPDATE SET 
                exportacao_kg = COALESCE(public.balanco_massas.exportacao_kg, 0) + EXCLUDED.exportacao_kg,
                mercado_interno_kg = COALESCE(public.balanco_massas.mercado_interno_kg, 0) + EXCLUDED.mercado_interno_kg;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'embarcado' AND (NEW.status IS DISTINCT FROM 'embarcado') THEN
        v_safra_id := OLD.safra_id;
        IF v_safra_id IS NOT NULL THEN
            IF OLD.destino = 'exportacao' THEN
                UPDATE public.balanco_massas
                SET exportacao_kg = COALESCE(exportacao_kg, 0) - COALESCE(OLD.peso_kg, 0)
                WHERE safra_id = v_safra_id;
            ELSE
                UPDATE public.balanco_massas
                SET mercado_interno_kg = COALESCE(mercado_interno_kg, 0) - COALESCE(OLD.peso_kg, 0)
                WHERE safra_id = v_safra_id;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_balanco_massas_pallet ON public.pallets;
CREATE TRIGGER trg_update_balanco_massas_pallet
AFTER INSERT OR UPDATE ON public.pallets
FOR EACH ROW EXECUTE FUNCTION public.update_balanco_massas_on_pallet();

-- Atualizar Função de Encerramento de Safra para validar Divergência de 0.5%
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
  v_bm RECORD;
  v_total_destinos numeric;
  v_diferenca numeric;
BEGIN
  IF NEW.status = 'encerrada' AND OLD.status != 'encerrada' THEN
    UPDATE safras SET status = 'bloqueada' WHERE talhao_id = NEW.talhao_id AND id != NEW.id AND status != 'encerrada';

    SELECT COALESCE(SUM(producao_liquida_ton), 0), COALESCE(SUM(area_colhida_ha), 0)
    INTO v_total_ton, v_total_ha
    FROM colheita_registros
    WHERE safra_id = NEW.id AND deleted_at IS NULL;

    IF v_total_ha > 0 THEN
      v_produtividade := (v_total_ton * 1000) / v_total_ha;
      
      INSERT INTO historico_produtividade_talhao (empresa_id, talhao_id, ano, produtividade_kg_ha)
      SELECT DISTINCT NEW.empresa_id, t_id, NEW.ano_safra, v_produtividade
      FROM (
        SELECT talhao_id as t_id FROM safra_talhoes WHERE safra_id = NEW.id
        UNION
        SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
      ) as t
      WHERE t_id IS NOT NULL;

      IF NEW.produtividade_planejada IS NOT NULL AND NEW.produtividade_planejada > 0 AND v_produtividade < NEW.produtividade_planejada THEN
        FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (
                NEW.empresa_id, v_admin_id, 
                'Desempenho Abaixo da Meta - ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text), 
                'A produtividade final foi de ' || ROUND(v_produtividade, 2) || ' kg/ha, ficando abaixo da meta de ' || ROUND(NEW.produtividade_planejada, 2) || ' kg/ha.', 
                'baixa_produtividade', false
            );
        END LOOP;
      END IF;
    END IF;

    UPDATE talhoes SET status_atual = 'disponível' 
    WHERE id IN (
      SELECT talhao_id FROM safra_talhoes WHERE safra_id = NEW.id
      UNION
      SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
    );

    IF v_total_ton > 0 THEN
        SELECT c.nome INTO v_cultura_nome FROM cultivares cv JOIN culturas c ON cv.cultura_id = c.id WHERE cv.id = NEW.cultivar_id LIMIT 1;
        IF v_cultura_nome IS NOT NULL THEN
            SELECT id INTO v_produto_id FROM produtos WHERE empresa_id = NEW.empresa_id AND nome = v_cultura_nome LIMIT 1;
            IF v_produto_id IS NULL THEN
                INSERT INTO produtos (empresa_id, nome, tipo, unidade_medida, status)
                VALUES (NEW.empresa_id, v_cultura_nome, 'produto_agricola', 'kg', 'ativo')
                RETURNING id INTO v_produto_id;
            END IF;

            IF NEW.fazenda_id IS NOT NULL THEN
                SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND fazenda_id = NEW.fazenda_id AND deleted_at IS NULL LIMIT 1;
            END IF;
            IF v_armazem_id IS NULL THEN
                SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND deleted_at IS NULL LIMIT 1;
            END IF;

            IF v_armazem_id IS NOT NULL THEN
                INSERT INTO lotes_estoque (empresa_id, produto_id, armazem_id, numero_lote, quantidade, data_entrada)
                VALUES (NEW.empresa_id, v_produto_id, v_armazem_id, 'SAFRA-' || COALESCE(NEW.codigo_safra, NEW.id::text), (v_total_ton * 1000), CURRENT_DATE)
                RETURNING id INTO v_lote_id;

                INSERT INTO estoque_movimento (empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at)
                VALUES (NEW.empresa_id, v_lote_id, 'entrada', (v_total_ton * 1000), 'Entrada de Safra Encerrada: ' || NEW.id, NOW());
                
                FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
                    INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
                    VALUES (NEW.empresa_id, v_admin_id, 'Entrada de Estoque - Safra', 'Lote da safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, '') || ' gerado no estoque automaticamente (' || (v_total_ton * 1000)::text || ' kg).', 'entrada_estoque', false);
                END LOOP;
            END IF;
        END IF;
    END IF;

    -- NOVO: Check de Divergência de Massa (0.5%)
    SELECT * INTO v_bm FROM public.balanco_massas WHERE safra_id = NEW.id LIMIT 1;
    IF v_bm IS NOT NULL THEN
        v_total_destinos := COALESCE(v_bm.exportacao_kg, 0) + COALESCE(v_bm.mercado_interno_kg, 0) + 
                            COALESCE(v_bm.doacao_kg, 0) + COALESCE(v_bm.descarte_qualidade_kg, 0) + 
                            COALESCE(v_bm.descarte_excesso_kg, 0) + COALESCE(v_bm.perda_campo_kg, 0) + 
                            COALESCE(v_bm.perda_packing_kg, 0);
        
        v_diferenca := ABS(COALESCE(v_bm.quantidade_colhida_kg, 0) - v_total_destinos);
        
        IF COALESCE(v_bm.quantidade_colhida_kg, 0) > 0 AND v_diferenca > (v_bm.quantidade_colhida_kg * 0.005) THEN
            FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
                INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
                VALUES (
                    NEW.empresa_id, v_admin_id, 
                    'Divergência de Balanço de Massa - ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text), 
                    'A safra foi encerrada com uma divergência de ' || ROUND(v_diferenca, 2) || ' kg entre o total colhido e os destinos registrados (acima de 0.5%).', 
                    'divergencia_massa', false
                );
            END LOOP;
        END IF;
    END IF;

    FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (NEW.empresa_id, v_admin_id, 'Safra Encerrada', 'A safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text) || ' foi encerrada e está bloqueada para edições.', 'safra_encerrada', false);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;
