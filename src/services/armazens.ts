import { supabase } from '@/lib/supabase/client'

export interface Armazem {
  id: string
  empresa_id: string
  nome: string
  localizacao?: string
  capacidade_toneladas?: number
  fazenda_id?: string
  tipo?: string
  responsavel_id?: string
  usa_peps?: boolean
  temperatura_controlada?: boolean
  temp_minima?: number
  temp_maxima?: number
}

export const armazensService = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase
      .from('armazens')
      .select('*, fazenda:fazendas(nome), responsavel:usuarios(nome)')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('nome')
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('armazens')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    if (error) throw error
    return data as Armazem
  },

  async create(armazem: Omit<Armazem, 'id'>) {
    const { data, error } = await supabase.from('armazens').insert([armazem]).select().single()
    if (error) throw error
    return data as Armazem
  },

  async update(id: string, armazem: Partial<Armazem>) {
    const { data, error } = await supabase
      .from('armazens')
      .update(armazem)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Armazem
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('armazens')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    return true
  },
}
