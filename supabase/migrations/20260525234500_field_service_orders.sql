DO $DO$
BEGIN
    ALTER TABLE public.operacoes_campo ADD COLUMN IF NOT EXISTS ponto_captacao text;
    ALTER TABLE public.operacoes_campo ADD COLUMN IF NOT EXISTS consumo_agua_m3 numeric;
    ALTER TABLE public.operacoes_campo ADD COLUMN IF NOT EXISTS equipamento_id uuid REFERENCES public.equipamentos(id);
    ALTER TABLE public.operacoes_campo ADD COLUMN IF NOT EXISTS clima_observacoes text;
    ALTER TABLE public.operacoes_campo ADD COLUMN IF NOT EXISTS observacoes text;

    ALTER TABLE public.operacao_insumos ADD COLUMN IF NOT EXISTS area_aplicada_ha numeric;
END $DO$;

DROP TRIGGER IF EXISTS trigger_conclusao_operacao ON public.operacoes_campo;

CREATE OR REPLACE FUNCTION public.processa_conclusao_operacao()
RETURNS trigger AS $FUNC$
DECLARE
    v_insumo RECORD;
    v_talhao_id uuid;
    v_centro_custo_id uuid;
    v_observacoes text;
BEGIN
    IF NEW.status = 'concluída' AND OLD.status != 'concluída' THEN
        IF NEW.data_conclusao IS NULL THEN
            NEW.data_conclusao := CURRENT_DATE;
        END IF;

        SELECT talhao_id INTO v_talhao_id FROM public.safras WHERE id = NEW.safra_id;

        SELECT id INTO v_centro_custo_id FROM public.centros_custo WHERE empresa_id = NEW.empresa_id AND nome = 'Operações de Campo' LIMIT 1;
        IF v_centro_custo_id IS NULL THEN
           INSERT INTO public.centros_custo (empresa_id, nome, codigo) VALUES (NEW.empresa_id, 'Operações de Campo', 'OPC') RETURNING id INTO v_centro_custo_id;
        END IF;

        FOR v_insumo IN SELECT * FROM public.operacao_insumos WHERE operacao_id = NEW.id
        LOOP
            IF v_insumo.lote_id IS NOT NULL THEN
                UPDATE public.lotes_estoque
                SET quantidade = quantidade - v_insumo.quantidade_utilizada,
                    updated_at = NOW()
                WHERE id = v_insumo.lote_id AND quantidade >= v_insumo.quantidade_utilizada;

                IF NOT FOUND THEN
                    RAISE EXCEPTION 'Estoque insuficiente no lote % para a operação', v_insumo.lote_id;
                END IF;

                INSERT INTO public.estoque_movimento (
                    empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at
                ) VALUES (
                    NEW.empresa_id, v_insumo.lote_id, 'saída', v_insumo.quantidade_utilizada, 'Operação de Campo: ' || NEW.id, NOW()
                );
            END IF;

            INSERT INTO public.custos_talhao (
                empresa_id, talhao_id, safra_id, centro_custo_id, descricao, valor, data_lancamento
            )
            SELECT
                NEW.empresa_id, v_talhao_id, NEW.safra_id, v_centro_custo_id,
                'Insumo Operação: ' || p.nome,
                (p.preco_unitario * v_insumo.quantidade_utilizada),
                NEW.data_conclusao
            FROM public.produtos p WHERE p.id = v_insumo.produto_id;
        END LOOP;

        v_observacoes := 'Operação: ' || NEW.tipo_operacao || COALESCE(' - ' || NEW.observacoes, '');
        INSERT INTO public.caderno_campo (
            empresa_id, talhao_id, data, observacoes, responsavel_id
        ) VALUES (
            NEW.empresa_id, v_talhao_id, NEW.data_conclusao, v_observacoes, NEW.responsavel_id
        );
    END IF;
    RETURN NEW;
END;
$FUNC$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conclusao_operacao
BEFORE UPDATE ON public.operacoes_campo
FOR EACH ROW EXECUTE FUNCTION processa_conclusao_operacao();

-- Seed user
DO $DO$
DECLARE
  v_empresa_id uuid;
  v_user_id uuid;
BEGIN
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  IF v_empresa_id IS NULL THEN
    v_empresa_id := gen_random_uuid();
    INSERT INTO public.empresas (id, nome, slug) VALUES (v_empresa_id, 'Sigma', 'sigma');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
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

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil)
    VALUES (v_user_id, v_empresa_id, 'sueldo@suportesigma.com', 'Sueldo', 'admin_saas')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $DO$;
