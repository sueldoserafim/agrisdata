CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_empresa_id uuid;
BEGIN
  SELECT empresa_id INTO v_empresa_id FROM public.usuarios WHERE id = auth.uid();
  RETURN v_empresa_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_perfil()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_perfil text;
BEGIN
  SELECT perfil INTO v_perfil FROM public.usuarios WHERE id = auth.uid();
  RETURN v_perfil;
END;
$$;

DO $$
BEGIN
  DROP POLICY IF EXISTS "usuarios_empresa_select" ON public.usuarios;
  DROP POLICY IF EXISTS "usuarios_empresa_insert" ON public.usuarios;
  DROP POLICY IF EXISTS "usuarios_empresa_update" ON public.usuarios;
END $$;

CREATE POLICY "usuarios_empresa_select" ON public.usuarios
  FOR SELECT TO authenticated
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "usuarios_empresa_insert" ON public.usuarios
  FOR INSERT TO authenticated
  WITH CHECK (
    empresa_id = public.get_user_empresa_id() AND
    public.get_user_perfil() IN ('admin', 'admin_saas')
  );

CREATE POLICY "usuarios_empresa_update" ON public.usuarios
  FOR UPDATE TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id() AND
    public.get_user_perfil() IN ('admin', 'admin_saas')
  )
  WITH CHECK (
    empresa_id = public.get_user_empresa_id() AND
    public.get_user_perfil() IN ('admin', 'admin_saas')
  );
