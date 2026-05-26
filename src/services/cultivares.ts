import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type CultivarRow = Database['public']['Tables']['cultivares']['Row'] & {
  codigo_interno?: string | null
  pais_origem?: string | null
  detentor_licenciador?: string | null
  produtividade_esperada_t_ha?: number | null
  shelf_life_ideal_dias?: number | null
  shelf_life_minimo_dias?: number | null
  gda_objetivo_colheita?: number | null
  culturas?: { nome: string } | null
}

export const cultivaresService = {
  async fetchAll(empresaId: string, culturaId?: string | null) {
    let query = supabase
      .from('cultivares')
      .select('*, culturas(nome)')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('nome')

    if (culturaId) {
      query = query.eq('cultura_id', culturaId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as CultivarRow[]
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('cultivares').select('*').eq('id', id).single()
    if (error) throw error
    return data as CultivarRow
  },
  async create(payload: any) {
    const { data, error } = await supabase.from('cultivares').insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id: string, payload: any) {
    const { data, error } = await supabase
      .from('cultivares')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id: string) {
    const { error } = await supabase
      .from('cultivares')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
}
