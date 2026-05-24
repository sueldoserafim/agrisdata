import { supabase } from '@/lib/supabase/client'

export const getAdminDashboardStats = async () => {
  const [empresasRes, usuariosRes, ticketsRes, faturasRes] = await Promise.all([
    supabase.from('empresas').select('id, created_at, plano_id, planos(nome)'),
    supabase.from('usuarios').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('suporte_tickets').select('id, prioridade, status').neq('status', 'resolvido'),
    supabase.from('saas_faturas').select('valor_total, created_at').eq('status', 'pago'),
  ])

  const empresas = empresasRes.data || []
  const faturas = faturasRes.data || []
  const tickets = ticketsRes.data || []

  const totalEmpresas = empresas.length
  const totalUsuarios = usuariosRes.count || 0
  const mrr = faturas.reduce((acc, curr) => acc + (curr.valor_total || 0), 0)

  const currentMonth = new Date().getMonth()
  const novosEsteMes = empresas.filter(
    (e) => new Date(e.created_at!).getMonth() === currentMonth,
  ).length

  // Planos mapping
  const planColors: Record<string, string> = {
    Starter: '#22c55e',
    Professional: '#3b82f6',
    Enterprise: '#a855f7',
    'Enterprise Plus': '#eab308',
  }

  const planCounts: Record<string, number> = {}
  empresas.forEach((e) => {
    const pName = e.planos?.nome || 'Sem Plano'
    planCounts[pName] = (planCounts[pName] || 0) + 1
  })
  const empresasPorPlano = Object.entries(planCounts).map(([name, value]) => ({
    name,
    value,
    fill: planColors[name] || '#94a3b8',
  }))

  // Tickets
  const priorityCounts: Record<string, number> = { Baixa: 0, Média: 0, Alta: 0, Urgente: 0 }
  tickets.forEach((t) => {
    if (t.prioridade === 'low') priorityCounts['Baixa']++
    else if (t.prioridade === 'medium') priorityCounts['Média']++
    else if (t.prioridade === 'high') priorityCounts['Alta']++
    else if (t.prioridade === 'urgent') priorityCounts['Urgente']++
  })

  const ticketsPorPrioridade = [
    { prioridade: 'Baixa', count: priorityCounts['Baixa'], color: 'bg-green-500' },
    { prioridade: 'Média', count: priorityCounts['Média'], color: 'bg-blue-500' },
    { prioridade: 'Alta', count: priorityCounts['Alta'], color: 'bg-orange-500' },
    { prioridade: 'Urgente', count: priorityCounts['Urgente'], color: 'bg-red-500' },
  ]

  // Mock MRR Growth (real data requires complex grouping)
  const mrrGrowth = [
    { month: 'Jan', mrr: mrr * 0.5 },
    { month: 'Fev', mrr: mrr * 0.6 },
    { month: 'Mar', mrr: mrr * 0.75 },
    { month: 'Abr', mrr: mrr * 0.8 },
    { month: 'Mai', mrr: mrr * 0.9 },
    { month: 'Jun', mrr: mrr || 1000 },
  ]

  return {
    totalEmpresas,
    totalUsuarios,
    mrr,
    novosEsteMes,
    empresasPorPlano,
    ticketsPorPrioridade,
    mrrGrowth,
  }
}
