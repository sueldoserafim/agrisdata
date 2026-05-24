import { supabase } from '@/lib/supabase/client'

export const getEmpresas = async () => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*, planos(nome)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getEmpresa = async (id: string) => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*, planos(nome)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const saveEmpresa = async (empresa: any) => {
  if (empresa.id) {
    const { data, error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', empresa.id)
      .select()
    if (error) throw error
    return data[0]
  } else {
    const { data, error } = await supabase.from('empresas').insert([empresa]).select()
    if (error) throw error
    return data[0]
  }
}

export const deleteEmpresa = async (id: string) => {
  const { error } = await supabase
    .from('empresas')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
