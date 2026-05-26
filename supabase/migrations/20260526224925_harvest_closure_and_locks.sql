-- Adiciona a coluna para armazenar a aprovação técnica
ALTER TABLE public.safras ADD COLUMN IF NOT EXISTS responsavel_encerramento_id uuid REFERENCES public.usuarios(id);

-- Função de bloqueio de integridade: Impede edições em safras encerradas e seus filhos
CREATE OR REPLACE FUNCTION public.check_safra_encerrada()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_status varchar;
  v_safra_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'safras' THEN
    IF OLD.status = 'encerrada' AND NEW.status != 'encerrada' THEN
      RAISE EXCEPTION 'Não é permitido reabrir uma safra encerrada.';
    END IF;
  ELSE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      v_safra_id := NEW.safra_id;
    ELSE
      v_safra_id := OLD.safra_id;
    END IF;

    SELECT status INTO v_status FROM safras WHERE id = v_safra_id;
    IF v_status = 'encerrada' THEN
      RAISE EXCEPTION 'Não é permitido criar, alterar ou deletar registros vinculados a uma safra encerrada.';
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

-- Aplica o bloqueio na tabela principal de safras
DROP TRIGGER IF EXISTS trg_block_update_safras ON public.safras;
CREATE TRIGGER trg_block_update_safras
BEFORE UPDATE ON public.safras
FOR EACH ROW
WHEN (OLD.status = 'encerrada')
EXECUTE FUNCTION public.check_safra_encerrada();

-- Aplica o bloqueio nas tabelas filhas essenciais
DROP TRIGGER IF EXISTS trg_block_update_operacoes ON public.operacoes_campo;
CREATE TRIGGER trg_block_update_operacoes
BEFORE INSERT OR UPDATE OR DELETE ON public.operacoes_campo
FOR EACH ROW
EXECUTE FUNCTION public.check_safra_encerrada();

DROP TRIGGER IF EXISTS trg_block_update_colheitas ON public.colheita_registros;
CREATE TRIGGER trg_block_update_colheitas
BEFORE INSERT OR UPDATE OR DELETE ON public.colheita_registros
FOR EACH ROW
EXECUTE FUNCTION public.check_safra_encerrada();

DROP TRIGGER IF EXISTS trg_block_update_monitoramento ON public.monitoramento_pragas;
CREATE TRIGGER trg_block_update_monitoramento
BEFORE INSERT OR UPDATE OR DELETE ON public.monitoramento_pragas
FOR EACH ROW
EXECUTE FUNCTION public.check_safra_encerrada();

-- Atualização da automação de encerramento da safra (cálculos de produtividade, talhões e alertas)
CREATE OR REPLACE FUNCTION public.ao_encerrar_safra()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_produtividade numeric;
  v_total_ton numeric := 0;
  v_total_ha numeric := 0;
  v_admin_id uuid;
BEGIN
  IF NEW.status = 'encerrada' AND OLD.status != 'encerrada' THEN
    -- Bloqueia as outras safras paralelas no mesmo talhão
    UPDATE safras SET status = 'bloqueada' WHERE talhao_id = NEW.talhao_id AND id != NEW.id AND status != 'encerrada';

    -- Calcula o somatório da colheita
    SELECT COALESCE(SUM(producao_liquida_ton), 0), COALESCE(SUM(area_colhida_ha), 0)
    INTO v_total_ton, v_total_ha
    FROM colheita_registros
    WHERE safra_id = NEW.id;

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
    END IF;

    -- Libera os talhões vinculados para ficarem disponíveis
    UPDATE talhoes 
    SET status_atual = 'disponível' 
    WHERE id IN (
      SELECT talhao_id FROM safra_talhoes WHERE safra_id = NEW.id
      UNION
      SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
    );

    -- Notifica os gestores da empresa sobre o fechamento
    FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') LOOP
        INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (NEW.empresa_id, v_admin_id, 'Safra Encerrada', 'A safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text) || ' foi encerrada e está bloqueada para edições.', 'safra_encerrada', false);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;
