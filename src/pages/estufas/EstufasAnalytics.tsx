import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Leaf } from 'lucide-react'

export default function EstufasAnalytics() {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(true)
  const [perdas, setPerdas] = useState<any[]>([])
  const [replantios, setReplantios] = useState<any[]>([])
  const [transplantios, setTransplantios] = useState<any[]>([])
  const [selectedCultivar, setSelectedCultivar] = useState<string>('all')

  useEffect(() => {
    if (empresa) {
      loadData()
    }
  }, [empresa])

  const loadData = async () => {
    setLoading(true)

    const { data: perdasData } = await supabase
      .from('perdas_estufa')
      .select('*, lotes_mudas(cultivar_id, cultivares(nome))')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)

    const { data: replantiosData } = await supabase
      .from('replantios')
      .select('*')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)

    const { data: transplantiosData } = await supabase
      .from('transplantios')
      .select('*, safras(nome_safra, codigo_safra, densidade_plantio), talhoes(nome)')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)

    setPerdas(perdasData || [])
    setReplantios(replantiosData || [])
    setTransplantios(transplantiosData || [])
    setLoading(false)
  }

  const cultivaresList = useMemo(() => {
    const list = new Map()
    perdas.forEach((p) => {
      const cultivar = p.lotes_mudas?.cultivares
      if (cultivar && !list.has(cultivar.nome)) {
        list.set(cultivar.nome, p.lotes_mudas.cultivar_id)
      }
    })
    return Array.from(list.entries()).map(([nome, id]) => ({ nome, id }))
  }, [perdas])

  const filteredPerdas = useMemo(() => {
    if (selectedCultivar === 'all') return perdas
    return perdas.filter((p) => p.lotes_mudas?.cultivar_id === selectedCultivar)
  }, [perdas, selectedCultivar])

  const perdasPorTipo = useMemo(() => {
    const counts = filteredPerdas.reduce(
      (acc, p) => {
        const tipo = p.tipo_perda || 'outro'
        acc[tipo] = (acc[tipo] || 0) + p.quantidade_perdida
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredPerdas])

  const replantiosPorMotivo = useMemo(() => {
    const counts = replantios.reduce(
      (acc, r) => {
        const motivo = r.motivo || 'outro'
        acc[motivo] = (acc[motivo] || 0) + r.quantidade_replantada
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [replantios])

  const perdasPorCultivar = useMemo(() => {
    const counts = perdas.reduce(
      (acc, p) => {
        const cultivar = p.lotes_mudas?.cultivares?.nome || 'Desconhecido'
        acc[cultivar] = (acc[cultivar] || 0) + p.quantidade_perdida
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts)
      .map(([cultivar, quantidade]) => ({ cultivar, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
  }, [perdas])

  const eficienciaData = useMemo(() => {
    return transplantios.map((t) => {
      const planejado = t.safras?.densidade_plantio || 0
      const totalPlantado = t.quantidade_transplantada + (t.quantidade_replantio || 0)
      const efetiva =
        (t.area_plantada_ha || 0) > 0 ? Math.round(totalPlantado / t.area_plantada_ha) : 0
      const diff = planejado > 0 ? ((efetiva - planejado) / planejado) * 100 : 0

      return {
        id: t.id,
        safra: t.safras?.nome_safra || t.safras?.codigo_safra || 'N/A',
        talhao: t.talhoes?.nome || 'N/A',
        planejado,
        efetiva,
        diff,
        area: t.area_plantada_ha,
      }
    })
  }, [transplantios])

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground animate-pulse">
        Carregando analytics...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics de Plantio</h1>
        <p className="text-muted-foreground mt-1">
          Dashboard de perdas de estufa, motivos de replantio e eficiência de densidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Perdas em Estufa por Tipo</CardTitle>
              <CardDescription>Distribuição das causas de mortalidade</CardDescription>
            </div>
            <div className="w-[180px]">
              <Select value={selectedCultivar} onValueChange={setSelectedCultivar}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Cultivar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Cultivares</SelectItem>
                  {cultivaresList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {perdasPorTipo.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados de perdas.
              </div>
            ) : (
              <ChartContainer
                config={{ value: { label: 'Perdas', color: 'hsl(var(--destructive))' } }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={perdasPorTipo}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {perdasPorTipo.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Replantio em Campo por Motivo</CardTitle>
            <CardDescription>Causas raízes de falhas pós-transplantio</CardDescription>
          </CardHeader>
          <CardContent>
            {replantiosPorMotivo.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados de replantio.
              </div>
            ) : (
              <ChartContainer
                config={{ value: { label: 'Replantios', color: 'hsl(var(--chart-2))' } }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={replantiosPorMotivo}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {replantiosPorMotivo.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Perdas por Cultivar</CardTitle>
            <CardDescription>Variedades mais suscetíveis</CardDescription>
          </CardHeader>
          <CardContent>
            {perdasPorCultivar.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                Sem dados.
              </div>
            ) : (
              <ChartContainer
                config={{ quantidade: { label: 'Perdas', color: 'hsl(var(--chart-3))' } }}
                className="h-[300px]"
              >
                <BarChart
                  data={perdasPorCultivar}
                  layout="vertical"
                  margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="cultivar" type="category" width={100} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Eficiência de Densidade de Plantio
            </CardTitle>
            <CardDescription>
              Comparativo entre densidade planejada na Safra e densidade efetiva (transplantado +
              replantado / ha)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eficienciaData.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed">
                Sem registros de transplantio.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Safra</TableHead>
                      <TableHead>Talhão</TableHead>
                      <TableHead className="text-right">Dens. Planejada</TableHead>
                      <TableHead className="text-right">Dens. Efetiva</TableHead>
                      <TableHead className="text-right">Variação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eficienciaData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.safra}</TableCell>
                        <TableCell>{row.talhao}</TableCell>
                        <TableCell className="text-right">
                          {row.planejado ? row.planejado.toLocaleString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-600">
                          {row.efetiva > 0 ? row.efetiva.toLocaleString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.planejado > 0 ? (
                            <Badge
                              className={
                                row.diff > 5
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : row.diff < -5
                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                    : 'bg-emerald-500 hover:bg-emerald-600'
                              }
                            >
                              {row.diff > 0 ? '+' : ''}
                              {row.diff.toFixed(1)}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
