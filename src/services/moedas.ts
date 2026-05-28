import { supabase } from '@/lib/supabase/client'

export async function getMoedas(empresa_id: string) {
  const { data, error } = await supabase
    .from('moedas' as any)
    .select('*')
    .eq('empresa_id', empresa_id)
    .is('deleted_at', null)
    .order('nome')
  if (error) throw error
  return data
}

export async function saveMoeda(empresa_id: string, data: any, id?: string) {
  if (id) {
    const { data: updated, error } = await supabase
      .from('moedas' as any)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  } else {
    const { data: inserted, error } = await supabase
      .from('moedas' as any)
      .insert({ ...data, empresa_id })
      .select()
      .single()
    if (error) throw error
    return inserted
  }
}

export async function deleteMoeda(id: string) {
  const { error } = await supabase
    .from('moedas' as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
