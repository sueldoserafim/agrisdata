import { supabase } from '@/lib/supabase/client'

export interface Produto {
  id: string
  empresa_id: string
  nome: string
  codigo_interno?: string
  categoria?: string
  tipo?: string
  fabricante_marca?: string
  unidade_medida?: string
  preco_unitario?: number
  estoque_minimo?: number
  prazo_validade_dias?: number
  codigo_ncm?: string
  classe_risco?: string
  status?: string
  registro_mapa?: string
  classe_toxicologica?: string
  carencia_dias?: number
  exige_receituario?: boolean
  ingrediente_ativo?: string
  recomendacao_uso?: string
  visivel_operadores?: boolean
}

export const produtosService = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('nome')
    if (error) throw error
    return data as Produto[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    if (error) throw error
    return data as Produto
  },

  async create(produto: Omit<Produto, 'id'>) {
    const { data, error } = await supabase.from('produtos').insert([produto]).select().single()
    if (error) throw error
    return data as Produto
  },

  async update(id: string, produto: Partial<Produto>) {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Produto
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('produtos')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    return true
  },
}
