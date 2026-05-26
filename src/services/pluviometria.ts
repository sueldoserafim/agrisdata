import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

export type Pluviometria = Database['public']['Tables']['pluviometria']['Row'] & {
  talhoes?: { nome: string } | null
}
export type PluviometriaInsert = Database['public']['Tables']['pluviometria']['Insert']
export type PluviometriaUpdate = Database['public']['Tables']['pluviometria']['Update']

export const pluviometriaService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pluviometria')
      .select('*, talhoes(nome)')
      .is('deleted_at', null)
      .order('data', { ascending: false })

    if (error) throw error
    return data as Pluviometria[]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('pluviometria').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  async create(pluviometria: Omit<PluviometriaInsert, 'empresa_id'>) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('User not authenticated')

    const { data: profile } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    if (!profile?.empresa_id) throw new Error('Empresa not found')

    const { data, error } = await supabase
      .from('pluviometria')
      .insert({ ...pluviometria, empresa_id: profile.empresa_id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, pluviometria: PluviometriaUpdate) {
    const { data, error } = await supabase
      .from('pluviometria')
      .update(pluviometria)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('pluviometria')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
