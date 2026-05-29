ALTER TABLE public.fornecedores
  ADD COLUMN IF NOT EXISTS nome_fantasia text,
  ADD COLUMN IF NOT EXISTS tipo_pessoa text,
  ADD COLUMN IF NOT EXISTS indicador_ie text,
  ADD COLUMN IF NOT EXISTS inscricao_estadual character varying,
  ADD COLUMN IF NOT EXISTS inscricao_municipal text;
