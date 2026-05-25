-- Make sure RLS is strictly tied to authenticated role and check constraints apply correctly.
DO $$
BEGIN
  -- Fazendas
  DROP POLICY IF EXISTS "fazendas_empresa" ON public.fazendas;
  CREATE POLICY "fazendas_empresa" ON public.fazendas
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

  -- Talhões
  DROP POLICY IF EXISTS "talhoes_empresa" ON public.talhoes;
  CREATE POLICY "talhoes_empresa" ON public.talhoes
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

  -- Culturas
  DROP POLICY IF EXISTS "culturas_empresa" ON public.culturas;
  CREATE POLICY "culturas_empresa" ON public.culturas
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

  -- Cultivares
  DROP POLICY IF EXISTS "cultivares_empresa" ON public.cultivares;
  CREATE POLICY "cultivares_empresa" ON public.cultivares
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

  -- Produtos
  DROP POLICY IF EXISTS "produtos_empresa" ON public.produtos;
  CREATE POLICY "produtos_empresa" ON public.produtos
    FOR ALL TO authenticated
    USING (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()))
    WITH CHECK (empresa_id = (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));
END $$;
