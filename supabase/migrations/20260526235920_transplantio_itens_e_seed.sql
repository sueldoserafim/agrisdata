DO $$
BEGIN
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
        '{"name": "Admin Sueldo"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '', NULL, '', '', ''
      );
      
      SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
      
      IF v_empresa_id IS NOT NULL THEN
        INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id, ativo)
        VALUES (new_user_id, 'sueldo@suportesigma.com', 'Admin Sueldo', 'admin_saas', v_empresa_id, true)
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.transplantio_itens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    transplantio_id uuid NOT NULL REFERENCES public.transplantios(id) ON DELETE CASCADE,
    item_tipo text NOT NULL CHECK (item_tipo IN ('insumo', 'mao_de_obra', 'energia', 'agua')),
    produto_id uuid REFERENCES public.produtos(id),
    descricao text,
    quantidade numeric NOT NULL DEFAULT 0,
    unidade text,
    custo_unitario numeric NOT NULL DEFAULT 0,
    custo_total numeric NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

DROP POLICY IF EXISTS "transplantio_itens_empresa_select" ON public.transplantio_itens;
CREATE POLICY "transplantio_itens_empresa_select" ON public.transplantio_itens
    FOR SELECT TO authenticated 
    USING (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "transplantio_itens_empresa_insert" ON public.transplantio_itens;
CREATE POLICY "transplantio_itens_empresa_insert" ON public.transplantio_itens
    FOR INSERT TO authenticated 
    WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "transplantio_itens_empresa_update" ON public.transplantio_itens;
CREATE POLICY "transplantio_itens_empresa_update" ON public.transplantio_itens
    FOR UPDATE TO authenticated 
    USING (empresa_id = public.get_user_empresa_id())
    WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP POLICY IF EXISTS "transplantio_itens_empresa_delete" ON public.transplantio_itens;
CREATE POLICY "transplantio_itens_empresa_delete" ON public.transplantio_itens
    FOR DELETE TO authenticated 
    USING (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.transplantio_itens ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.calcular_custo_total_item_transplantio()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.custo_total := NEW.quantidade * NEW.custo_unitario;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calcular_custo_total_item_transplantio ON public.transplantio_itens;
CREATE TRIGGER trg_calcular_custo_total_item_transplantio
BEFORE INSERT OR UPDATE ON public.transplantio_itens
FOR EACH ROW EXECUTE FUNCTION public.calcular_custo_total_item_transplantio();

CREATE OR REPLACE FUNCTION public.atualizar_quantidade_viva_transplantio()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)),
            status = CASE WHEN quantidade_viva - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) <= 0 THEN 'transplantado' ELSE status END
        WHERE id = NEW.lote_muda_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)),
            status = CASE WHEN quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) <= 0 THEN 'transplantado' ELSE 'pronto' END
        WHERE id = NEW.lote_muda_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lotes_mudas
        SET quantidade_viva = quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)),
            status = CASE WHEN quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) > 0 AND status = 'transplantado' THEN 'pronto' ELSE status END
        WHERE id = OLD.lote_muda_id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_atualizar_quantidade_viva_transplantio ON public.transplantios;
CREATE TRIGGER trg_atualizar_quantidade_viva_transplantio
AFTER INSERT OR UPDATE OR DELETE ON public.transplantios
FOR EACH ROW EXECUTE FUNCTION public.atualizar_quantidade_viva_transplantio();
