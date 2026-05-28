DO $$
BEGIN
    ALTER TABLE public.clientes ALTER COLUMN cnpj_cpf TYPE VARCHAR(20) USING substring(cnpj_cpf::text from 1 for 20);
    ALTER TABLE public.clientes ALTER COLUMN inscricao_estadual TYPE VARCHAR(30) USING substring(inscricao_estadual::text from 1 for 30);
    ALTER TABLE public.clientes ALTER COLUMN telefone TYPE VARCHAR(30) USING substring(telefone::text from 1 for 30);
END $$;
