import { supabase } from '@/lib/supabase/client'

export const grausDiaService = {
  async fetchBySafra(empresaId: string, safraId: string) {
    try {
      const { data, error } = await supabase
        .from('graus_dia')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('safra_id', safraId)
        .is('deleted_at', null)
        .order('data', { ascending: false })

      if (error) {
        console.warn('Supabase fetchBySafra error:', error)
        return []
      }
      return data || []
    } catch (err) {
      console.warn('Exception in fetchBySafra:', err)
      return []
    }
  },

  async getSafras(empresaId: string) {
    try {
      const { data, error } = await supabase
        .from('safras')
        .select(
          'id, nome_safra, codigo_safra, data_plantio, data_colheita_prevista, status, talhao_id, cultivares(id, nome, gda_objetivo_colheita, culturas(id, nome, temperatura_base_gda))',
        )
        .eq('empresa_id', empresaId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase getSafras error:', error)
        return []
      }
      return data || []
    } catch (err) {
      console.warn('Exception in getSafras:', err)
      return []
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase.from('graus_dia').select('*').eq('id', id).single()

      if (error) {
        console.warn('Supabase getById error:', error)
        throw error
      }
      return data
    } catch (err) {
      console.warn('Exception in getById:', err)
      throw err
    }
  },

  async save(payload: any) {
    try {
      if (payload.id) {
        const { error } = await supabase.from('graus_dia').update(payload).eq('id', payload.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('graus_dia').insert(payload)
        if (error) throw error
      }
    } catch (err) {
      console.warn('Exception in save GDA:', err)
      throw err
    }
  },

  async remove(id: string) {
    try {
      const { error } = await supabase
        .from('graus_dia')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.warn('Exception in remove GDA:', err)
      throw err
    }
  },
}
