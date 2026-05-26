import { supabase } from '@/lib/supabase/client'

export const grausDiaService = {
  async fetchBySafra(empresaId: string, safraId: string) {
    const { data, error } = await supabase
      .from('graus_dia')
      .select('*, usuarios(nome)')
      .eq('empresa_id', empresaId)
      .eq('safra_id', safraId)
      .is('deleted_at', null)
      .order('data', { ascending: false })

    if (error) throw error
    return data
  },

  async getSafras(empresaId: string) {
    const { data, error } = await supabase
      .from('safras')
      .select(
        'id, nome_safra, codigo_safra, data_plantio, status, talhao_id, cultivares(id, nome, gda_objetivo_colheita, culturas(id, nome, temperatura_base_gda))',
      )
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('graus_dia').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  async save(payload: any) {
    if (payload.id) {
      const { error } = await supabase.from('graus_dia').update(payload).eq('id', payload.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('graus_dia').insert(payload)
      if (error) throw error
    }
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('graus_dia')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
