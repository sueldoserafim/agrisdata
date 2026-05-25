-- Drop old policies to be replaced
DROP POLICY IF EXISTS "usuarios_admin_read" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_empresa_select" ON public.usuarios;
DROP POLICY IF EXISTS "fornecedores_empresa" ON public.fornecedores;
DROP POLICY IF EXISTS "fornecedores_portal_read" ON public.fornecedores;
DROP POLICY IF EXISTS "fornecedores_empresa_all" ON public.fornecedores;

-- Create safe select policy for usuarios
CREATE POLICY "usuarios_empresa_select" ON public.usuarios
  FOR SELECT TO authenticated
  USING (
    is_admin_saas() OR 
    auth.uid() = id OR
    (empresa_id = get_user_empresa_id() AND get_user_perfil() != 'fornecedor')
  );

-- Create safe ALL policy for fornecedores (internal staff)
CREATE POLICY "fornecedores_empresa_all" ON public.fornecedores
  FOR ALL TO authenticated
  USING (
    empresa_id = get_user_empresa_id() AND get_user_perfil() != 'fornecedor'
  )
  WITH CHECK (
    empresa_id = get_user_empresa_id() AND get_user_perfil() != 'fornecedor'
  );

-- Create specific read policy for fornecedor portal access
CREATE POLICY "fornecedores_portal_read" ON public.fornecedores
  FOR SELECT TO authenticated
  USING (
    id IN (SELECT fornecedor_id FROM public.usuarios WHERE id = auth.uid())
  );
