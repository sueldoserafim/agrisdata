DO $DO$
DECLARE
  v_empresa_id uuid;
  v_id1 uuid := gen_random_uuid();
  v_id2 uuid := gen_random_uuid();
  v_id3 uuid := gen_random_uuid();
  v_id4 uuid := gen_random_uuid();
  v_id5 uuid := gen_random_uuid();
BEGIN
  -- Obtem a primeira empresa disponível para adicionar os dados base
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  
  IF v_empresa_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.plano_contas WHERE empresa_id = v_empresa_id AND codigo = '1') THEN
      INSERT INTO public.plano_contas (id, empresa_id, codigo, descricao, tipo, natureza, nivel, ativo) VALUES
        (v_id1, v_empresa_id, '1', 'Ativo', 'ativo', 'sintetica', 1, true),
        (v_id2, v_empresa_id, '2', 'Passivo', 'passivo', 'sintetica', 1, true),
        (v_id3, v_empresa_id, '3', 'Receitas', 'receita', 'sintetica', 1, true),
        (v_id4, v_empresa_id, '4', 'Despesas', 'despesa', 'sintetica', 1, true),
        (v_id5, v_empresa_id, '5', 'Custos', 'custo', 'sintetica', 1, true);
        
      INSERT INTO public.plano_contas (id, empresa_id, codigo, descricao, tipo, natureza, nivel, ativo, pai_id) VALUES
        (gen_random_uuid(), v_empresa_id, '1.1', 'Ativo Circulante', 'ativo', 'sintetica', 2, true, v_id1),
        (gen_random_uuid(), v_empresa_id, '2.1', 'Passivo Circulante', 'passivo', 'sintetica', 2, true, v_id2),
        (gen_random_uuid(), v_empresa_id, '3.1', 'Receitas Operacionais', 'receita', 'sintetica', 2, true, v_id3),
        (gen_random_uuid(), v_empresa_id, '4.1', 'Despesas Operacionais', 'despesa', 'sintetica', 2, true, v_id4),
        (gen_random_uuid(), v_empresa_id, '5.1', 'Custo de Produção', 'custo', 'sintetica', 2, true, v_id5);
    END IF;
  END IF;
END $DO$;
