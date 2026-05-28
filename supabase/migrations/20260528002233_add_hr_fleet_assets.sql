DO $$
BEGIN
  -- Tables Creation
  CREATE TABLE IF NOT EXISTS public.rh_ponto (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      latitude NUMERIC,
      longitude NUMERIC,
      foto_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.rh_ferias_afastamentos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL CHECK (tipo IN ('ferias', 'medico', 'falta', 'licenca')),
      data_inicio DATE NOT NULL,
      data_fim DATE NOT NULL,
      status TEXT DEFAULT 'solicitado' CHECK (status IN ('solicitado', 'aprovado', 'rejeitado')),
      aprovador_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.rh_folha_pagamento (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
      mes_referencia DATE NOT NULL,
      salario_base NUMERIC NOT NULL DEFAULT 0 CHECK (salario_base >= 0),
      proventos NUMERIC NOT NULL DEFAULT 0 CHECK (proventos >= 0),
      descontos NUMERIC NOT NULL DEFAULT 0 CHECK (descontos >= 0),
      inss NUMERIC NOT NULL DEFAULT 0 CHECK (inss >= 0),
      irrf NUMERIC NOT NULL DEFAULT 0 CHECK (irrf >= 0),
      fgts NUMERIC NOT NULL DEFAULT 0 CHECK (fgts >= 0),
      liquido NUMERIC NOT NULL DEFAULT 0 CHECK (liquido >= 0),
      status TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.rh_epis (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      validade_dias INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.rh_epi_entregas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
      epi_id UUID NOT NULL REFERENCES public.rh_epis(id) ON DELETE CASCADE,
      data_entrega DATE NOT NULL,
      data_vencimento DATE NOT NULL,
      assinatura_digital_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.frota_veiculos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      modelo TEXT NOT NULL,
      placa TEXT NOT NULL,
      km_atual NUMERIC DEFAULT 0,
      vencimento_seguro DATE,
      vencimento_documento DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ,
      UNIQUE(empresa_id, placa)
  );

  CREATE TABLE IF NOT EXISTS public.frota_viagens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
      motorista_id UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
      origem TEXT NOT NULL,
      destino TEXT NOT NULL,
      km_inicial NUMERIC NOT NULL,
      km_final NUMERIC,
      data_inicio TIMESTAMPTZ NOT NULL,
      data_fim TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.frota_manutencoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL CHECK (tipo IN ('preventiva', 'corretiva')),
      data_prevista DATE,
      data_realizada DATE,
      km_previsto NUMERIC,
      km_realizado NUMERIC,
      custo NUMERIC DEFAULT 0 CHECK (custo >= 0),
      os_numero TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.frota_abastecimentos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      viagem_id UUID REFERENCES public.frota_viagens(id) ON DELETE SET NULL,
      veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
      litros NUMERIC NOT NULL CHECK (litros > 0),
      valor_total NUMERIC NOT NULL CHECK (valor_total > 0),
      km_registro NUMERIC NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.patrimonio_bens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      codigo_qr TEXT NOT NULL,
      valor_aquisicao NUMERIC NOT NULL DEFAULT 0,
      data_aquisicao DATE NOT NULL,
      vida_util_meses INTEGER NOT NULL DEFAULT 12,
      localizacao_id UUID,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ,
      UNIQUE(empresa_id, codigo_qr)
  );

  -- Enable RLS
  ALTER TABLE public.rh_ponto ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.rh_ferias_afastamentos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.rh_folha_pagamento ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.rh_epis ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.rh_epi_entregas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.frota_veiculos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.frota_viagens ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.frota_manutencoes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.frota_abastecimentos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.patrimonio_bens ENABLE ROW LEVEL SECURITY;

END $$;

-- Clean existing policies
DROP POLICY IF EXISTS "rh_ponto_empresa" ON public.rh_ponto;
DROP POLICY IF EXISTS "rh_ferias_afastamentos_empresa" ON public.rh_ferias_afastamentos;
DROP POLICY IF EXISTS "rh_folha_pagamento_empresa" ON public.rh_folha_pagamento;
DROP POLICY IF EXISTS "rh_epis_empresa" ON public.rh_epis;
DROP POLICY IF EXISTS "rh_epi_entregas_empresa" ON public.rh_epi_entregas;
DROP POLICY IF EXISTS "frota_veiculos_empresa" ON public.frota_veiculos;
DROP POLICY IF EXISTS "frota_viagens_empresa" ON public.frota_viagens;
DROP POLICY IF EXISTS "frota_manutencoes_empresa" ON public.frota_manutencoes;
DROP POLICY IF EXISTS "frota_abastecimentos_empresa" ON public.frota_abastecimentos;
DROP POLICY IF EXISTS "patrimonio_bens_empresa" ON public.patrimonio_bens;

-- Create Policies
CREATE POLICY "rh_ponto_empresa" ON public.rh_ponto FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "rh_ferias_afastamentos_empresa" ON public.rh_ferias_afastamentos FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "rh_folha_pagamento_empresa" ON public.rh_folha_pagamento FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "rh_epis_empresa" ON public.rh_epis FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "rh_epi_entregas_empresa" ON public.rh_epi_entregas FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "frota_veiculos_empresa" ON public.frota_veiculos FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "frota_viagens_empresa" ON public.frota_viagens FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "frota_manutencoes_empresa" ON public.frota_manutencoes FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "frota_abastecimentos_empresa" ON public.frota_abastecimentos FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());
CREATE POLICY "patrimonio_bens_empresa" ON public.patrimonio_bens FOR ALL TO authenticated USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

