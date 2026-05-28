DO $$
BEGIN
  -- Create rh_ponto
  CREATE TABLE IF NOT EXISTS public.rh_ponto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude NUMERIC,
    longitude NUMERIC,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create rh_ferias_afastamentos
  CREATE TABLE IF NOT EXISTS public.rh_ferias_afastamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('ferias', 'medico', 'falta', 'licenca')),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'solicitado' CHECK (status IN ('solicitado', 'aprovado', 'rejeitado')),
    aprovador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create rh_folha_pagamento
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
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create rh_epis
  CREATE TABLE IF NOT EXISTS public.rh_epis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    validade_dias INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create rh_epi_entregas
  CREATE TABLE IF NOT EXISTS public.rh_epi_entregas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    epi_id UUID NOT NULL REFERENCES public.rh_epis(id) ON DELETE CASCADE,
    data_entrega DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    assinatura_digital_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create frota_veiculos
  CREATE TABLE IF NOT EXISTS public.frota_veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    modelo TEXT NOT NULL,
    placa TEXT NOT NULL UNIQUE,
    km_atual NUMERIC NOT NULL DEFAULT 0,
    vencimento_seguro DATE,
    vencimento_documento DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create frota_viagens
  CREATE TABLE IF NOT EXISTS public.frota_viagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
    motorista_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    origem TEXT NOT NULL,
    destino TEXT NOT NULL,
    km_inicial NUMERIC NOT NULL DEFAULT 0,
    km_final NUMERIC,
    data_inicio TIMESTAMPTZ NOT NULL,
    data_fim TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create frota_manutencoes
  CREATE TABLE IF NOT EXISTS public.frota_manutencoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('preventiva', 'corretiva')),
    data_prevista DATE,
    data_realizada DATE,
    km_previsto NUMERIC,
    km_realizado NUMERIC,
    custo NUMERIC NOT NULL DEFAULT 0 CHECK (custo >= 0),
    os_numero TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create frota_abastecimentos
  CREATE TABLE IF NOT EXISTS public.frota_abastecimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    viagem_id UUID REFERENCES public.frota_viagens(id) ON DELETE SET NULL,
    veiculo_id UUID NOT NULL REFERENCES public.frota_veiculos(id) ON DELETE CASCADE,
    litros NUMERIC NOT NULL CHECK (litros > 0),
    valor_total NUMERIC NOT NULL CHECK (valor_total > 0),
    km_registro NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create patrimonio_bens
  CREATE TABLE IF NOT EXISTS public.patrimonio_bens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    codigo_qr TEXT UNIQUE,
    valor_aquisicao NUMERIC NOT NULL DEFAULT 0 CHECK (valor_aquisicao >= 0),
    data_aquisicao DATE NOT NULL,
    vida_util_meses INT NOT NULL DEFAULT 1 CHECK (vida_util_meses > 0),
    localizacao_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
END $$;

DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN SELECT unnest(ARRAY[
    'rh_ponto', 'rh_ferias_afastamentos', 'rh_folha_pagamento', 'rh_epis', 'rh_epi_entregas',
    'frota_veiculos', 'frota_viagens', 'frota_manutencoes', 'frota_abastecimentos', 'patrimonio_bens'
  ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS %I_empresa_select ON public.%I;', table_name, table_name);
    EXECUTE format('CREATE POLICY %I_empresa_select ON public.%I FOR SELECT TO authenticated USING (empresa_id = get_user_empresa_id());', table_name, table_name);
    
    EXECUTE format('DROP POLICY IF EXISTS %I_empresa_insert ON public.%I;', table_name, table_name);
    EXECUTE format('CREATE POLICY %I_empresa_insert ON public.%I FOR INSERT TO authenticated WITH CHECK (empresa_id = get_user_empresa_id());', table_name, table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I_empresa_update ON public.%I;', table_name, table_name);
    EXECUTE format('CREATE POLICY %I_empresa_update ON public.%I FOR UPDATE TO authenticated USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());', table_name, table_name);

    EXECUTE format('DROP POLICY IF EXISTS %I_empresa_delete ON public.%I;', table_name, table_name);
    EXECUTE format('CREATE POLICY %I_empresa_delete ON public.%I FOR DELETE TO authenticated USING (empresa_id = get_user_empresa_id());', table_name, table_name);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.check_frota_consumo()
RETURNS trigger AS $$
DECLARE
  v_last_km numeric;
  v_km_diff numeric;
  v_kml numeric;
  v_avg_kml numeric;
  v_admin_id uuid;
BEGIN
  SELECT km_registro INTO v_last_km
  FROM public.frota_abastecimentos
  WHERE veiculo_id = NEW.veiculo_id AND id != NEW.id
  ORDER BY km_registro DESC
  LIMIT 1;

  IF v_last_km IS NOT NULL AND NEW.km_registro > v_last_km THEN
    v_km_diff := NEW.km_registro - v_last_km;
    v_kml := v_km_diff / NEW.litros;
    
    SELECT AVG((a1.km_registro - a2.km_registro) / a1.litros) INTO v_avg_kml
    FROM public.frota_abastecimentos a1
    JOIN public.frota_abastecimentos a2 ON a1.veiculo_id = a2.veiculo_id 
      AND a2.km_registro = (SELECT MAX(km_registro) FROM public.frota_abastecimentos WHERE veiculo_id = a1.veiculo_id AND km_registro < a1.km_registro)
    WHERE a1.veiculo_id = NEW.veiculo_id AND a1.id != NEW.id;

    IF v_avg_kml IS NOT NULL AND v_avg_kml > 0 THEN
      IF ABS(v_kml - v_avg_kml) / v_avg_kml > 0.20 THEN
        FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
          INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
          VALUES (NEW.empresa_id, v_admin_id, 'Anomalia de Consumo', 'Veículo ' || NEW.veiculo_id || ' registrou consumo de ' || ROUND(v_kml, 2) || ' Km/L, com desvio de >20% da média de ' || ROUND(v_avg_kml, 2) || ' Km/L.', 'frota_consumo', false);
        END LOOP;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_frota_abastecimentos_insert ON public.frota_abastecimentos;
CREATE TRIGGER on_frota_abastecimentos_insert
  AFTER INSERT ON public.frota_abastecimentos
  FOR EACH ROW EXECUTE FUNCTION public.check_frota_consumo();

CREATE OR REPLACE FUNCTION public.check_daily_alerts()
RETURNS void AS $$
DECLARE
  v_epi RECORD;
  v_manut RECORD;
  v_admin_id uuid;
BEGIN
  FOR v_epi IN
    SELECT ee.id, e.nome, ee.data_vencimento, ee.empresa_id, f.nome as func_nome
    FROM public.rh_epi_entregas ee
    JOIN public.rh_epis e ON ee.epi_id = e.id
    JOIN public.funcionarios f ON ee.funcionario_id = f.id
    WHERE ee.data_vencimento = CURRENT_DATE + INTERVAL '10 days'
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE tipo = 'epi_vencimento' AND descricao LIKE '%' || v_epi.id::text || '%') THEN
      FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_epi.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (v_epi.empresa_id, v_admin_id, 'EPI Vencendo', 'O EPI ' || v_epi.nome || ' do funcionário ' || v_epi.func_nome || ' vence em 10 dias (' || v_epi.data_vencimento || '). Ref: ' || v_epi.id::text, 'epi_vencimento', false);
      END LOOP;
    END IF;
  END LOOP;

  FOR v_manut IN
    SELECT m.id, m.data_prevista, m.empresa_id, v.placa, v.modelo
    FROM public.frota_manutencoes m
    JOIN public.frota_veiculos v ON m.veiculo_id = v.id
    WHERE m.tipo = 'preventiva' AND m.data_prevista = CURRENT_DATE + INTERVAL '15 days' AND m.data_realizada IS NULL
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE tipo = 'manutencao_preventiva' AND descricao LIKE '%' || v_manut.id::text || '%') THEN
      FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_manut.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (v_manut.empresa_id, v_admin_id, 'Manutenção Preventiva Agendada', 'O veículo ' || v_manut.modelo || ' (' || v_manut.placa || ') tem manutenção prevista para ' || v_manut.data_prevista || '. Ref: ' || v_manut.id::text, 'manutencao_preventiva', false);
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
