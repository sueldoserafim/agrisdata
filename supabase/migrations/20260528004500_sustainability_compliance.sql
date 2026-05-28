DO $$
BEGIN
    -- Seed User
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
        DECLARE
            new_user_id uuid := gen_random_uuid();
            v_empresa_id uuid;
        BEGIN
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
                '{"name": "Sueldo Admin"}',
                false, 'authenticated', 'authenticated',
                '', '', '', '', '', NULL, '', '', ''
            );

            SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
            IF v_empresa_id IS NOT NULL THEN
                INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
                VALUES (new_user_id, v_empresa_id, 'sueldo@suportesigma.com', 'Sueldo Admin', 'admin_saas', true)
                ON CONFLICT (id) DO NOTHING;
            END IF;
        END;
    END IF;
END $$;

-- certificacoes_modelos
CREATE TABLE IF NOT EXISTS public.certificacoes_modelos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    versao TEXT NOT NULL,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.certificacoes_itens_modelo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modelo_id UUID NOT NULL REFERENCES public.certificacoes_modelos(id) ON DELETE CASCADE,
    secao TEXT,
    descricao TEXT NOT NULL,
    peso NUMERIC DEFAULT 1,
    requisito_legal BOOLEAN DEFAULT false,
    gravidade_default TEXT DEFAULT 'menor',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- certificacoes_auditorias
CREATE TABLE IF NOT EXISTS public.certificacoes_auditorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    modelo_id UUID NOT NULL REFERENCES public.certificacoes_modelos(id),
    data_agendada DATE NOT NULL,
    data_realizada DATE,
    tipo_auditoria TEXT NOT NULL,
    auditor_nome TEXT,
    escopo TEXT,
    status TEXT DEFAULT 'agendada',
    score_final NUMERIC,
    responsavel_id UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- certificacoes_itens_auditoria
CREATE TABLE IF NOT EXISTS public.certificacoes_itens_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auditoria_id UUID NOT NULL REFERENCES public.certificacoes_auditorias(id) ON DELETE CASCADE,
    item_modelo_id UUID NOT NULL REFERENCES public.certificacoes_itens_modelo(id),
    resposta TEXT,
    evidencias_url TEXT[],
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- nao_conformidades
CREATE TABLE IF NOT EXISTS public.nao_conformidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    auditoria_id UUID REFERENCES public.certificacoes_auditorias(id) ON DELETE CASCADE,
    item_auditoria_id UUID REFERENCES public.certificacoes_itens_auditoria(id) ON DELETE SET NULL,
    descricao TEXT NOT NULL,
    gravidade TEXT NOT NULL,
    status TEXT DEFAULT 'aberta',
    responsavel_id UUID REFERENCES public.usuarios(id),
    plano_acao TEXT,
    prazo_correcao DATE,
    evidencias_correcao_url TEXT[],
    data_fechamento DATE,
    bloqueia_certificado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- emissoes_carbono
