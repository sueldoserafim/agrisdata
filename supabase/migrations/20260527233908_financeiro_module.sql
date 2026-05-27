DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sueldo@suportesigma.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Sueldo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
    SELECT new_user_id, 'sueldo@suportesigma.com', 'Sueldo', 'admin_saas', id, true
    FROM public.empresas LIMIT 1
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.plano_contas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR CHECK (tipo IN ('ativo', 'passivo', 'receita', 'despesa', 'custo')),
  natureza VARCHAR CHECK (natureza IN ('sintetica', 'analitica')),
  pai_id UUID REFERENCES public.plano_contas(id) ON DELETE SET NULL,
  nivel INT DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.contas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_banco TEXT NOT NULL,
  agencia TEXT,
  conta TEXT,
  tipo VARCHAR CHECK (tipo IN ('corrente', 'poupanca', 'aplicacao', 'exterior')),
  moeda VARCHAR CHECK (moeda IN ('brl', 'usd', 'eur')),
  saldo_inicial NUMERIC DEFAULT 0,
  saldo_atual NUMERIC DEFAULT 0,
  data_saldo DATE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.financeiro_lancamentos
  ADD COLUMN IF NOT EXISTS conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plano_conta_id UUID REFERENCES public.plano_contas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS data_lancamento DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS data_pagamento DATE,
  ADD COLUMN IF NOT EXISTS documento TEXT,
  ADD COLUMN IF NOT EXISTS parcela INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_parcelas INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS centro_custo_id UUID REFERENCES public.centros_custo(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS observacoes TEXT;

CREATE TABLE IF NOT EXISTS public.conta_corrente_produtor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  produtor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL,
  tipo_movimento VARCHAR CHECK (tipo_movimento IN ('adiantamento', 'entrega', 'desconto', 'pagamento')),
  data_movimento DATE,
  descricao TEXT,
  valor NUMERIC DEFAULT 0,
  saldo NUMERIC DEFAULT 0,
  documento TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.adiantamentos_internacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices_exportacao(id) ON DELETE SET NULL,
  numero_adiantamento TEXT NOT NULL,
  data_adiantamento DATE,
  valor_usd NUMERIC DEFAULT 0,
  valor_brl NUMERIC DEFAULT 0,
  taxa_cambio NUMERIC DEFAULT 1,
  data_prevista_reembolso DATE,
  status VARCHAR CHECK (status IN ('pendente', 'reembolsado', 'parcial', 'cancelado')) DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(empresa_id, numero_adiantamento)
);

ALTER TABLE public.plano_contas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plano_contas_empresa" ON public.plano_contas;
CREATE POLICY "plano_contas_empresa" ON public.plano_contas FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

ALTER TABLE public.contas_bancarias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contas_bancarias_empresa" ON public.contas_bancarias;
CREATE POLICY "contas_bancarias_empresa" ON public.contas_bancarias FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

ALTER TABLE public.conta_corrente_produtor ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conta_corrente_produtor_empresa" ON public.conta_corrente_produtor;
CREATE POLICY "conta_corrente_produtor_empresa" ON public.conta_corrente_produtor FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

ALTER TABLE public.adiantamentos_internacionais ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "adiantamentos_internacionais_empresa" ON public.adiantamentos_internacionais;
CREATE POLICY "adiantamentos_internacionais_empresa" ON public.adiantamentos_internacionais FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.atualizar_saldo_conta_bancaria()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_diff numeric := 0;
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status IN ('pago', 'recebido') AND NEW.conta_bancaria_id IS NOT NULL THEN
            IF NEW.tipo IN ('receita', 'transferencia_entrada') THEN
                v_diff := NEW.valor;
            ELSE
                v_diff := -NEW.valor;
            END IF;
            UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = NEW.conta_bancaria_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status IN ('pago', 'recebido') AND OLD.conta_bancaria_id IS NOT NULL THEN
            IF OLD.tipo IN ('receita', 'transferencia_entrada') THEN
                v_diff := -OLD.valor;
            ELSE
                v_diff := OLD.valor;
            END IF;
            UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = OLD.conta_bancaria_id;
        END IF;

        IF NEW.status IN ('pago', 'recebido') AND NEW.conta_bancaria_id IS NOT NULL THEN
            IF NEW.tipo IN ('receita', 'transferencia_entrada') THEN
                v_diff := NEW.valor;
            ELSE
                v_diff := -NEW.valor;
            END IF;
            UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = NEW.conta_bancaria_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status IN ('pago', 'recebido') AND OLD.conta_bancaria_id IS NOT NULL THEN
            IF OLD.tipo IN ('receita', 'transferencia_entrada') THEN
                v_diff := -OLD.valor;
            ELSE
                v_diff := OLD.valor;
            END IF;
            UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = OLD.conta_bancaria_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS trg_atualizar_saldo_conta_bancaria ON public.financeiro_lancamentos;
CREATE TRIGGER trg_atualizar_saldo_conta_bancaria
AFTER INSERT OR UPDATE OR DELETE ON public.financeiro_lancamentos
FOR EACH ROW EXECUTE FUNCTION public.atualizar_saldo_conta_bancaria();
