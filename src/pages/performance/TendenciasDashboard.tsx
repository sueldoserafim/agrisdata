import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Loader2, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const chartConfig = {
  produtividade: { label: 'Produtividade (kg/ha)', color: 'hsl(var(--chart-1))' },
  custoTotal: { label: 'Custo Total (R$)', color: 'hsl(var(--chart-2))' },
}

export default function TendenciasDashboard() {
  const { empresa } = useEmpresa()
  const [safras, setSafras] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) loadDados()
  }, [empresa?.id])

  const loadDados = async () => {
    setLoading(true)
    // Busca safras encerradas com seus totais
    const { data: safrasData } = await supabase
      .from('safras')
      .select(`
        id, nome_safra, codigo_safra, ano_safra, status, area_planejada_ha,
        colheita_registros(producao_liquida_ton, area_colhida_ha),
        custos_talhao(valor)
      `)
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('ano_safra', { ascending: true })

    if (safrasData) {
      const processed = safrasData.map((s) => {
        const totalColhidoKg = s.colheita_registros.reduce(
          (acc: number, cur: any) => acc + cur.producao_liquida_ton * 1000,
          0,
        )
        const areaTotalHa =
          s.colheita_registros.reduce((acc: number, cur: any) => acc + cur.area_colhida_ha, 0) ||
          s.area_planejada_ha ||
          1
        const custoTotal = s.custos_talhao.reduce(
          (acc: number, cur: any) => acc + (cur.valor || 0),
          0,
        )

        return {
          id: s.id,
          nome: s.nome_safra || s.codigo_safra || s.id,
          ano: s.ano_safra,
          status: s.status,
          produtividade: Math.round(totalColhidoKg / areaTotalHa),
          custoTotal: Math.round(custoTotal),
          custoPorKg: totalColhidoKg > 0 ? (custoTotal / totalColhidoKg).toFixed(2) : 0,
        }
      })
      setSafras(processed)
      // Auto-seleciona as duas últimas
      const sorted = [...processed].sort((a, b) => b.ano - a.ano)
      if (sorted.length >= 2) {
        setSelectedIds([sorted[0].id, sorted[1].id])
      } else if (sorted.length > 0) {
        setSelectedIds([sorted[0].id])
      }
    }
    setLoading(false)
  }

  const toggleSafra = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    } else {
      setSelectedIds((prev) => [...prev, id])
    }
  }

  const chartData = safras.filter((s) => selectedIds.includes(s.id)).sort((a, b) => a.ano - b.ano)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" /> Tendências de Safra
          </h1>
          <p className="text-muted-foreground">
            Comparativo de performance e custos ao longo dos anos.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione as Safras para Comparar</CardTitle>
          <CardDescription>Escolha pelo menos duas para visualizar a tendência</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex flex-wrap gap-6">
              {safras.map((s) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={s.id}
                    checked={selectedIds.includes(s.id)}
                    onCheckedChange={() => toggleSafra(s.id)}
                  />
                  <Label htmlFor={s.id} className="cursor-pointer">
                    {s.nome} <span className="text-xs text-muted-foreground">({s.status})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtividade Comparada</CardTitle>
              <CardDescription>Média de kg colhidos por hectare</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="produtividade"
                    fill="var(--color-produtividade)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Custos Totais</CardTitle>
              <CardDescription>Custo acumulado por safra (R$)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="custoTotal"
                    stroke="var(--color-custoTotal)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
