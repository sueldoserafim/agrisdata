ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS configuracoes jsonb DEFAULT '{}'::jsonb;
