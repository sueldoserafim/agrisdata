import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Droplet, Activity, ActivitySquare, CalendarHeart, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { format, differenceInDays } from 'date-fns'
import { VacariaProducaoLeite, VacariaEventoReprodutivo } from './types'

const chartConfig = { volume: { label: 'Volume (L)', color: 'hsl(var(--primary))' } }

export default function VacariaDashboard() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState<string>('')
  const [producao, setProducao] = useState<VacariaProducaoLeite[]>([])
  const [eventos, setEventos] = useState<VacariaEventoReprodutivo[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setEmpresaId(data.empresa_id)
      })
  }, [user])

  useEffect(() => {
    if (!empresaId) return
    const fetchData = async () => {
      const [resProd, resEvt] = await Promise.all([
        supabase.from('vacaria_producao_leite').select('*').eq('empresa_id', empresaId),
        supabase
          .from('vacaria_eventos_reprodutivos')
          .select('*, animal:vacaria_animais(brinco, nome)')
          .eq('empresa_id', empresaId),
      ])
      if (resProd.data) setProducao(resProd.data)
      if (resEvt.data) setEventos(resEvt.data)
    }
    fetchData()
  }, [empresaId])

  const kpis = useMemo(() => {
    let toques = 0,
      prenhes = 0
    eventos.forEach((e) => {
      if (e.tipo === 'toque') {
        toques++
        if (e.resultado_toque === 'prenhe') prenhes++
      }
    })
    const prenhez = toques > 0 ? (prenhes / toques) * 100 : 0

    const lactacao =
      producao.length > 0
        ? producao.reduce((acc, p) => acc + Number(p.volume_litros), 0) /
          new Set(producao.map((p) => p.data_ordenha)).size
        : 0

    const partos = eventos
      .filter((e) => e.tipo === 'parto')
      .sort((a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime())
    const partosByAnimal: Record<string, string[]> = {}
    partos.forEach((p) => {
      if (!partosByAnimal[p.animal_id]) partosByAnimal[p.animal_id] = []
      partosByAnimal[p.animal_id].push(p.data_evento)
    })

    let iepSum = 0,
      iepCount = 0
    Object.values(partosByAnimal).forEach((dates) => {
      for (let i = 1; i < dates.length; i++) {
        iepSum += differenceInDays(new Date(dates[i]), new Date(dates[i - 1]))
        iepCount++
      }
    })
    const iep = iepCount > 0 ? iepSum / iepCount : 0

    return { prenhez, lactacao, iep, gmd: 0.85 } // GMD mocked for visual
  }, [producao, eventos])

  const chartData = useMemo(() => {
    const dataByDate: Record<string, number> = {}
    producao.forEach((p) => {
      dataByDate[p.data_ordenha] = (dataByDate[p.data_ordenha] || 0) + Number(p.volume_litros)
    })
    return Object.entries(dataByDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14)
  }, [producao])

  const prevPartos = eventos.filter(
    (e) =>
      e.previsao_parto &&
      new Date(e.previsao_parto) > new Date() &&
      differenceInDays(new Date(e.previsao_parto), new Date()) <= 30,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Vacaria</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Intervalo Entre Partos (IEP)</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Média de dias entre partos de um mesmo animal</TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.iep.toFixed(0)} dias</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Prenhez</CardTitle>
            <CalendarHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.prenhez.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Média Lactação / Dia</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.lactacao.toFixed(1)} L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ganho Médio Diário (GMD)</CardTitle>
            <ActivitySquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.gmd.toFixed(2)} kg/dia</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Produção Diária (Últimos 14 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full mt-4">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => format(new Date(v), 'dd/MM')}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-volume)"
                    fill="var(--color-volume)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados de produção
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Previsão de Partos (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prevPartos.length > 0 ? (
                prevPartos.map((p) => (
                  <div key={p.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {p.animal?.brinco} - {p.animal?.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">Evento: {p.tipo}</p>
                    </div>
                    <div className="text-sm font-bold">
                      {p.previsao_parto ? format(new Date(p.previsao_parto), 'dd/MM/yyyy') : ''}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum parto previsto próximo.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
