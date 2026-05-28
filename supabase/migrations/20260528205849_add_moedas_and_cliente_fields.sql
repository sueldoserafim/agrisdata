CREATE TABLE IF NOT EXISTS public.moedas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  codigo TEXT NOT NULL,
  simbolo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS moeda_id UUID REFERENCES public.moedas(id) ON DELETE SET NULL;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS porto_destino_id UUID REFERENCES public.portos(id) ON DELETE SET NULL;

ALTER TABLE public.moedas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "moedas_empresa" ON public.moedas;
CREATE POLICY "moedas_empresa" ON public.moedas
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id())
  WITH CHECK (empresa_id = public.get_user_empresa_id());

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.moedas WHERE codigo = 'BRL' LIMIT 1) THEN
    -- Seed default currencies for all active empresas
    INSERT INTO public.moedas (empresa_id, nome, codigo, simbolo)
    SELECT id, 'Real Brasileiro', 'BRL', 'R$' FROM public.empresas WHERE deleted_at IS NULL;
    
    INSERT INTO public.moedas (empresa_id, nome, codigo, simbolo)
    SELECT id, 'Dólar Americano', 'USD', '$' FROM public.empresas WHERE deleted_at IS NULL;
    
    INSERT INTO public.moedas (empresa_id, nome, codigo, simbolo)
    SELECT id, 'Euro', 'EUR', '€' FROM public.empresas WHERE deleted_at IS NULL;
  END IF;
END $$;
