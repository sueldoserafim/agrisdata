CREATE TABLE IF NOT EXISTS public.portal_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    entidade_tipo TEXT NOT NULL CHECK (entidade_tipo IN ('produtor', 'cliente', 'fornecedor', 'despachante')),
    entidade_id UUID NOT NULL,
    nome_entidade TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    data_expiracao TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'),
    acessos_permitidos TEXT[] NOT NULL DEFAULT '{}',
    ultimo_acesso TIMESTAMPTZ,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.portal_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portal_tokens_empresa" ON public.portal_tokens;
CREATE POLICY "portal_tokens_empresa" ON public.portal_tokens
    FOR ALL TO authenticated
    USING (empresa_id = get_user_empresa_id())
    WITH CHECK (empresa_id = get_user_empresa_id());

CREATE OR REPLACE FUNCTION public.get_portal_data(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token record;
    v_empresa record;
    v_result jsonb := '{}'::jsonb;
BEGIN
    SELECT * INTO v_token FROM public.portal_tokens 
    WHERE token = p_token AND ativo = true AND data_expiracao > now() AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Token inválido ou expirado');
    END IF;

    UPDATE public.portal_tokens SET ultimo_acesso = now() WHERE id = v_token.id;
    
    INSERT INTO public.audit_logs (empresa_id, acao, tabela, registro_id, dados_novos)
    VALUES (v_token.empresa_id, 'PORTAL_ACCESS', 'portal_tokens', v_token.id, 
            jsonb_build_object('entidade_tipo', v_token.entidade_tipo, 'entidade_id', v_token.entidade_id));

    SELECT * INTO v_empresa FROM public.empresas WHERE id = v_token.empresa_id;

    IF v_token.entidade_tipo = 'produtor' THEN
        v_result := jsonb_build_object(
            'conta_corrente', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT * FROM public.conta_corrente_produtor 
                WHERE empresa_id = v_token.empresa_id AND produtor_id = v_token.entidade_id 
                ORDER BY data_movimento DESC LIMIT 100
            ) t),
            'pagamentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT * FROM public.financeiro_lancamentos 
                WHERE empresa_id = v_token.empresa_id AND fornecedor_id = v_token.entidade_id AND tipo IN ('despesa', 'pagamento') 
                ORDER BY data_vencimento DESC LIMIT 100
            ) t),
            'entregas', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT pr.* FROM public.packing_recepcoes pr 
                LEFT JOIN public.colheita_registros cr ON cr.id = pr.lote_producao_id
                WHERE pr.empresa_id = v_token.empresa_id 
                AND (pr.responsavel_id = v_token.entidade_id OR cr.responsavel_id = v_token.entidade_id)
                ORDER BY pr.data_recepcao DESC LIMIT 50
            ) t)
        );
    ELSIF v_token.entidade_tipo = 'cliente' THEN
        v_result := jsonb_build_object(
            'invoices', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT * FROM public.invoices_exportacao 
                WHERE empresa_id = v_token.empresa_id AND cliente_id = v_token.entidade_id 
                ORDER BY data_emissao DESC LIMIT 50
            ) t),
            'containers', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT c.*, b.numero_booking, b.data_eta, b.data_etd 
                FROM public.containers c
                LEFT JOIN public.bookings b ON b.id = c.booking_id
                WHERE c.empresa_id = v_token.empresa_id 
                AND c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token.entidade_id AND container_id IS NOT NULL)
                ORDER BY c.created_at DESC LIMIT 50
            ) t),
            'documentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT d.* FROM public.documentos_exportacao d
                WHERE d.empresa_id = v_token.empresa_id 
                AND d.container_id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token.entidade_id AND container_id IS NOT NULL)
                ORDER BY d.created_at DESC LIMIT 50
            ) t)
        );
    ELSIF v_token.entidade_tipo = 'fornecedor' THEN
        v_result := jsonb_build_object(
            'pedidos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT cp.*, p.nome as produto_nome FROM public.compras_pedido cp
                LEFT JOIN public.produtos p ON p.id = cp.produto_id
                WHERE cp.empresa_id = v_token.empresa_id AND cp.fornecedor_id = v_token.entidade_id 
                ORDER BY cp.data_pedido DESC LIMIT 50
            ) t),
            'pagamentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT * FROM public.financeiro_lancamentos 
                WHERE empresa_id = v_token.empresa_id AND fornecedor_id = v_token.entidade_id AND tipo IN ('despesa', 'pagamento') 
                ORDER BY data_vencimento DESC LIMIT 50
            ) t)
        );
    ELSIF v_token.entidade_tipo = 'despachante' THEN
        v_result := jsonb_build_object(
            'containers', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT c.*, b.numero_booking, b.data_eta, b.data_etd 
                FROM public.containers c
                LEFT JOIN public.bookings b ON b.id = c.booking_id
                WHERE c.empresa_id = v_token.empresa_id AND c.status != 'entregue'
                ORDER BY c.created_at DESC LIMIT 50
            ) t),
            'documentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
                SELECT * FROM public.documentos_exportacao 
                WHERE empresa_id = v_token.empresa_id AND status != 'valido'
                ORDER BY created_at DESC LIMIT 50
            ) t)
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'tokenInfo', jsonb_build_object(
            'entidade_tipo', v_token.entidade_tipo,
            'nome_entidade', v_token.nome_entidade,
            'acessos_permitidos', v_token.acessos_permitidos,
            'empresa_nome', v_empresa.nome
        ),
        'data', v_result
    );
END;
$$;
