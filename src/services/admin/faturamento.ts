import { supabase } from '@/lib/supabase/client'

export const getFaturas = async () => {
  const { data, error } = await supabase
    .from('saas_faturas')
    .select('*, empresas(nome)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const updateFaturaStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('saas_faturas')
    .update({ status })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}
