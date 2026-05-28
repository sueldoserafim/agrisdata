-- Adicionar novas colunas comerciais na tabela clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS forma_pagamento_padrao text;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS desconto_padrao numeric DEFAULT 0;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS preset_prazo text;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS prazo_dias text;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS observacoes_comerciais text;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS usuario_vinculado text;
