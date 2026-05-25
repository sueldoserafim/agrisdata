-- Adicionar colunas em armazens
ALTER TABLE public.armazens
ADD COLUMN IF NOT EXISTS fazenda_id UUID REFERENCES public.fazendas(id),
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50),
ADD COLUMN IF NOT EXISTS responsavel_id UUID REFERENCES public.usuarios(id),
ADD COLUMN IF NOT EXISTS usa_peps BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperatura_controlada BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temp_minima NUMERIC,
ADD COLUMN IF NOT EXISTS temp_maxima NUMERIC;

-- Alterar compras_pedido para o novo fluxo
ALTER TABLE public.compras_pedido
ALTER COLUMN fornecedor_id DROP NOT NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS numero_nota_fiscal VARCHAR(100);

-- Recriar politicas de RLS (Idempotente)
DROP POLICY IF EXISTS "armazens_empresa" ON public.armazens;
CREATE POLICY "armazens_empresa" ON public.armazens
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "compras_requisicao_empresa" ON public.compras_requisicao;
CREATE POLICY "compras_requisicao_empresa" ON public.compras_requisicao
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "compras_pedido_empresa" ON public.compras_pedido;
CREATE POLICY "compras_pedido_empresa" ON public.compras_pedido
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "lotes_estoque_empresa" ON public.lotes_estoque;
CREATE POLICY "lotes_estoque_empresa" ON public.lotes_estoque
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "estoque_movimento_empresa" ON public.estoque_movimento;
CREATE POLICY "estoque_movimento_empresa" ON public.estoque_movimento
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "fornecedores_empresa" ON public.fornecedores;
CREATE POLICY "fornecedores_empresa" ON public.fornecedores
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())) WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
