DO $$
BEGIN
  ALTER TABLE IF EXISTS public.fazendas ALTER COLUMN cnpj_imobiliario TYPE TEXT;
END $$;
