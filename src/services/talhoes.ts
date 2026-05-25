import { supabase } from '@/lib/supabase/client'

export const getTalhoes = async (empresaId: string) => {
  const { data, error } = await supabase
    .from('talhoes')
    .select(`
      *,
      fazendas ( nome )
    `)
    .eq('empresa_id', empresaId)
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}

export const getTalhao = async (id: string) => {
  const { data, error } = await supabase.from('talhoes').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export const createTalhao = async (payload: any) => {
  const { data, error } = await supabase.from('talhoes').insert(payload).select().single()

  if (error) throw error
  return data
}

export const updateTalhao = async (id: string, payload: any) => {
  const { data, error } = await supabase
    .from('talhoes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getFazendas = async (empresaId: string) => {
  const { data, error } = await supabase
    .from('fazendas')
    .select('id, nome')
    .eq('empresa_id', empresaId)
    .is('deleted_at', null)
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}

export const getTalhaoHistory = async (talhaoId: string) => {
  const { data, error } = await supabase
    .from('safras')
    .select(`
      id,
      data_plantio,
      data_colheita_real,
      status,
      cultivares (
        nome,
        culturas (
          nome
        )
      )
    `)
    .eq('talhao_id', talhaoId)
    .order('data_plantio', { ascending: false })

  if (error) throw error
  return data
}

export const getSoilAnalysis = async (talhaoId: string) => {
  const { data, error } = await supabase
    .from('analises_solo')
    .select('data_coleta')
    .eq('talhao_id', talhaoId)
    .order('data_coleta', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
