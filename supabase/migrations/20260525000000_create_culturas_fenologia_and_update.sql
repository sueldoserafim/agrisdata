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
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, perfil, empresa_id)
    SELECT new_user_id, 'sueldo@suportesigma.com', 'Sueldo Sigma', 'admin', id
    FROM public.empresas LIMIT 1
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

ALTER TABLE public.culturas
ADD COLUMN IF NOT EXISTS nome_cientifico text,
ADD COLUMN IF NOT EXISTS codigo_ncm text,
ADD COLUMN IF NOT EXISTS unidade_medida text,
ADD COLUMN IF NOT EXISTS temperatura_base_gda numeric,
ADD COLUMN IF NOT EXISTS temp_minima_ideal numeric,
ADD COLUMN IF NOT EXISTS temp_maxima_ideal numeric,
ADD COLUMN IF NOT EXISTS necessidade_hidrica_mm_dia numeric,
ADD COLUMN IF NOT EXISTS brix_minimo_ideal numeric,
ADD COLUMN IF NOT EXISTS brix_maximo_ideal numeric,
ADD COLUMN IF NOT EXISTS produtividade_media_t_ha numeric;

CREATE TABLE IF NOT EXISTS public.culturas_fenologia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cultura_id uuid REFERENCES public.culturas(id) ON DELETE CASCADE NOT NULL,
  empresa_id uuid REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  estagio text NOT NULL,
  dias_desde_plantio integer NOT NULL,
  descricao text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_culturas_fenologia_cultura_id ON public.culturas_fenologia(cultura_id) WHERE deleted_at IS NULL;

DROP POLICY IF EXISTS "culturas_fenologia_empresa" ON public.culturas_fenologia;
CREATE POLICY "culturas_fenologia_empresa" ON public.culturas_fenologia
  FOR ALL TO authenticated USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

ALTER TABLE public.culturas_fenologia ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trigger_culturas_fenologia_updated_at 
BEFORE UPDATE ON public.culturas_fenologia 
FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();
