import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react'
import { getAdminDashboardStats } from '@/services/admin/dashboard'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

const mrrChartConfig = { mrr: { label: 'MRR', color: 'hsl(var(--primary))' } }
const planChartConfig = { value: { label: 'Empresas', color: 'hsl(var(--primary))' } }

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    getAdminDashboardStats().then(setStats)
  }, [])

  if (!stats) return <div className="p-6">Carregando dashboard...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.errors?.empresas ? (
                <span className="text-destructive text-base font-normal">Erro ao carregar</span>
              ) : (
                stats.totalEmpresas
              )}
            </div>
            {!stats.errors?.empresas && (
              <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Tendência de alta
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.errors?.usuarios ? (
                <span className="text-destructive text-base font-normal">Erro ao carregar</span>
              ) : (
                stats.totalUsuarios
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MRR (R$)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.errors?.faturas ? (
                <span className="text-destructive text-base font-normal">Erro ao carregar</span>
              ) : (
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  stats.mrr,
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novos este mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.errors?.empresas ? (
                <span className="text-destructive text-base font-normal">Erro ao carregar</span>
              ) : (
                stats.novosEsteMes
              )}
            </div>
            {!stats.errors?.empresas && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Crescimento constante
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>MRR Growth (Últimos 12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={mrrChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.mrrGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(val) => `R$${val / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Empresas por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={planChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.empresasPorPlano}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.empresasPorPlano.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Tickets Abertos por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {stats.ticketsPorPrioridade.map((t: any) => (
              <div key={t.prioridade} className={`flex-1 p-4 rounded-lg text-white ${t.color}`}>
                <div className="text-sm font-medium opacity-90">{t.prioridade}</div>
                <div className="text-3xl font-bold mt-2">{t.count}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
