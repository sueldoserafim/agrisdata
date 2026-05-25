import { supabase } from '@/lib/supabase/client'

export interface RequisicaoInterna {
  id: string
  empresa_id: string
  solicitante_id: string
  produto_id: string
  quantidade: number
  justificativa: string | null
  status: 'pendente' | 'aprovado' | 'recusado'
  data_aprovacao: string | null
  created_at: string
  produto?: { nome: string; unidade_medida: string | null }
  solicitante?: { nome: string | null }
  aprovador?: { nome: string | null }
}

export const reqInternasService = {
  async getAll(empresaId: string): Promise<RequisicaoInterna[]> {
    const { data, error } = await supabase
      .from('requisicoes_internas')
      .select(`
        *,
        produto:produtos(nome, unidade_medida),
        solicitante:usuarios!requisicoes_internas_solicitante_id_fkey(nome),
        aprovador:usuarios!requisicoes_internas_aprovador_id_fkey(nome)
      `)
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as any
  },

  async create(payload: Partial<RequisicaoInterna>) {
    const { data, error } = await supabase
      .from('requisicoes_internas')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: 'aprovado' | 'recusado', aprovadorId: string) {
    const { data, error } = await supabase
      .from('requisicoes_internas')
      .update({ status, aprovador_id: aprovadorId })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
