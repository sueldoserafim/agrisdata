CREATE TABLE IF NOT EXISTS public.compras_cotacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  requisicao_id UUID NOT NULL REFERENCES public.compras_requisicao(id) ON DELETE CASCADE,
  prazo_respostas DATE NOT NULL,
  status TEXT DEFAULT 'aberta',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.compras_cotacao_fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cotacao_id UUID NOT NULL REFERENCES public.compras_cotacoes(id) ON DELETE CASCADE,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE RESTRICT,
  preco_unitario NUMERIC NOT NULL,
  prazo_entrega_dias INTEGER NOT NULL,
  condicao_pagamento TEXT,
  validade_cotacao DATE,
  score_final NUMERIC,
  vencedor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.compras_cotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_cotacao_fornecedores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "compras_cotacoes_empresa" ON public.compras_cotacoes;
CREATE POLICY "compras_cotacoes_empresa" ON public.compras_cotacoes
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "compras_cotacao_fornecedores_empresa" ON public.compras_cotacao_fornecedores;
CREATE POLICY "compras_cotacao_fornecedores_empresa" ON public.compras_cotacao_fornecedores
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE OR REPLACE TRIGGER trigger_compras_cotacoes_updated_at 
  BEFORE UPDATE ON public.compras_cotacoes 
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE OR REPLACE TRIGGER trigger_compras_cotacao_fornecedores_updated_at 
  BEFORE UPDATE ON public.compras_cotacao_fornecedores 
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
