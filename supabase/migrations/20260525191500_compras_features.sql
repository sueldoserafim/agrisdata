CREATE TABLE IF NOT EXISTS public.devolucoes_compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    pedido_id UUID NOT NULL REFERENCES public.compras_pedido(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    lote_id UUID REFERENCES public.lotes_estoque(id) ON DELETE CASCADE,
    quantidade NUMERIC NOT NULL,
    motivo TEXT,
    status VARCHAR DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.compras_pedido ADD COLUMN IF NOT EXISTS avaliacao_recebimento VARCHAR;

DROP POLICY IF EXISTS "devolucoes_compras_empresa" ON public.devolucoes_compras;
CREATE POLICY "devolucoes_compras_empresa" ON public.devolucoes_compras
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

ALTER TABLE public.devolucoes_compras ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  v_empresa_id UUID;
  v_forn1_id UUID;
  v_prod_id UUID;
  v_req_id UUID;
BEGIN
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  
  IF v_empresa_id IS NOT NULL THEN
    SELECT id INTO v_prod_id FROM public.produtos WHERE empresa_id = v_empresa_id LIMIT 1;
    IF v_prod_id IS NULL THEN
        INSERT INTO public.produtos (id, empresa_id, nome, unidade_medida) VALUES (gen_random_uuid(), v_empresa_id, 'Produto Semente Teste', 'UN') RETURNING id INTO v_prod_id;
    END IF;

    SELECT id INTO v_forn1_id FROM public.fornecedores WHERE empresa_id = v_empresa_id LIMIT 1;
    IF v_forn1_id IS NULL THEN
        INSERT INTO public.fornecedores (id, empresa_id, nome) VALUES (gen_random_uuid(), v_empresa_id, 'Agro Fornecedor Teste') RETURNING id INTO v_forn1_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.compras_pedido WHERE avaliacao_recebimento IN ('conforme', 'divergente')) THEN
        INSERT INTO public.compras_requisicao (id, empresa_id, status) VALUES (gen_random_uuid(), v_empresa_id, 'aprovada') RETURNING id INTO v_req_id;

        INSERT INTO public.compras_pedido (id, empresa_id, requisicao_id, fornecedor_id, produto_id, quantidade, status, avaliacao_recebimento)
        VALUES (gen_random_uuid(), v_empresa_id, v_req_id, v_forn1_id, v_prod_id, 100, 'recebido', 'conforme');
        
        INSERT INTO public.compras_pedido (id, empresa_id, requisicao_id, fornecedor_id, produto_id, quantidade, status, avaliacao_recebimento)
        VALUES (gen_random_uuid(), v_empresa_id, v_req_id, v_forn1_id, v_prod_id, 50, 'recebido', 'conforme');

        INSERT INTO public.compras_pedido (id, empresa_id, requisicao_id, fornecedor_id, produto_id, quantidade, status, avaliacao_recebimento)
        VALUES (gen_random_uuid(), v_empresa_id, v_req_id, v_forn1_id, v_prod_id, 200, 'recebido', 'divergente');
    END IF;
  END IF;
END $$;
