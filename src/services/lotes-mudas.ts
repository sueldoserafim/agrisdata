import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type LoteMuda = Database['public']['Tables']['lotes_mudas']['Row']
export type LoteMudaInsert = Database['public']['Tables']['lotes_mudas']['Insert']
export type LoteMudaUpdate = Database['public']['Tables']['lotes_mudas']['Update']

export const lotesMudasService = {
  async getList(empresaId: string) {
    const { data, error } = await supabase
      .from('lotes_mudas')
      .select('*, estufas(nome), culturas(nome), cultivares(nome)')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string, empresaId: string) {
    const { data, error } = await supabase
      .from('lotes_mudas')
      .select('*')
      .eq('id', id)
      .eq('empresa_id', empresaId)
      .single()

    if (error) throw error
    return data
  },

  async create(payload: LoteMudaInsert) {
    const { data, error } = await supabase.from('lotes_mudas').insert(payload).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, payload: LoteMudaUpdate) {
    const { data, error } = await supabase
      .from('lotes_mudas')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lotes_mudas')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
