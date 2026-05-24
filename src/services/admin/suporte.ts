import { supabase } from '@/lib/supabase/client'

export const getTickets = async (filters?: {
  prioridade?: string
  status?: string
  empresa_id?: string
  modulo?: string
}) => {
  let query = supabase
    .from('suporte_tickets')
    .select('*, empresas(nome)')
    .order('created_at', { ascending: false })

  if (filters?.prioridade && filters.prioridade !== 'todos') {
    query = query.eq('prioridade', filters.prioridade)
  }
  if (filters?.status && filters.status !== 'todos') {
    query = query.eq('status', filters.status)
  }
  if (filters?.empresa_id && filters.empresa_id !== 'todas') {
    query = query.eq('empresa_id', filters.empresa_id)
  }
  if (filters?.modulo && filters.modulo !== 'todos') {
    query = query.eq('modulo', filters.modulo)
  }

  const { data, error } = await query
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

export const getMensagens = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('suporte_mensagens')
    .select('*, usuarios(nome, perfil)')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const addMensagem = async (ticketId: string, usuarioId: string, mensagem: string) => {
  const { data, error } = await supabase
    .from('suporte_mensagens')
    .insert([{ ticket_id: ticketId, usuario_id: usuarioId, mensagem }])
    .select('*, usuarios(nome, perfil)')
    .single()
  if (error) throw error
  return data
}

export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, perfil, email')
    .in('perfil', ['admin_saas', 'admin'])
    .order('nome', { ascending: true })
  if (error) throw error
  return data
}

export const getEmpresas = async () => {
  const { data, error } = await supabase
    .from('empresas')
    .select('id, nome')
    .order('nome', { ascending: true })
  if (error) throw error
  return data
}
