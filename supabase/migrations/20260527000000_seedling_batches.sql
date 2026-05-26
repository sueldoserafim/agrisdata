DO $$
DECLARE
  new_user_id uuid;
  v_empresa_id uuid;
BEGIN
  -- Seed user sueldo@suportesigma.com
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
      '{"name": "Sueldo Sigma"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
    IF v_empresa_id IS NULL THEN
      v_empresa_id := gen_random_uuid();
      INSERT INTO public.empresas (id, nome, slug) VALUES (v_empresa_id, 'Sigma Support', 'sigma-support');
    END IF;

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id)
    VALUES (new_user_id, 'sueldo@suportesigma.com', 'Sueldo Sigma', 'admin_saas', v_empresa_id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Ensure table lotes_mudas exists
CREATE TABLE IF NOT EXISTS public.lotes_mudas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  estufa_id uuid REFERENCES public.estufas(id) ON DELETE CASCADE,
  cultura_id uuid REFERENCES public.culturas(id) ON DELETE CASCADE,
  cultivar_id uuid REFERENCES public.cultivares(id) ON DELETE CASCADE,
  nome_lote text NOT NULL,
  quantidade_mudas integer DEFAULT 0,
  quantidade_viva integer DEFAULT 0,
  data_semeadura date,
  data_prevista_transplantio date,
  custo_total numeric(12,2) DEFAULT 0,
  custo_por_muda numeric(12,2) DEFAULT 0,
  status text DEFAULT 'germinando' CHECK (status IN ('germinando', 'em_desenvolvimento', 'pronto', 'transplantado', 'descartado')),
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Ensure all necessary columns exist with constraints
ALTER TABLE public.lotes_mudas ADD COLUMN IF NOT EXISTS quantidade_mudas integer DEFAULT 0;
ALTER TABLE public.lotes_mudas ADD COLUMN IF NOT EXISTS quantidade_viva integer DEFAULT 0;
ALTER TABLE public.lotes_mudas ADD COLUMN IF NOT EXISTS custo_total numeric(12,2) DEFAULT 0;
ALTER TABLE public.lotes_mudas ADD COLUMN IF NOT EXISTS custo_por_muda numeric(12,2) DEFAULT 0;

-- Function and trigger for automatic calculation of seedling costs
CREATE OR REPLACE FUNCTION public.calcular_custo_por_muda()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.quantidade_mudas > 0 THEN
        NEW.custo_por_muda := NEW.custo_total / NEW.quantidade_mudas;
    ELSE
        NEW.custo_por_muda := 0;
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        IF NEW.quantidade_viva IS NULL OR NEW.quantidade_viva = 0 THEN
            NEW.quantidade_viva := NEW.quantidade_mudas;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_calcular_custo_por_muda ON public.lotes_mudas;
CREATE TRIGGER trg_calcular_custo_por_muda BEFORE INSERT OR UPDATE ON public.lotes_mudas FOR EACH ROW EXECUTE FUNCTION public.calcular_custo_por_muda();

-- RLS Policies
ALTER TABLE public.lotes_mudas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lotes_mudas_empresa" ON public.lotes_mudas;
CREATE POLICY "lotes_mudas_empresa" ON public.lotes_mudas
  FOR ALL
  TO authenticated
  USING (empresa_id = public.get_user_empresa_id())
  WITH CHECK (empresa_id = public.get_user_empresa_id());
