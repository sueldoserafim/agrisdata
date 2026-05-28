import { supabase } from '@/lib/supabase/client'

export async function getVendedores(empresa_id: string) {
  return await supabase
    .from('vendedores')
    .select('*')
    .eq('empresa_id', empresa_id)
    .is('deleted_at', null)
}

export async function getVendedor(id: string) {
  const { data } = await supabase.from('vendedores').select('*').eq('id', id).single()
  return data
}

export async function saveVendedor(empresa_id: string, id: string | null, data: any) {
  if (id) {
    const { error } = await supabase.from('vendedores').update(data).eq('id', id)
    if (error) throw error
    return id
  } else {
    const { data: newV, error } = await supabase
      .from('vendedores')
      .insert({ ...data, empresa_id })
      .select()
      .single()
    if (error) throw error
    return newV.id
  }
}
