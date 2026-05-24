import { supabase } from '@/lib/supabase/client'

export const getAdminDashboardStats = async () => {
  const [empresas, planos, tickets, faturas] = await Promise.all([
    supabase.from('empresas').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('planos').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase
      .from('suporte_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'aberto'),
    supabase.from('saas_faturas').select('valor_total').eq('status', 'pago'),
  ])

  const revenue = faturas.data?.reduce((acc, curr) => acc + (curr.valor_total || 0), 0) || 0

  return {
    totalEmpresas: empresas.count || 0,
    activePlanos: planos.count || 0,
    pendingTickets: tickets.count || 0,
    monthlyRevenue: revenue,
  }
}