CREATE TABLE IF NOT EXISTS public.emissoes_carbono (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL,
    talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
    data_registro DATE NOT NULL,
    fonte_emissao TEXT NOT NULL,
    quantidade NUMERIC NOT NULL,
    unidade TEXT NOT NULL,
    fator_conversao_ipcc NUMERIC NOT NULL,
    co2e_total NUMERIC NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- residuos
CREATE TABLE IF NOT EXISTS public.residuos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    data_geracao DATE NOT NULL,
    tipo_residuo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    quantidade NUMERIC NOT NULL,
    unidade TEXT NOT NULL,
    numero_mtr TEXT,
    numero_cdf TEXT,
    data_vencimento_cdf DATE,
    status_logistica_reversa TEXT DEFAULT 'pendente',
    data_devolucao DATE,
    responsavel_id UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Habilitar RLS
ALTER TABLE public.certificacoes_modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes_itens_modelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes_auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes_itens_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nao_conformidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissoes_carbono ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residuos ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "certificacoes_modelos_empresa" ON public.certificacoes_modelos;
CREATE POLICY "certificacoes_modelos_empresa" ON public.certificacoes_modelos
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "certificacoes_itens_modelo_empresa" ON public.certificacoes_itens_modelo;
CREATE POLICY "certificacoes_itens_modelo_empresa" ON public.certificacoes_itens_modelo
    FOR ALL TO authenticated USING (
        modelo_id IN (SELECT id FROM public.certificacoes_modelos WHERE empresa_id = public.get_user_empresa_id())
    );

DROP POLICY IF EXISTS "certificacoes_auditorias_empresa" ON public.certificacoes_auditorias;
CREATE POLICY "certificacoes_auditorias_empresa" ON public.certificacoes_auditorias
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "certificacoes_itens_auditoria_empresa" ON public.certificacoes_itens_auditoria;
CREATE POLICY "certificacoes_itens_auditoria_empresa" ON public.certificacoes_itens_auditoria
    FOR ALL TO authenticated USING (
        auditoria_id IN (SELECT id FROM public.certificacoes_auditorias WHERE empresa_id = public.get_user_empresa_id())
    );

DROP POLICY IF EXISTS "nao_conformidades_empresa" ON public.nao_conformidades;
CREATE POLICY "nao_conformidades_empresa" ON public.nao_conformidades
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "emissoes_carbono_empresa" ON public.emissoes_carbono;
CREATE POLICY "emissoes_carbono_empresa" ON public.emissoes_carbono
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "residuos_empresa" ON public.residuos;
CREATE POLICY "residuos_empresa" ON public.residuos
    FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

-- Triggers
CREATE OR REPLACE TRIGGER trg_certificacoes_modelos_updated_at BEFORE UPDATE ON public.certificacoes_modelos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_certificacoes_itens_modelo_updated_at BEFORE UPDATE ON public.certificacoes_itens_modelo FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_certificacoes_auditorias_updated_at BEFORE UPDATE ON public.certificacoes_auditorias FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_certificacoes_itens_auditoria_updated_at BEFORE UPDATE ON public.certificacoes_itens_auditoria FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_nao_conformidades_updated_at BEFORE UPDATE ON public.nao_conformidades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_emissoes_carbono_updated_at BEFORE UPDATE ON public.emissoes_carbono FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_residuos_updated_at BEFORE UPDATE ON public.residuos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Alertas Compliance
CREATE OR REPLACE FUNCTION public.check_daily_alerts_compliance()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    r RECORD;
    v_admin_id UUID;
BEGIN
    FOR r IN SELECT * FROM public.certificacoes_auditorias WHERE status = 'agendada' AND data_agendada IN (CURRENT_DATE + 30, CURRENT_DATE + 15, CURRENT_DATE + 7) LOOP
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (r.empresa_id, v_admin_id, 'Auditoria Próxima', 'Auditoria ' || r.tipo_auditoria || ' agendada para ' || r.data_agendada, 'auditoria_agendada', false);
        END LOOP;
    END LOOP;

    FOR r IN SELECT * FROM public.nao_conformidades WHERE status IN ('aberta', 'em_correcao') AND prazo_correcao = CURRENT_DATE + 3 LOOP
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (r.empresa_id, v_admin_id, 'Prazo de NC Vencendo', 'NC ' || r.id || ' vence em 3 dias.', 'nc_prazo', false);
        END LOOP;
    END LOOP;

    FOR r IN SELECT * FROM public.residuos WHERE tipo_residuo = 'perigoso' AND data_vencimento_cdf IS NOT NULL AND data_vencimento_cdf <= CURRENT_DATE + 15 LOOP
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (r.empresa_id, v_admin_id, 'Vencimento de CDF Próximo', 'O CDF do resíduo ' || r.descricao || ' vence em ' || r.data_vencimento_cdf, 'cdf_vencimento', false);
        END LOOP;
    END LOOP;
END;
$$;

-- Seed GLOBALG.A.P.
DO $$
DECLARE
    v_empresa_id uuid;
    v_modelo_id uuid;
BEGIN
    SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
    IF v_empresa_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.certificacoes_modelos WHERE tipo = 'GLOBALG.A.P.') THEN
        INSERT INTO public.certificacoes_modelos (empresa_id, nome, tipo, versao, status)
        VALUES (v_empresa_id, 'GLOBALG.A.P. IFA V5.2', 'GLOBALG.A.P.', '5.2', 'ativo')
        RETURNING id INTO v_modelo_id;

        INSERT INTO public.certificacoes_itens_modelo (modelo_id, secao, descricao, peso, requisito_legal, gravidade_default)
        VALUES 
            (v_modelo_id, 'AF 1', 'Histórico e Manejo da Propriedade', 1, false, 'maior'),
            (v_modelo_id, 'AF 2', 'Manutenção de Registros e Auto-Avaliação', 2, false, 'critica'),
            (v_modelo_id, 'AF 3', 'Higiene do Trabalhador', 2, true, 'critica'),
            (v_modelo_id, 'CB 1', 'Rastreabilidade', 3, true, 'critica'),
            (v_modelo_id, 'CB 2', 'Material de Propagação', 1, false, 'menor');
    END IF;
END $$;
