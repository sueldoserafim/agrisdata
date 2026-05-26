import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, TrendingUp, Target, Map } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts'

export default function PerformanceDashboard() {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(true)
  const [safras, setSafras] = useState<any[]>([])
  const [historico, setHistorico] = useState<any[]>([])
  const [fazendas, setFazendas] = useState<any[]>([])
  const [culturas, setCulturas] = useState<any[]>([])

  const [filterAno, setFilterAno] = useState('all')
  const [filterFazenda, setFilterFazenda] = useState('all')
  const [filterCultura, setFilterCultura] = useState('all')

  useEffect(() => {
    async function load() {
      if (!empresa?.id) return
      setLoading(true)

      const [safrasRes, histRes, fazendasRes, culturasRes] = await Promise.all([
        supabase
          .from('safras')
          .select(`
          id, nome_safra, codigo_safra, ano_safra, meta_producao_kg, fazenda_id,
          cultivares(cultura_id),
          colheita_registros(producao_liquida_ton)
        `)
          .eq('empresa_id', empresa.id)
          .eq('status', 'encerrada'),
        supabase
          .from('historico_produtividade_talhao')
          .select(`
          id, ano, produtividade_kg_ha, talhao_id, talhoes(nome, fazenda_id)
        `)
          .eq('empresa_id', empresa.id),
        supabase
          .from('fazendas')
          .select('id, nome')
          .eq('empresa_id', empresa.id)
          .is('deleted_at', null),
        supabase
          .from('culturas')
          .select('id, nome')
          .eq('empresa_id', empresa.id)
          .is('deleted_at', null),
      ])

      if (safrasRes.data) setSafras(safrasRes.data)
      if (histRes.data) setHistorico(histRes.data)
      if (fazendasRes.data) setFazendas(fazendasRes.data)
      if (culturasRes.data) setCulturas(culturasRes.data)

      setLoading(false)
    }
    load()
  }, [empresa?.id])

  const filteredSafras = useMemo(() => {
    return safras.filter((s) => {
      const matchAno = filterAno === 'all' || s.ano_safra?.toString() === filterAno
      const matchFazenda = filterFazenda === 'all' || s.fazenda_id === filterFazenda
      const matchCultura = filterCultura === 'all' || s.cultivares?.cultura_id === filterCultura
      return matchAno && matchFazenda && matchCultura
    })
  }, [safras, filterAno, filterFazenda, filterCultura])

  const filteredHistorico = useMemo(() => {
    return historico.filter((h) => {
      const matchAno = filterAno === 'all' || h.ano?.toString() === filterAno
      const matchFazenda = filterFazenda === 'all' || h.talhoes?.fazenda_id === filterFazenda
      return matchAno && matchFazenda
    })
  }, [historico, filterAno, filterFazenda])

  const chartDataProducao = useMemo(() => {
    return filteredSafras.map((s) => {
      const prodReal =
        s.colheita_registros?.reduce(
          (acc: number, c: any) => acc + (c.producao_liquida_ton || 0),
          0,
        ) || 0
      const metaTon = (s.meta_producao_kg || 0) / 1000
      return {
        name: s.nome_safra || s.codigo_safra || s.id.substring(0, 6),
        Realizada: Number(prodReal.toFixed(2)),
        Meta: Number(metaTon.toFixed(2)),
      }
    })
  }, [filteredSafras])

  const chartDataProdutividade = useMemo(() => {
    // Agrupar por ano
    const byYear: Record<number, any> = {}

    // Pegar nomes únicos de talhões
    const talhoesUnicos = new Set<string>()

    filteredHistorico.forEach((h) => {
      if (!h.ano) return
      if (!byYear[h.ano]) byYear[h.ano] = { ano: h.ano }

      const talhaoNome = h.talhoes?.nome || `Talhão ${h.talhao_id}`
      talhoesUnicos.add(talhaoNome)

      // Se houver mais de um registro do mesmo talhão no mesmo ano, média
      if (byYear[h.ano][talhaoNome]) {
        byYear[h.ano][talhaoNome] = (byYear[h.ano][talhaoNome] + (h.produtividade_kg_ha || 0)) / 2
      } else {
        byYear[h.ano][talhaoNome] = h.produtividade_kg_ha || 0
      }
    })

    const sorted = Object.values(byYear).sort((a, b) => a.ano - b.ano)
    return { data: sorted, lines: Array.from(talhoesUnicos) }
  }, [filteredHistorico])

  const anosSafras = Array.from(new Set(safras.map((s) => s.ano_safra).filter(Boolean))).sort(
    (a, b) => b - a,
  )

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--destructive))',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Desempenho e Comparativos</h1>
        <p className="text-muted-foreground mt-1">
          Compare produtividade, metas e histórico de talhões.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterAno} onValueChange={setFilterAno}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card">
            <SelectValue placeholder="Ano da Safra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Anos</SelectItem>
            {anosSafras.map((ano) => (
              <SelectItem key={ano} value={ano.toString()}>
                {ano}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterFazenda} onValueChange={setFilterFazenda}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card">
            <SelectValue placeholder="Fazenda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Fazendas</SelectItem>
            {fazendas.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCultura} onValueChange={setFilterCultura}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card">
            <SelectValue placeholder="Cultura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Culturas</SelectItem>
            {culturas.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="shadow-subtle border-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Produção vs Meta (Toneladas)</CardTitle>
              </div>
              <CardDescription>
                Comparativo entre a produção líquida realizada e a meta estipulada para a safra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartDataProducao.length === 0 ? (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado encontrado para os filtros selecionados.
                </div>
              ) : (
                <div className="h-[350px] w-full">
                  <ChartContainer
                    config={{
                      Realizada: { label: 'Realizada', color: 'hsl(var(--primary))' },
                      Meta: { label: 'Meta', color: 'hsl(var(--muted-foreground))' },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartDataProducao}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `${val}t`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                          dataKey="Realizada"
                          fill="var(--color-Realizada)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar dataKey="Meta" fill="var(--color-Meta)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-subtle border-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Evolução de Produtividade (kg/ha)</CardTitle>
              </div>
              <CardDescription>
                Histórico comparativo de produtividade dos talhões ao longo dos anos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartDataProdutividade.data.length === 0 ? (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Nenhum histórico encontrado para os filtros selecionados.
                </div>
              ) : (
                <div className="h-[350px] w-full">
                  <ChartContainer
                    config={chartDataProdutividade.lines.reduce(
                      (acc, line, i) => {
                        const safeKey = line.replace(/[^a-zA-Z0-9]/g, '')
                        acc[safeKey] = { label: line, color: colors[i % colors.length] }
                        return acc
                      },
                      {} as Record<string, any>,
                    )}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartDataProdutividade.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="ano"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {chartDataProdutividade.lines.map((line, i) => {
                          const safeKey = line.replace(/[^a-zA-Z0-9]/g, '')
                          return (
                            <Line
                              key={line}
                              type="monotone"
                              dataKey={line}
                              stroke={`var(--color-${safeKey})`}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
