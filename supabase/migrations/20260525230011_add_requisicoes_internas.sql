CREATE TABLE IF NOT EXISTS public.requisicoes_internas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    solicitante_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade NUMERIC NOT NULL CHECK (quantidade > 0),
    justificativa TEXT,
    status VARCHAR DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado')),
    aprovador_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    data_aprovacao TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.requisicoes_internas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "requisicoes_internas_empresa" ON public.requisicoes_internas;
CREATE POLICY "requisicoes_internas_empresa" ON public.requisicoes_internas
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

DROP TRIGGER IF EXISTS trigger_requisicoes_internas_updated_at ON public.requisicoes_internas;
CREATE TRIGGER trigger_requisicoes_internas_updated_at
    BEFORE UPDATE ON public.requisicoes_internas
    FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE OR REPLACE FUNCTION public.processa_aprovacao_requisicao_interna()
RETURNS trigger AS $$
DECLARE
    v_lote RECORD;
    v_qtd_restante NUMERIC;
    v_qtd_deduzir NUMERIC;
    v_estoque_total NUMERIC;
BEGIN
    IF NEW.status = 'aprovado' AND OLD.status = 'pendente' THEN
        v_qtd_restante := NEW.quantidade;

        SELECT COALESCE(SUM(quantidade), 0) INTO v_estoque_total
        FROM public.lotes_estoque
        WHERE produto_id = NEW.produto_id 
          AND empresa_id = NEW.empresa_id
          AND deleted_at IS NULL;

        IF v_estoque_total < v_qtd_restante THEN
            RAISE EXCEPTION 'Estoque insuficiente para aprovar a requisição.';
        END IF;

        FOR v_lote IN 
            SELECT * FROM public.lotes_estoque 
            WHERE produto_id = NEW.produto_id 
              AND empresa_id = NEW.empresa_id
              AND quantidade > 0
              AND deleted_at IS NULL
            ORDER BY data_validade ASC NULLS LAST, data_entrada ASC
        LOOP
            IF v_qtd_restante <= 0 THEN
                EXIT;
            END IF;

            IF v_lote.quantidade >= v_qtd_restante THEN
                v_qtd_deduzir := v_qtd_restante;
            ELSE
                v_qtd_deduzir := v_lote.quantidade;
            END IF;

            UPDATE public.lotes_estoque 
            SET quantidade = quantidade - v_qtd_deduzir,
                updated_at = NOW()
            WHERE id = v_lote.id;

            INSERT INTO public.estoque_movimento (
                empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at
            ) VALUES (
                NEW.empresa_id, v_lote.id, 'saída', v_qtd_deduzir, 'Requisição Interna: ' || NEW.id, NOW()
            );

            v_qtd_restante := v_qtd_restante - v_qtd_deduzir;
        END LOOP;

        IF v_qtd_restante > 0 THEN
            RAISE EXCEPTION 'Erro interno: Não foi possível deduzir os lotes.';
        END IF;

        NEW.data_aprovacao := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_aprovar_requisicao_interna ON public.requisicoes_internas;
CREATE TRIGGER trigger_aprovar_requisicao_interna
    BEFORE UPDATE ON public.requisicoes_internas
    FOR EACH ROW EXECUTE FUNCTION public.processa_aprovacao_requisicao_interna();
