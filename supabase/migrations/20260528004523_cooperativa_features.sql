-- 1. Alter fornecedores
ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS is_cooperado BOOLEAN DEFAULT false;
ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS nome_propriedade TEXT;
ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS area_total_ha NUMERIC;

-- 2. Create cooperados_contratos
CREATE TABLE IF NOT EXISTS public.cooperados_contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
    safra_id UUID NOT NULL REFERENCES public.safras(id) ON DELETE CASCADE,
    talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
    percentual_participacao NUMERIC(7,4) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coop_contratos_empresa ON public.cooperados_contratos(empresa_id);

DROP POLICY IF EXISTS "cooperados_contratos_empresa" ON public.cooperados_contratos;
CREATE POLICY "cooperados_contratos_empresa" ON public.cooperados_contratos
    FOR ALL TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());

ALTER TABLE public.cooperados_contratos ENABLE ROW LEVEL SECURITY;

-- 3. Alter pallets for multi-producer
ALTER TABLE public.pallets ADD COLUMN IF NOT EXISTS produtor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL;

-- 4. Alter conta_corrente_produtor constraint
ALTER TABLE public.conta_corrente_produtor DROP CONSTRAINT IF EXISTS conta_corrente_produtor_tipo_movimento_check;
ALTER TABLE public.conta_corrente_produtor ADD CONSTRAINT conta_corrente_produtor_tipo_movimento_check 
    CHECK (tipo_movimento IN ('adiantamento', 'entrega', 'desconto', 'pagamento', 'rateio_receita', 'rateio_custo'));

-- 5. Triggers for Vacaria Animals Status
CREATE OR REPLACE FUNCTION public.check_animal_vivo() RETURNS trigger AS $$
DECLARE
    v_status text;
BEGIN
    SELECT status INTO v_status FROM public.vacaria_animais WHERE id = NEW.animal_id;
    IF v_status IN ('morto', 'vendido') THEN
        RAISE EXCEPTION 'Não é possível registrar eventos (saúde, produção, reprodução) para animais mortos ou vendidos.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_animal_vivo_reproducao ON public.vacaria_eventos_reprodutivos;
CREATE TRIGGER trg_check_animal_vivo_reproducao BEFORE INSERT OR UPDATE ON public.vacaria_eventos_reprodutivos FOR EACH ROW EXECUTE FUNCTION public.check_animal_vivo();

DROP TRIGGER IF EXISTS trg_check_animal_vivo_producao ON public.vacaria_producao_leite;
CREATE TRIGGER trg_check_animal_vivo_producao BEFORE INSERT OR UPDATE ON public.vacaria_producao_leite FOR EACH ROW EXECUTE FUNCTION public.check_animal_vivo();

DROP TRIGGER IF EXISTS trg_check_animal_vivo_saude ON public.vacaria_saude_animal;
CREATE TRIGGER trg_check_animal_vivo_saude BEFORE INSERT OR UPDATE ON public.vacaria_saude_animal FOR EACH ROW EXECUTE FUNCTION public.check_animal_vivo();

-- 6. Trigger for Automated Rateio - Custo
CREATE OR REPLACE FUNCTION public.trg_rateio_custo_talhao() RETURNS trigger AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT * FROM public.cooperados_contratos WHERE safra_id = NEW.safra_id AND (talhao_id IS NULL OR talhao_id = NEW.talhao_id) AND deleted_at IS NULL LOOP
        INSERT INTO public.conta_corrente_produtor (
            empresa_id, produtor_id, safra_id, tipo_movimento, data_movimento, descricao, valor, saldo
        ) VALUES (
            NEW.empresa_id, r.fornecedor_id, NEW.safra_id, 'rateio_custo', NEW.data_lancamento, 'Rateio de Custo Automático: ' || NEW.descricao, -(ROUND((NEW.valor * r.percentual_participacao / 100.0), 4)), 0
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rateio_custo ON public.custos_talhao;
CREATE TRIGGER trg_rateio_custo AFTER INSERT ON public.custos_talhao FOR EACH ROW EXECUTE FUNCTION public.trg_rateio_custo_talhao();

-- 7. Trigger for Automated Rateio - Receita
CREATE OR REPLACE FUNCTION public.trg_rateio_receita_account_sales() RETURNS trigger AS $$
DECLARE
    v_total_peso numeric := 0;
    r RECORD;
BEGIN
    IF NEW.status = 'liquidado' AND OLD.status != 'liquidado' THEN
        IF NEW.container_id IS NOT NULL THEN
            SELECT COALESCE(SUM(peso_liquido_kg), 0) INTO v_total_peso 
            FROM public.pallets 
            WHERE romaneio_id IN (SELECT id FROM public.romaneios_venda WHERE container_id = NEW.container_id) 
              AND deleted_at IS NULL;
              
            IF v_total_peso > 0 THEN
                FOR r IN 
                    SELECT produtor_id, safra_id, COALESCE(SUM(peso_liquido_kg), 0) as peso_produtor 
                    FROM public.pallets 
                    WHERE romaneio_id IN (SELECT id FROM public.romaneios_venda WHERE container_id = NEW.container_id) 
                      AND produtor_id IS NOT NULL AND deleted_at IS NULL
                    GROUP BY produtor_id, safra_id
                LOOP
                    INSERT INTO public.conta_corrente_produtor (
                        empresa_id, produtor_id, safra_id, tipo_movimento, data_movimento, descricao, valor, saldo
                    ) VALUES (
                        NEW.empresa_id, r.produtor_id, r.safra_id, 'rateio_receita', NEW.data_venda, 'Rateio Receita Venda Container (Acc Sales)', ROUND((NEW.valor_liquido * r.peso_produtor / v_total_peso), 4), 0
                    );
                END LOOP;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rateio_receita ON public.account_sales;
CREATE TRIGGER trg_rateio_receita AFTER UPDATE ON public.account_sales FOR EACH ROW EXECUTE FUNCTION public.trg_rateio_receita_account_sales();

-- 8. Seed
DO $$
DECLARE
    new_user_id uuid;
    v_empresa_id uuid;
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
            '', '', '', '', '', NULL, '', '', ''
        );

        SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
        IF v_empresa_id IS NULL THEN
            INSERT INTO public.empresas (id, nome, slug, ativo) VALUES (gen_random_uuid(), 'Sigma', 'sigma', true) RETURNING id INTO v_empresa_id;
        END IF;

        INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id)
        VALUES (new_user_id, 'sueldo@suportesigma.com', 'Sueldo', 'admin', v_empresa_id)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
