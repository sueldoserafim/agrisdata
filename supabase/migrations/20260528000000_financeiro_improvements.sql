DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financeiro_lancamentos' AND column_name='invoice_id') THEN
    ALTER TABLE public.financeiro_lancamentos ADD COLUMN invoice_id UUID REFERENCES public.invoices_exportacao(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_financeiro_lancamentos_invoice_id ON public.financeiro_lancamentos(invoice_id);
