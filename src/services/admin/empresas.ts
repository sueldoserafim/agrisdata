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
  const payload = {
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    email: empresa.email,
    telefone: empresa.telefone,
    plano_id: empresa.plano_id,
    slug: empresa.slug,
    ativo: empresa.ativo,
    modulos_habilitados: empresa.modulos_habilitados,
    limite_usuarios: empresa.limite_usuarios,
  }
  if (empresa.id) {
    const { data, error } = await supabase
      .from('empresas')
      .update(payload)
      .eq('id', empresa.id)
      .select()
    if (error) throw error
    return data[0]
  } else {
    const { data, error } = await supabase.from('empresas').insert([payload]).select()
    if (error) throw error
    return data[0]
  }
}

export const createTenant = async (payload: any) => {
  const { data, error } = await supabase.functions.invoke('admin-create-company', {
    body: payload,
  })
  if (error) throw error
  if (data.error) throw new Error(data.error)
  return data
}

export const deleteEmpresa = async (id: string) => {
  const { error } = await supabase
    .from('empresas')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
