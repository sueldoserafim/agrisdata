DO $$
BEGIN
  ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS itens JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE public.compras_requisicao ADD COLUMN IF NOT EXISTS pedido_gerado BOOLEAN DEFAULT false;
END $$;
