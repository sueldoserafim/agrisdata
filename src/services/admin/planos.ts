import { supabase } from '@/lib/supabase/client'

export const getPlanos = async () => {
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .is('deleted_at', null)
    .order('preco_mensal', { ascending: true })
  if (error) throw error
  return data
}

export const getPlano = async (id: string) => {
  const { data, error } = await supabase.from('planos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export const savePlano = async (plano: any) => {
  if (plano.id) {
    const { data, error } = await supabase.from('planos').update(plano).eq('id', plano.id).select()
    if (error) throw error
    return data[0]
  } else {
    const { data, error } = await supabase.from('planos').insert([plano]).select()
    if (error) throw error
    return data[0]
  }
}

export const deletePlano = async (id: string) => {
  const { error } = await supabase
    .from('planos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
