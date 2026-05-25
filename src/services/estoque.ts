import { supabase } from '@/lib/supabase/client'

export interface LoteEstoque {
  id: string
  numero_lote: string | null
  quantidade: number | null
  data_validade: string | null
  data_entrada: string | null
}

export interface ProdutoComLotes {
  id: string
  nome: string
  codigo_interno: string | null
  estoque_minimo: number | null
  preco_unitario: number | null
  unidade_medida: string | null
  lotes_estoque: LoteEstoque[]
}

export const estoqueService = {
  async getProdutosComLotes(empresaId: string): Promise<ProdutoComLotes[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        codigo_interno,
        estoque_minimo,
        preco_unitario,
        unidade_medida,
        lotes_estoque (
          id,
          numero_lote,
          quantidade,
          data_validade,
          data_entrada
        )
      `)
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('nome')

    if (error) throw error
    return data as unknown as ProdutoComLotes[]
  },
}
