DO $$
BEGIN
  IF EXISTS (
    SELECT lote_producao, COUNT(*)
    FROM public.colheita_registros
    WHERE lote_producao IS NOT NULL
    GROUP BY lote_producao
    HAVING COUNT(*) > 1
  ) THEN
    UPDATE public.colheita_registros
    SET lote_producao = lote_producao || '-' || substr(md5(random()::text), 1, 4)
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY lote_producao ORDER BY created_at) as rnum
        FROM public.colheita_registros
        WHERE lote_producao IS NOT NULL
      ) t WHERE t.rnum > 1
    );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_colheita_lote_producao_uniq ON public.colheita_registros(lote_producao) WHERE lote_producao IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_colheita_safra_id ON public.colheita_registros(safra_id);
CREATE INDEX IF NOT EXISTS idx_custos_talhao_safra_id ON public.custos_talhao(safra_id);
CREATE INDEX IF NOT EXISTS idx_packing_recepcoes_status ON public.packing_recepcoes(status);
