import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format, subMonths, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownIcon, ArrowUpIcon, Wallet, DollarSign, PiggyBank } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export default function FinanceiroDashboard() {
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saldos, setSaldos] = useState({ brl: 0, usd: 0, eur: 0 })
  const [lancamentosPendentes, setLancamentosPendentes] = useState({ aReceber: 0, aPagar: 0 })

  const [cashFlowData, setCashFlowData] = useState<any[]>([])
  const [dreData, setDreData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa || !user) return
    loadData()
    checkBillingAlerts()
  }, [empresa, user])

  const checkBillingAlerts = async () => {
    try {
      const today = new Date()
      const targetDate = addDays(today, 3)
      const targetDateStr = format(targetDate, 'yyyy-MM-dd')
      const todayStr = format(today, 'yyyy-MM-dd')

      const { data: lancamentos } = await supabase
        .from('financeiro_lancamentos')
        .select('*')
        .eq('empresa_id', empresa?.id)
        .eq('status', 'pendente')
        .lte('data_vencimento', targetDateStr)

      if (!lancamentos || lancamentos.length === 0) return

      for (const l of lancamentos) {
        if (!l.data_vencimento) continue
        const isOverdue = l.data_vencimento < todayStr
        const title = isOverdue ? 'Pagamento Atrasado' : 'Vencimento Próximo'
        const desc = `Lançamento: ${l.descricao} | Valor: R$ ${l.valor}`

        const { data: existing } = await supabase
          .from('alertas')
          .select('id')
          .eq('empresa_id', empresa?.id)
          .eq('tipo', 'financeiro')
          .like('descricao', `%${l.descricao}%`)
          .eq('lido', false)
          .maybeSingle()

        if (!existing) {
          await supabase.from('alertas').insert({
            empresa_id: empresa?.id,
            usuario_id: user?.id,
            titulo: title,
            descricao: desc,
            tipo: 'financeiro',
            lido: false,
          })

          if (isOverdue && l.tipo === 'receita' && Number(l.valor) > 5000) {
            await supabase.functions.invoke('send-email', {
              body: {
                to: user?.email,
                subject: 'Alerta de Recebível Atrasado (Alto Valor)',
                html: `<p>O lançamento <b>${l.descricao}</b> no valor de <b>R$ ${l.valor}</b> está atrasado.</p>`,
              },
            })
          }
        }
      }
    } catch (err) {
      console.error('Error checking billing alerts:', err)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: contas } = await supabase
        .from('contas_bancarias' as any)
        .select('moeda, saldo_atual')
        .eq('empresa_id', empresa?.id)
        .eq('ativo', true)

      let b = 0,
        u = 0,
        e = 0
      contas?.forEach((c) => {
        if (c.moeda === 'brl') b += Number(c.saldo_atual || 0)
        if (c.moeda === 'usd') u += Number(c.saldo_atual || 0)
        if (c.moeda === 'eur') e += Number(c.saldo_atual || 0)
      })
      setSaldos({ brl: b, usd: u, eur: e })

      const { data: lancamentos } = await supabase
        .from('financeiro_lancamentos')
        .select('*, plano_contas(descricao)')
        .eq('empresa_id', empresa?.id)

      let r = 0,
        p = 0

      const chartMap = new Map()
      const startOfPeriod = subMonths(new Date(), 11)
      for (let i = 0; i < 12; i++) {
        const d = addDays(startOfPeriod, i * 30)
        const monthYear = format(d, 'MMM yyyy', { locale: ptBR })
        chartMap.set(monthYear, { name: monthYear, receitas: 0, despesas: 0 })
      }

      const dreMap = new Map()

      lancamentos?.forEach((l) => {
        if (l.status === 'pendente' || l.status === 'atrasado') {
          if (l.tipo === 'receita') r += Number(l.valor)
          if (l.tipo === 'despesa' || l.tipo === 'custo') p += Number(l.valor)
        }

        const lDate = l.data_lancamento || l.data_vencimento
        if (lDate) {
          const dateObj = new Date(lDate)
          if (dateObj >= startOfPeriod) {
            const monthYear = format(dateObj, 'MMM yyyy', { locale: ptBR })
            const entry = chartMap.get(monthYear)
            if (entry) {
              if (l.tipo === 'receita') entry.receitas += Number(l.valor)
              if (l.tipo === 'despesa' || l.tipo === 'custo') entry.despesas += Number(l.valor)
            }
          }
        }

        const categoria = l.plano_contas?.descricao || 'Sem Categoria'
        if (!dreMap.has(categoria)) dreMap.set(categoria, { categoria, receita: 0, despesa: 0 })
        const dEntry = dreMap.get(categoria)
        if (l.tipo === 'receita') dEntry.receita += Number(l.valor)
        if (l.tipo === 'despesa' || l.tipo === 'custo') dEntry.despesa += Number(l.valor)
      })

      setLancamentosPendentes({ aReceber: r, aPagar: p })
      setCashFlowData(Array.from(chartMap.values()))
      setDreData(Array.from(dreMap.values()))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(val)
  }

  const chartConfig = {
    receitas: { label: 'Receitas', color: 'hsl(var(--chart-2))' },
    despesas: { label: 'Despesas', color: 'hsl(var(--chart-1))' },
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Visão geral do caixa, fluxo e DRE.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo em BRL</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldos.brl, 'BRL')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo em USD</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldos.usd, 'USD')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">A Receber (Pendentes)</CardTitle>
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(lancamentosPendentes.aReceber, 'BRL')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa (12 Meses)</CardTitle>
            <CardDescription>Receitas vs Despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="receitas" fill="var(--color-receitas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DRE Resumido (Geral)</CardTitle>
            <CardDescription>Resultado por Plano de Contas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-auto">
              {dreData.length > 0 ? (
                dreData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-sm">{d.categoria}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">R: {formatCurrency(d.receita, 'BRL')}</span>
                      <span className="text-red-600">D: {formatCurrency(d.despesa, 'BRL')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground pt-10">
                  Nenhum dado encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
