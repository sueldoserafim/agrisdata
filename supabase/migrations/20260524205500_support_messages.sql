-- Create suporte_mensagens table for ticket communication history
CREATE TABLE IF NOT EXISTS public.suporte_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.suporte_tickets(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.suporte_mensagens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to be idempotent
DROP POLICY IF EXISTS "suporte_mensagens_admin_all" ON public.suporte_mensagens;
CREATE POLICY "suporte_mensagens_admin_all" ON public.suporte_mensagens
  FOR ALL TO authenticated USING (public.is_admin_saas());

DROP POLICY IF EXISTS "suporte_mensagens_empresa" ON public.suporte_mensagens;
CREATE POLICY "suporte_mensagens_empresa" ON public.suporte_mensagens
  FOR ALL TO authenticated USING (
    ticket_id IN (
      SELECT id FROM public.suporte_tickets 
      WHERE empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid())
    )
  );

-- Seed data block to ensure superadmin exists correctly
DO $seed$
DECLARE
  new_empresa_id uuid;
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    new_user_id := gen_random_uuid();
    new_empresa_id := '00000000-0000-0000-0000-000000000001'::uuid;
    
    INSERT INTO public.empresas (id, nome, slug, ativo, limite_usuarios)
    VALUES (new_empresa_id, 'Sigma SaaS', 'sigma-saas', true, 999)
    ON CONFLICT (id) DO NOTHING;

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
      '{"name": "Super Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, new_empresa_id, 'sueldo@suportesigma.com', 'Super Admin', 'admin_saas', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $seed$;
