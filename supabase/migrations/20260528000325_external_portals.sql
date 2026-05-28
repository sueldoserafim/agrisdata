DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entidade_portal_enum') THEN
        CREATE TYPE entidade_portal_enum AS ENUM ('produtor', 'cliente', 'fornecedor', 'despachante');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.portal_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    entidade_tipo entidade_portal_enum NOT NULL,
    entidade_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    data_expiracao TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'),
    acessos_permitidos TEXT[] DEFAULT '{}',
    ultimo_acesso TIMESTAMPTZ,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.portal_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portal_tokens_empresa" ON public.portal_tokens;
CREATE POLICY "portal_tokens_empresa" ON public.portal_tokens
FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.validar_token_portal(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record RECORD;
    v_empresa RECORD;
BEGIN
    SELECT * INTO v_token_record
    FROM public.portal_tokens
    WHERE token = p_token AND ativo = true AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valido', false, 'erro', 'Token inválido ou inativo');
    END IF;

    IF v_token_record.data_expiracao < now() THEN
        RETURN jsonb_build_object('valido', false, 'erro', 'Token expirado');
    END IF;

    -- Update last access
    UPDATE public.portal_tokens
    SET ultimo_acesso = now()
    WHERE id = v_token_record.id;

    -- Audit log
    INSERT INTO public.audit_logs (empresa_id, acao, tabela, registro_id, dados_novos, usuario_id)
    VALUES (
        v_token_record.empresa_id,
        'ACESSO_PORTAL',
        'portal_tokens',
        v_token_record.id,
        jsonb_build_object('entidade_tipo', v_token_record.entidade_tipo, 'entidade_id', v_token_record.entidade_id),
        NULL
    );

    -- Get company name
    SELECT nome INTO v_empresa FROM public.empresas WHERE id = v_token_record.empresa_id;

    RETURN jsonb_build_object(
        'valido', true,
        'token_info', row_to_json(v_token_record),
        'empresa_nome', v_empresa.nome
    );
END;
$;

CREATE OR REPLACE FUNCTION public.get_portal_produtor_data(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record RECORD;
    v_conta_corrente JSONB;
    v_entregas JSONB;
    v_financeiro JSONB;
BEGIN
    SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
    IF NOT FOUND OR v_token_record.entidade_tipo != 'produtor' THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    IF 'extrato' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_conta_corrente
        FROM (SELECT * FROM public.conta_corrente_produtor WHERE produtor_id = v_token_record.entidade_id ORDER BY data_movimento DESC LIMIT 50) t;
    ELSE v_conta_corrente := '[]'::jsonb; END IF;

    IF 'entregas' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_entregas
        FROM (
            SELECT pr.*, cr.data_colheita, s.nome_safra 
            FROM public.packing_recepcoes pr
            JOIN public.colheita_registros cr ON pr.lote_producao_id = cr.id
            JOIN public.safras s ON pr.safra_id = s.id
            WHERE cr.responsavel_id IN (SELECT id FROM public.usuarios WHERE fornecedor_id = v_token_record.entidade_id)
            ORDER BY pr.data_recepcao DESC LIMIT 50
        ) t;
    ELSE v_entregas := '[]'::jsonb; END IF;

    IF 'financeiro' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_financeiro
        FROM (
            SELECT id, data_lancamento as data, valor, descricao, status, 'lancamento' as tipo
            FROM public.financeiro_lancamentos 
            WHERE fornecedor_id = v_token_record.entidade_id
            UNION ALL
            SELECT id, data_adiantamento as data, valor_brl as valor, numero_adiantamento as descricao, status, 'adiantamento' as tipo
            FROM public.adiantamentos_internacionais
            WHERE cliente_id = v_token_record.entidade_id
            ORDER BY data DESC LIMIT 50
        ) t;
    ELSE v_financeiro := '[]'::jsonb; END IF;

    RETURN jsonb_build_object(
        'conta_corrente', v_conta_corrente,
        'entregas', v_entregas,
        'financeiro', v_financeiro
    );
END;
$;

CREATE OR REPLACE FUNCTION public.get_portal_cliente_data(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record RECORD;
    v_invoices JSONB;
    v_documentos JSONB;
    v_tracking JSONB;
BEGIN
    SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
    IF NOT FOUND OR v_token_record.entidade_tipo != 'cliente' THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    IF 'invoices' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_invoices
        FROM (
            SELECT * FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id ORDER BY data_emissao DESC LIMIT 50
        ) t;
    ELSE v_invoices := '[]'::jsonb; END IF;

    IF 'documentos' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_documentos
        FROM (
            SELECT d.*, c.numero_container
            FROM public.documentos_exportacao d
            JOIN public.containers c ON d.container_id = c.id
            WHERE c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id AND container_id IS NOT NULL)
        ) t;
    ELSE v_documentos := '[]'::jsonb; END IF;

    IF 'tracking' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_tracking
        FROM (
            SELECT c.*, b.numero_booking, b.data_eta, b.data_etd 
            FROM public.containers c
            LEFT JOIN public.bookings b ON c.booking_id = b.id
            WHERE c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id AND container_id IS NOT NULL)
        ) t;
    ELSE v_tracking := '[]'::jsonb; END IF;

    RETURN jsonb_build_object(
        'invoices', v_invoices,
        'documentos', v_documentos,
        'tracking', v_tracking
    );
END;
$;

CREATE OR REPLACE FUNCTION public.get_portal_fornecedor_data(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record RECORD;
    v_pedidos JSONB;
    v_pagamentos JSONB;
BEGIN
    SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
    IF NOT FOUND OR v_token_record.entidade_tipo != 'fornecedor' THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    IF 'pedidos' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_pedidos
        FROM (
            SELECT cp.*, p.nome as produto_nome
            FROM public.compras_pedido cp
            JOIN public.produtos p ON cp.produto_id = p.id
            WHERE cp.fornecedor_id = v_token_record.entidade_id ORDER BY cp.created_at DESC LIMIT 50
        ) t;
    ELSE v_pedidos := '[]'::jsonb; END IF;

    IF 'pagamentos' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_pagamentos
        FROM (
            SELECT * FROM public.financeiro_lancamentos 
            WHERE fornecedor_id = v_token_record.entidade_id AND tipo = 'despesa' ORDER BY data_vencimento DESC LIMIT 50
        ) t;
    ELSE v_pagamentos := '[]'::jsonb; END IF;

    RETURN jsonb_build_object(
        'pedidos', v_pedidos,
        'pagamentos', v_pagamentos
    );
END;
$;

CREATE OR REPLACE FUNCTION public.get_portal_despachante_data(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record RECORD;
    v_containers JSONB;
    v_documentos JSONB;
BEGIN
    SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
    IF NOT FOUND OR v_token_record.entidade_tipo != 'despachante' THEN RAISE EXCEPTION 'Acesso negado'; END IF;

    IF 'containers' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_containers
        FROM (
            SELECT c.*, b.numero_booking, b.data_eta, b.data_etd
            FROM public.containers c
            LEFT JOIN public.bookings b ON c.booking_id = b.id
            WHERE c.empresa_id = v_token_record.empresa_id AND c.status != 'concluido'
            ORDER BY c.created_at DESC LIMIT 100
        ) t;
    ELSE v_containers := '[]'::jsonb; END IF;

    IF 'documentos' = ANY(v_token_record.acessos_permitidos) THEN
        SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_documentos
        FROM (
            SELECT d.*, c.numero_container
            FROM public.documentos_exportacao d
            JOIN public.containers c ON d.container_id = c.id
            WHERE d.empresa_id = v_token_record.empresa_id AND d.status != 'valido'
        ) t;
    ELSE v_documentos := '[]'::jsonb; END IF;

    RETURN jsonb_build_object(
        'containers', v_containers,
        'documentos', v_documentos
    );
END;
$;
