import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Clock, ListTodo } from 'lucide-react'

export default function EquipePerformance() {
  const { empresa } = useEmpresa()
  const [operacoes, setOperacoes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [filterUser, setFilterUser] = useState<string>('all')

  useEffect(() => {
    if (empresa) {
      fetchData()
    }
  }, [empresa])

  const fetchData = async () => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [opRes, uRes] = await Promise.all([
      supabase
        .from('operacoes_campo')
        .select(`id, status, responsavel_id, data_inicio, data_conclusao`)
        .eq('empresa_id', empresa?.id)
        .gte('created_at', startOfMonth.toISOString()),
      supabase.from('usuarios').select('id, nome').eq('empresa_id', empresa?.id),
    ])

    setOperacoes(opRes.data || [])
    setUsuarios(uRes.data || [])
  }

  const { metrics, chartData } = useMemo(() => {
    let filteredOps = operacoes
    if (filterUser !== 'all') {
      filteredOps = operacoes.filter((op) => op.responsavel_id === filterUser)
    }

    let completed = 0
    let pending = 0
    let totalTime = 0
    let timeCount = 0

    const userStats: Record<string, { concluida: number; pendente: number }> = {}

    operacoes.forEach((op) => {
      const respId = op.responsavel_id || 'unassigned'
      if (!userStats[respId]) userStats[respId] = { concluida: 0, pendente: 0 }

      if (op.status === 'concluída') userStats[respId].concluida++
      else userStats[respId].pendente++
    })

    filteredOps.forEach((op) => {
      if (op.status === 'concluída') {
        completed++
        if (op.data_inicio && op.data_conclusao) {
          const dStart = new Date(op.data_inicio).getTime()
          const dEnd = new Date(op.data_conclusao).getTime()
          const diffDays = (dEnd - dStart) / (1000 * 3600 * 24)
          if (diffDays >= 0) {
            totalTime += diffDays
            timeCount++
          }
        }
      } else {
        pending++
      }
    })

    const avgTime = timeCount > 0 ? (totalTime / timeCount).toFixed(1) : 'N/A'

    const chartData = Object.entries(userStats).map(([userId, stats]) => {
      const user = usuarios.find((u) => u.id === userId)
      return {
        name: user ? user.nome || user.email : 'Sem Responsável',
        Concluídas: stats.concluida,
        Pendentes: stats.pendente,
      }
    })

    return {
      metrics: { completed, pending, avgTime },
      chartData: chartData.sort((a, b) => b.Concluídas - a.Concluídas),
    }
  }, [operacoes, filterUser, usuarios])

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance da Equipe</h1>
          <p className="text-muted-foreground">
            Métricas de produtividade por operador no mês atual.
          </p>
        </div>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrar por Operador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda a Equipe</SelectItem>
            {usuarios.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.nome || u.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              OS Concluídas
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.completed}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio Execução
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.avgTime} {metrics.avgTime !== 'N/A' && 'dias'}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Pendentes
            </CardTitle>
            <ListTodo className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Produtividade por Operador</CardTitle>
          <CardDescription>Comparativo de OS concluídas vs pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer
              config={{
                Concluídas: { color: 'hsl(var(--primary))' },
                Pendentes: { color: 'hsl(var(--muted-foreground)/0.5)' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Concluídas"
                    stackId="a"
                    fill="var(--color-Concluídas)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="Pendentes"
                    stackId="a"
                    fill="var(--color-Pendentes)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
