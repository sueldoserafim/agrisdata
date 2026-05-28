import { supabase } from '@/lib/supabase/client'

export const cooperativaService = {
  async getContratos(empresaId: string) {
    const { data, error } = await supabase
      .from('cooperados_contratos' as any)
      .select(`
        *,
        fornecedores (nome, cnpj),
        safras (nome_safra, codigo_safra),
        talhoes (nome)
      `)
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getContrato(id: string) {
    const { data, error } = await supabase
      .from('cooperados_contratos' as any)
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async saveContrato(payload: any) {
    if (payload.id) {
      const { data, error } = await supabase
        .from('cooperados_contratos' as any)
        .update(payload)
        .eq('id', payload.id)
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('cooperados_contratos' as any)
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data
    }
  },

  async deleteContrato(id: string) {
    const { error } = await supabase
      .from('cooperados_contratos' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async getCooperados(empresaId: string) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('is_cooperado', true)
      .is('deleted_at', null)

    if (error) throw error
    return data
  },

  async getPalletsSemProdutor(empresaId: string, limit = 100) {
    const { data, error } = await supabase
      .from('pallets')
      .select('id, codigo_pallet, peso_liquido_kg, safra_id, created_at')
      .eq('empresa_id', empresaId)
      .is('produtor_id', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },

  async atribuirPallets(palletIds: string[], produtorId: string) {
    const { error } = await supabase
      .from('pallets')
      .update({ produtor_id: produtorId })
      .in('id', palletIds)
    if (error) throw error
  },
}
