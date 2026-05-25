ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS prioridade VARCHAR(50);
ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS justificativa TEXT;
ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS valor_total_estimado NUMERIC(15,2);
ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL;
ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS observacoes TEXT;

DROP POLICY IF EXISTS "compras_requisicao_empresa" ON public.compras_requisicao;
CREATE POLICY "compras_requisicao_empresa" ON public.compras_requisicao
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

DROP POLICY IF EXISTS "compras_pedido_empresa" ON public.compras_pedido;
CREATE POLICY "compras_pedido_empresa" ON public.compras_pedido
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
