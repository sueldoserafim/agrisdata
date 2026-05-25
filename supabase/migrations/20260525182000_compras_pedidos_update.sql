DO $$
BEGIN
  ALTER TABLE public.compras_pedido ADD COLUMN IF NOT EXISTS condicoes_pagamento text;
  ALTER TABLE public.compras_pedido ADD COLUMN IF NOT EXISTS total_pedido numeric;
  ALTER TABLE public.compras_pedido ADD COLUMN IF NOT EXISTS observacoes text;
  ALTER TABLE public.compras_pedido ADD COLUMN IF NOT EXISTS data_pedido date DEFAULT CURRENT_DATE;
END $$;
