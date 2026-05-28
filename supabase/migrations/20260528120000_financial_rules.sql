-- Fix bad data to allow constraints
UPDATE public.financeiro_lancamentos SET valor = 0.01 WHERE valor <= 0;
UPDATE public.financeiro_lancamentos SET data_pagamento = data_lancamento WHERE data_pagamento < data_lancamento;
UPDATE public.adiantamentos_internacionais SET taxa_cambio = 1 WHERE taxa_cambio <= 0;
UPDATE public.account_sales SET margem_percentual = 0 WHERE margem_percentual < 0;

-- Apply Constraints for financeiro_lancamentos
ALTER TABLE public.financeiro_lancamentos DROP CONSTRAINT IF EXISTS chk_lancamento_valor;
ALTER TABLE public.financeiro_lancamentos ADD CONSTRAINT chk_lancamento_valor CHECK (valor > 0);

ALTER TABLE public.financeiro_lancamentos DROP CONSTRAINT IF EXISTS chk_lancamento_data_pagamento;
ALTER TABLE public.financeiro_lancamentos ADD CONSTRAINT chk_lancamento_data_pagamento CHECK (data_pagamento IS NULL OR data_lancamento IS NULL OR data_pagamento >= data_lancamento);

-- Apply Constraints for adiantamentos_internacionais
ALTER TABLE public.adiantamentos_internacionais DROP CONSTRAINT IF EXISTS chk_adiantamento_taxa;
ALTER TABLE public.adiantamentos_internacionais ADD CONSTRAINT chk_adiantamento_taxa CHECK (taxa_cambio > 0);

-- Make sure account_sales has taxa_cambio, as it might not be explicitly used but needed for checks
ALTER TABLE public.account_sales ADD COLUMN IF NOT EXISTS taxa_cambio numeric DEFAULT 1;

ALTER TABLE public.account_sales DROP CONSTRAINT IF EXISTS chk_account_sales_taxa;
ALTER TABLE public.account_sales ADD CONSTRAINT chk_account_sales_taxa CHECK (taxa_cambio > 0);

ALTER TABLE public.account_sales DROP CONSTRAINT IF EXISTS chk_account_sales_margem;
ALTER TABLE public.account_sales ADD CONSTRAINT chk_account_sales_margem CHECK (margem_percentual >= 0);
