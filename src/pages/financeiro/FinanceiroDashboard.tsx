import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format, subMonths, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownIcon, ArrowUpIcon, Wallet, DollarSign, Activity, Percent } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export default function FinanceiroDashboard() {
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saldos, setSaldos] = useState({ brl: 0, usd: 0, eur: 0 })
  const [lancamentosPendentes, setLancamentosPendentes] = useState({ aReceber: 0, aPagar: 0 })

  const [cashFlowData, setCashFlowData] = useState<any[]>([])

  // BI DRE Metrics State
  const [dreMetrics, setDreMetrics] = useState({
    totalReceitas: 0,
    custosOperacionais: 0,
    despesasLogisticas: 0,
    margemLiquida: 0,
  })

  useEffect(() => {
    if (!empresa || !user) return
    loadData()
    checkBillingAlerts()
  }, [empresa, user])

  const checkBillingAlerts = async () => {
    try {
      const today = new Date()
      const targetDateStr = format(addDays(today, 3), 'yyyy-MM-dd')
      const todayStr = format(today, 'yyyy-MM-dd')

      const { data: lancamentos } = await supabase
        .from('financeiro_lancamentos')
        .select('*')
        .eq('empresa_id', empresa?.id)
        .eq('status', 'pendente')
        .lte('data_vencimento', targetDateStr)

      if (lancamentos && lancamentos.length > 0) {
        for (const l of lancamentos) {
          if (!l.data_vencimento) continue
          const isOverdue = l.data_vencimento < todayStr
          const title = isOverdue ? 'Pagamento Atrasado (Automação)' : 'Vencimento Próximo'
          const desc = `O lançamento "${l.descricao}" no valor de R$ ${l.valor} atingiu data limite de ação. Verifique a tela financeira.`

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
      let dreR = 0,
        dreCO = 0,
        dreDL = 0

      const chartMap = new Map()
      const startOfPeriod = subMonths(new Date(), 11)
      for (let i = 0; i < 12; i++) {
        const d = addDays(startOfPeriod, i * 30)
        const monthYear = format(d, 'MMM yyyy', { locale: ptBR })
        chartMap.set(monthYear, { name: monthYear, receitas: 0, despesas: 0 })
      }

      lancamentos?.forEach((l) => {
        // Pending logic
        if (l.status === 'pendente' || l.status === 'atrasado') {
          if (l.tipo === 'receita') r += Number(l.valor)
          if (l.tipo === 'despesa' || l.tipo === 'custo') p += Number(l.valor)
        }

        // Cash flow historic mapping
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

        // BI DRE Categorization - Crossing Operational Costs with Logistics Expenses vs Revenue
        if (l.tipo === 'receita') {
          dreR += Number(l.valor)
        } else if (l.tipo === 'despesa' || l.tipo === 'custo') {
          const cat = (l.plano_contas?.descricao || '').toLowerCase()
          const desc = (l.descricao || '').toLowerCase()

          // Logic mapping logistics specifically vs general operational costs
          if (
            cat.includes('logístic') ||
            cat.includes('frete') ||
            cat.includes('exportação') ||
            desc.includes('frete') ||
            desc.includes('porto') ||
            desc.includes('container')
          ) {
            dreDL += Number(l.valor)
          } else {
            dreCO += Number(l.valor)
          }
        }
      })

      const lucroBruto = dreR - dreCO - dreDL
      const margem = dreR > 0 ? (lucroBruto / dreR) * 100 : 0

      setDreMetrics({
        totalReceitas: dreR,
        custosOperacionais: dreCO,
        despesasLogisticas: dreDL,
        margemLiquida: margem,
      })

      setLancamentosPendentes({ aReceber: r, aPagar: p })
      setCashFlowData(Array.from(chartMap.values()))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number, currency: string = 'BRL') => {
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira & BI</h1>
        <p className="text-muted-foreground mt-1">
          Monitoramento gerencial abrangendo fluxo de caixa projetado, cruzamentos operacionais e o
          Demonstrativo de Resultados (DRE) analítico.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Caixa Atual (BRL)</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(saldos.brl, 'BRL')}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Contas Câmbio (USD)</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(saldos.usd, 'USD')}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-green-700">Títulos A Receber</CardTitle>
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 tracking-tight">
              {formatCurrency(lancamentosPendentes.aReceber, 'BRL')}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-rose-700">Obrigações A Pagar</CardTitle>
            <ArrowDownIcon className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 tracking-tight">
              {formatCurrency(lancamentosPendentes.aPagar, 'BRL')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="shadow-sm md:col-span-4 border-l-4 border-l-primary flex flex-col justify-between h-full">
          <CardHeader>
            <CardTitle>DRE Gerencial Consolidado</CardTitle>
            <CardDescription className="text-xs">
              Crosstab financeiro isolando as despesas logísticas das demais operacionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm text-green-800 dark:text-green-400">
                    (=) Faturamento Total
                  </span>
                </div>
                <span className="font-bold text-lg text-green-600 dark:text-green-500">
                  {formatCurrency(dreMetrics.totalReceitas)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 px-1">
                <span className="font-medium text-sm text-muted-foreground">
                  (-) Custos Operacionais
                </span>
                <span className="text-rose-500 font-medium">
                  {formatCurrency(dreMetrics.custosOperacionais)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 pb-4 border-b border-dashed px-1">
                <span className="font-medium text-sm text-muted-foreground">
                  (-) Despesas Logísticas/Porto
                </span>
                <span className="text-rose-500 font-medium">
                  {formatCurrency(dreMetrics.despesasLogisticas)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  <span className="font-bold text-base">Margem Líquida</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-2xl font-extrabold ${dreMetrics.margemLiquida >= 0 ? 'text-primary' : 'text-rose-600'}`}
                  >
                    {dreMetrics.margemLiquida.toFixed(2)}%
                  </span>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">
                    Retorno Absoluto:{' '}
                    {formatCurrency(
                      dreMetrics.totalReceitas -
                        dreMetrics.custosOperacionais -
                        dreMetrics.despesasLogisticas,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm md:col-span-8">
          <CardHeader>
            <CardTitle>Fluxo de Caixa e Volumetria (Últimos 12 Meses)</CardTitle>
            <CardDescription>
              Visualização analítica temporal de receitas consolidadas e desembolsos sistêmicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickMargin={10}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    dataKey="receitas"
                    name="Receitas"
                    fill="var(--color-receitas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="despesas"
                    name="Despesas Totais"
                    fill="var(--color-despesas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
