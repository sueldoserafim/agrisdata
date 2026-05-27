CREATE TABLE IF NOT EXISTS public.replantios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  transplantio_id uuid NOT NULL REFERENCES public.transplantios(id) ON DELETE CASCADE,
  talhao_id uuid NOT NULL REFERENCES public.talhoes(id) ON DELETE CASCADE,
  data_replantio date NOT NULL,
  quantidade_replantada integer NOT NULL CHECK (quantidade_replantada > 0),
  motivo text CHECK (motivo IN ('falha_germinacao', 'pragas', 'doencas', 'clima', 'outro')),
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.replantios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "replantios_empresa" ON public.replantios;
CREATE POLICY "replantios_empresa" ON public.replantios
  FOR ALL TO authenticated
  USING (empresa_id = public.get_user_empresa_id())
  WITH CHECK (empresa_id = public.get_user_empresa_id());

DROP TRIGGER IF EXISTS trigger_replantios_updated_at ON public.replantios;
CREATE TRIGGER trigger_replantios_updated_at
  BEFORE UPDATE ON public.replantios
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX IF NOT EXISTS idx_replantios_empresa ON public.replantios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_replantios_transplantio ON public.replantios(transplantio_id);
CREATE INDEX IF NOT EXISTS idx_replantios_talhao ON public.replantios(talhao_id);

CREATE OR REPLACE FUNCTION public.check_replantio_transplantio_empresa()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_empresa_id uuid;
BEGIN
  SELECT empresa_id INTO v_empresa_id FROM public.transplantios WHERE id = NEW.transplantio_id;
  IF v_empresa_id IS NULL OR v_empresa_id != NEW.empresa_id THEN
    RAISE EXCEPTION 'transplantio_id não pertence à mesma empresa_id do replantio.';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_check_replantio_transplantio_empresa ON public.replantios;
CREATE TRIGGER trg_check_replantio_transplantio_empresa
 BEFORE INSERT OR UPDATE ON public.replantios
 FOR EACH ROW EXECUTE FUNCTION public.check_replantio_transplantio_empresa();

CREATE OR REPLACE FUNCTION public.atualizar_quantidade_replantio_transplantio()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.transplantios
        SET quantidade_replantio = COALESCE(quantidade_replantio, 0) + NEW.quantidade_replantada
        WHERE id = NEW.transplantio_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.transplantios
        SET quantidade_replantio = COALESCE(quantidade_replantio, 0) - OLD.quantidade_replantada + NEW.quantidade_replantada
        WHERE id = NEW.transplantio_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.transplantios
        SET quantidade_replantio = COALESCE(quantidade_replantio, 0) - OLD.quantidade_replantada
        WHERE id = OLD.transplantio_id;
    END IF;
    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_atualizar_quantidade_replantio ON public.replantios;
CREATE TRIGGER trg_atualizar_quantidade_replantio
 AFTER INSERT OR UPDATE OR DELETE ON public.replantios
 FOR EACH ROW EXECUTE FUNCTION public.atualizar_quantidade_replantio_transplantio();
