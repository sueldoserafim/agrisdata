DO $$
BEGIN
  CREATE TYPE public.tipo_container_enum AS ENUM ('dry_20', 'dry_40', 'reefer_20', 'reefer_40', 'hc_40', 'outro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.booking_status_enum AS ENUM ('reservado', 'confirmado', 'em_transito', 'concluido', 'cancelado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.invoice_incoterm_enum AS ENUM ('fob', 'cfr', 'cif', 'dap', 'ddp');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.invoice_status_enum AS ENUM ('rascunho', 'emitida', 'paga', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    numero_booking TEXT NOT NULL,
    navio_id UUID REFERENCES public.navios(id) ON DELETE SET NULL,
    porto_origem_id UUID REFERENCES public.portos(id) ON DELETE SET NULL,
    porto_destino_id UUID REFERENCES public.portos(id) ON DELETE SET NULL,
    data_etd DATE,
    data_eta DATE,
    quantidade_containeres INTEGER,
    tipo_container public.tipo_container_enum,
    status public.booking_status_enum DEFAULT 'reservado',
    agente_maritimo TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, numero_booking),
    CHECK (data_etd < data_eta)
);

ALTER TABLE public.containers 
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS selo TEXT,
ADD COLUMN IF NOT EXISTS tara_kg NUMERIC,
ADD COLUMN IF NOT EXISTS peso_bruto_kg NUMERIC,
ADD COLUMN IF NOT EXISTS peso_liquido_kg NUMERIC,
ADD COLUMN IF NOT EXISTS temperatura_configurada NUMERIC,
ADD COLUMN IF NOT EXISTS aprovador_1_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS aprovador_2_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS gate_in_data TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gate_out_data TIMESTAMPTZ;

DO $$
BEGIN
  DROP POLICY IF EXISTS "containers_empresa" ON public.containers;
END $$;

ALTER TABLE public.containers DROP CONSTRAINT IF EXISTS chk_container_weights;
ALTER TABLE public.containers ADD CONSTRAINT chk_container_weights CHECK (peso_liquido_kg IS NULL OR peso_bruto_kg IS NULL OR peso_liquido_kg < peso_bruto_kg);

ALTER TABLE public.romaneios_venda ADD COLUMN IF NOT EXISTS container_id UUID REFERENCES public.containers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.invoices_exportacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    container_id UUID REFERENCES public.containers(id) ON DELETE SET NULL,
    numero_invoice TEXT NOT NULL,
    data_emissao DATE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    incoterm public.invoice_incoterm_enum,
    valor_total_usd NUMERIC,
    valor_total_brl NUMERIC,
    peso_total_kg NUMERIC,
    quantidade_pallets INTEGER,
    romaneio_ids UUID[],
    status public.invoice_status_enum DEFAULT 'rascunho',
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, numero_invoice)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bookings_empresa" ON public.bookings;
CREATE POLICY "bookings_empresa" ON public.bookings
  FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "containers_empresa" ON public.containers
  FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.invoices_exportacao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invoices_exportacao_empresa" ON public.invoices_exportacao;
CREATE POLICY "invoices_exportacao_empresa" ON public.invoices_exportacao
  FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

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
      '{"name": "Sueldo Sigma"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id)
    SELECT new_user_id, 'sueldo@suportesigma.com', 'Sueldo Sigma', 'admin_saas', e.id
    FROM public.empresas e LIMIT 1
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
