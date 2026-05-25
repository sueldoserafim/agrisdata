ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS numero_car VARCHAR(19);
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS nirf TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS ccir TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS data_fundacao DATE;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS area_produtiva_ha NUMERIC;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS tipo_producao TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS responsavel_nome TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS responsavel_cpf TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS responsavel_telefone TEXT;
ALTER TABLE public.fazendas ADD COLUMN IF NOT EXISTS responsavel_email TEXT;

DO $$
BEGIN
  -- Inject the "cadastros" module into existing companies so they can access the new feature 
  -- without manual admin intervention (per AC instructions, the module must be accessible).
  UPDATE public.empresas
  SET modulos_habilitados = array_append(COALESCE(modulos_habilitados, '{}'::text[]), 'cadastros')
  WHERE not ('cadastros' = ANY(COALESCE(modulos_habilitados, '{}'::text[])));
END $$;
