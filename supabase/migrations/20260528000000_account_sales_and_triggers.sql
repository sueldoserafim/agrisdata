CREATE TABLE IF NOT EXISTS public.account_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices_exportacao(id) ON DELETE SET NULL,
    container_id UUID REFERENCES public.containers(id) ON DELETE SET NULL,
    data_venda DATE,
    valor_bruto NUMERIC DEFAULT 0,
    despesas_internacionais NUMERIC DEFAULT 0,
    comissoes NUMERIC DEFAULT 0,
    valor_liquido NUMERIC DEFAULT 0,
    margem_percentual NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'liquidado', 'cancelado')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

DROP POLICY IF EXISTS "account_sales_empresa" ON public.account_sales;
CREATE POLICY "account_sales_empresa" ON public.account_sales
    FOR ALL TO authenticated
    USING (empresa_id = public.get_user_empresa_id())
    WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.account_sales ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_account_sales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_account_sales_updated_at ON public.account_sales;
CREATE TRIGGER trg_account_sales_updated_at
    BEFORE UPDATE ON public.account_sales
    FOR EACH ROW EXECUTE FUNCTION public.set_account_sales_updated_at();

-- Trigger for Account Sale settlement -> update invoices_exportacao.status to 'paga'
CREATE OR REPLACE FUNCTION public.on_account_sale_settled()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'liquidado' AND OLD.status != 'liquidado' THEN
        IF NEW.invoice_id IS NOT NULL THEN
            UPDATE public.invoices_exportacao
            SET status = 'paga'
            WHERE id = NEW.invoice_id AND status != 'paga';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_on_account_sale_settled ON public.account_sales;
CREATE TRIGGER trg_on_account_sale_settled
    AFTER UPDATE ON public.account_sales
    FOR EACH ROW EXECUTE FUNCTION public.on_account_sale_settled();

-- Trigger on adiantamentos_internacionais to create alert
CREATE OR REPLACE FUNCTION public.on_adiantamento_created()
RETURNS TRIGGER AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    IF NEW.data_prevista_reembolso IS NOT NULL THEN
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido, created_at)
            VALUES (
                NEW.empresa_id,
                v_admin_id,
                'Reembolso de Adiantamento Previsto',
                'O adiantamento ' || NEW.numero_adiantamento || ' tem reembolso previsto para ' || TO_CHAR(NEW.data_prevista_reembolso, 'DD/MM/YYYY') || '.',
                'financeiro',
                false,
                NOW()
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_on_adiantamento_created ON public.adiantamentos_internacionais;
CREATE TRIGGER trg_on_adiantamento_created
    AFTER INSERT ON public.adiantamentos_internacionais
    FOR EACH ROW EXECUTE FUNCTION public.on_adiantamento_created();

-- Auto update lancamento status to atrasado if data_vencimento < CURRENT_DATE
CREATE OR REPLACE FUNCTION public.check_lancamento_vencimento()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pendente' AND NEW.data_vencimento IS NOT NULL AND NEW.data_vencimento < CURRENT_DATE THEN
        NEW.status := 'atrasado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_lancamento_vencimento ON public.financeiro_lancamentos;
CREATE TRIGGER trg_check_lancamento_vencimento
    BEFORE INSERT OR UPDATE ON public.financeiro_lancamentos
    FOR EACH ROW EXECUTE FUNCTION public.check_lancamento_vencimento();
