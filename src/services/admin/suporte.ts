import { supabase } from '@/lib/supabase/client'

export const getTickets = async () => {
  const { data, error } = await supabase
    .from('suporte_tickets')
    .select('*, empresas(nome)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getTicket = async (id: string) => {
  const { data, error } = await supabase
    .from('suporte_tickets')
    .select('*, empresas(nome)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const updateTicket = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('suporte_tickets')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}