-- Functions and Triggers
CREATE OR REPLACE FUNCTION public.check_frota_consumo()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_last_km NUMERIC;
  v_last_liters NUMERIC;
  v_km_diff NUMERIC;
  v_kml_current NUMERIC;
  v_avg_kml NUMERIC;
  v_admin_id UUID;
BEGIN
  SELECT km_registro, litros INTO v_last_km, v_last_liters 
  FROM public.frota_abastecimentos 
  WHERE veiculo_id = NEW.veiculo_id AND id != NEW.id AND km_registro < NEW.km_registro
  ORDER BY km_registro DESC LIMIT 1;

  IF v_last_km IS NOT NULL THEN
    v_km_diff := NEW.km_registro - v_last_km;
    IF v_km_diff > 0 AND NEW.litros > 0 THEN
      v_kml_current := v_km_diff / NEW.litros;
      
      SELECT AVG((a1.km_registro - a2.km_registro) / a1.litros) INTO v_avg_kml
      FROM public.frota_abastecimentos a1
      JOIN public.frota_abastecimentos a2 ON a2.veiculo_id = a1.veiculo_id AND a2.km_registro < a1.km_registro
      WHERE a1.veiculo_id = NEW.veiculo_id AND a1.id != NEW.id
        AND NOT EXISTS (SELECT 1 FROM public.frota_abastecimentos a3 WHERE a3.veiculo_id = a1.veiculo_id AND a3.km_registro > a2.km_registro AND a3.km_registro < a1.km_registro);
        
      IF v_avg_kml IS NOT NULL AND v_avg_kml > 0 THEN
        IF ABS(v_kml_current - v_avg_kml) / v_avg_kml > 0.20 THEN
          FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
            INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
            VALUES (NEW.empresa_id, v_admin_id, 'Anomalia de Consumo', 'O veículo (ID ' || NEW.veiculo_id || ') registrou um consumo de ' || ROUND(v_kml_current, 2) || ' Km/L, desvio maior que 20% da média.', 'alerta_frota', false);
          END LOOP;
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_check_frota_consumo ON public.frota_abastecimentos;
CREATE TRIGGER trg_check_frota_consumo AFTER INSERT ON public.frota_abastecimentos FOR EACH ROW EXECUTE FUNCTION public.check_frota_consumo();

CREATE OR REPLACE FUNCTION public.gerar_alertas_rh_frota(p_empresa_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  r RECORD;
  v_admin_id UUID;
BEGIN
  IF p_empresa_id != public.get_user_empresa_id() AND NOT public.is_admin_saas() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  FOR r IN 
    SELECT e.*, ep.nome as epi_nome, f.nome as func_nome 
    FROM public.rh_epi_entregas e JOIN public.rh_epis ep ON e.epi_id = ep.id JOIN public.funcionarios f ON e.funcionario_id = f.id
    WHERE e.empresa_id = p_empresa_id AND e.deleted_at IS NULL AND e.data_vencimento <= CURRENT_DATE + INTERVAL '10 days' AND e.data_vencimento >= CURRENT_DATE
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE empresa_id = p_empresa_id AND tipo = 'vencimento_epi' AND descricao LIKE '%' || r.id::text || '%') THEN
      FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = p_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (p_empresa_id, v_admin_id, 'Vencimento de EPI Próximo', 'O EPI ' || r.epi_nome || ' de ' || r.func_nome || ' vence em ' || TO_CHAR(r.data_vencimento, 'DD/MM/YYYY') || ' (ID: ' || r.id || ').', 'vencimento_epi', false);
      END LOOP;
    END IF;
  END LOOP;

  FOR r IN 
    SELECT m.*, v.placa, v.modelo 
    FROM public.frota_manutencoes m JOIN public.frota_veiculos v ON m.veiculo_id = v.id
    WHERE m.empresa_id = p_empresa_id AND m.deleted_at IS NULL AND m.tipo = 'preventiva' AND m.data_realizada IS NULL AND m.data_prevista <= CURRENT_DATE + INTERVAL '15 days' AND m.data_prevista >= CURRENT_DATE
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE empresa_id = p_empresa_id AND tipo = 'manutencao_preventiva' AND descricao LIKE '%' || r.id::text || '%') THEN
      FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = p_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (p_empresa_id, v_admin_id, 'Manutenção Preventiva Próxima', 'Veículo ' || r.modelo || ' (' || r.placa || ') prevista para ' || TO_CHAR(r.data_prevista, 'DD/MM/YYYY') || ' (ID: ' || r.id || ').', 'manutencao_preventiva', false);
      END LOOP;
    END IF;
  END LOOP;
END;
$function$;
