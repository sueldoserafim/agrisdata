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
      new_user_id, '00000000-0000-0000-0000-000000000000', 'sueldo@suportesigma.com',
      crypt('Skip@Pass123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Sueldo Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, email, nome, empresa_id, perfil)
    SELECT new_user_id, 'sueldo@suportesigma.com', 'Sueldo Admin', id, 'admin_saas'
    FROM public.empresas LIMIT 1
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Rename colheita_id to lote_producao_id if it exists
ALTER TABLE public.packing_recepcoes DROP CONSTRAINT IF EXISTS packing_recepcoes_colheita_id_fkey;

DO $$
BEGIN
  IF EXISTS(SELECT 1
    FROM information_schema.columns
    WHERE table_name='packing_recepcoes' and column_name='colheita_id')
  THEN
      ALTER TABLE public.packing_recepcoes RENAME COLUMN colheita_id TO lote_producao_id;
  END IF;
END $$;

ALTER TABLE public.packing_recepcoes DROP CONSTRAINT IF EXISTS packing_recepcoes_lote_producao_id_fkey;
ALTER TABLE public.packing_recepcoes ADD CONSTRAINT packing_recepcoes_lote_producao_id_fkey FOREIGN KEY (lote_producao_id) REFERENCES public.colheita_registros(id) ON DELETE CASCADE;

-- Add new columns
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS peso_bruto_kg NUMERIC;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS peso_liquido_kg NUMERIC;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS tara_kg NUMERIC;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS quantidade_caixas INTEGER;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS temperatura_recepcao NUMERIC;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS conformidade_visual TEXT;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS motivo_reprovacao TEXT;
ALTER TABLE public.packing_recepcoes ADD COLUMN IF NOT EXISTS responsavel_id UUID;

ALTER TABLE public.packing_recepcoes DROP CONSTRAINT IF EXISTS packing_recepcoes_responsavel_id_fkey;
ALTER TABLE public.packing_recepcoes ADD CONSTRAINT packing_recepcoes_responsavel_id_fkey FOREIGN KEY (responsavel_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;

-- Constraints
ALTER TABLE public.packing_recepcoes DROP CONSTRAINT IF EXISTS packing_recepcoes_conformidade_visual_check;
ALTER TABLE public.packing_recepcoes ADD CONSTRAINT packing_recepcoes_conformidade_visual_check CHECK (conformidade_visual IN ('aprovado', 'reprovado', 'parcial'));

UPDATE public.packing_recepcoes SET status = 'em_recebimento' WHERE status = 'pendente';
UPDATE public.packing_recepcoes SET status = 'concluido' WHERE status = 'processado';

ALTER TABLE public.packing_recepcoes ALTER COLUMN status SET DEFAULT 'em_recebimento';

ALTER TABLE public.packing_recepcoes DROP CONSTRAINT IF EXISTS packing_recepcoes_status_check;
ALTER TABLE public.packing_recepcoes ADD CONSTRAINT packing_recepcoes_status_check CHECK (status IN ('em_recebimento', 'recebido', 'em_packing', 'concluido', 'expedido'));

-- Drop and recreate RLS
DROP POLICY IF EXISTS "packing_recepcoes_empresa" ON public.packing_recepcoes;
CREATE POLICY "packing_recepcoes_empresa" ON public.packing_recepcoes
  FOR ALL TO authenticated
  USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()))
  WITH CHECK (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));
