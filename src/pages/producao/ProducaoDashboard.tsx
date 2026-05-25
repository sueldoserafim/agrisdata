import { useEffect, useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ProducaoDashboard() {
  const { empresa } = useEmpresa()
  const [safras, setSafras] = useState<any[]>([])
  const [alertas, setAlertas] = useState<any[]>([])

  useEffect(() => {
    if (empresa?.id) {
      loadData()
      loadAlertas()
    }
  }, [empresa?.id])

  const loadData = async () => {
    // Invoke fenology alerts generation
    await supabase.rpc('gerar_alertas_fenologia' as any, { p_empresa_id: empresa?.id } as any)

    const { data } = await supabase
      .from('safras')
      .select(`
        id, nome_safra, orcamento_total, produtividade_planejada, area_planejada_ha, status,
        custos_talhao ( valor ),
        colheita_registros ( quantidade_colhida_kg )
      `)
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)

    setSafras(data || [])
  }

  const loadAlertas = async () => {
    const { data } = await supabase
      .from('alertas')
      .select('*')
      .eq('empresa_id', empresa?.id)
      .eq('lido', false)
      .in('tipo', ['estoque_critico', 'manejo_fenologia'])
      .order('created_at', { ascending: false })
      .limit(15)
    setAlertas(data || [])
  }

  const chartDataCosts = safras.map((s) => {
    const realCost =
      s.custos_talhao?.reduce((acc: number, curr: any) => acc + (Number(curr.valor) || 0), 0) || 0
    return {
      name: s.nome_safra || 'Sem Nome',
      Planejado: s.orcamento_total || 0,
      Real: realCost,
      custoPorHa: s.area_planejada_ha ? realCost / s.area_planejada_ha : 0,
    }
  })

  const chartDataProd = safras.map((s) => {
    const colhido =
      s.colheita_registros?.reduce(
        (acc: number, curr: any) => acc + (Number(curr.quantidade_colhida_kg) || 0),
        0,
      ) || 0
    const realProd = s.area_planejada_ha ? colhido / s.area_planejada_ha : 0
    return {
      name: s.nome_safra || 'Sem Nome',
      Planejada: s.produtividade_planejada || 0,
      Real: realProd,
    }
  })

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Produção</h1>
        <p className="text-muted-foreground">
          Visão analítica de custos, produtividade e alertas de manejo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-subtle border-none">
          <CardHeader>
            <CardTitle>Custo Planejado vs Custo Realizado</CardTitle>
            <CardDescription>Comparativo financeiro das safras (Total)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ChartContainer
                config={{
                  Planejado: { color: 'hsl(var(--primary))' },
                  Real: { color: 'hsl(var(--destructive))' },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataCosts}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <ChartTooltip
                      cursor={{ fill: 'transparent' }}
                      content={<ChartTooltipContent />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="Planejado" fill="var(--color-Planejado)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Real" fill="var(--color-Real)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col shadow-subtle border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Alertas Críticos
            </CardTitle>
            <CardDescription>Manejo e Estoque</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[350px] px-6 pb-6">
              <div className="space-y-4">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="p-4 bg-muted/30 border rounded-xl border-l-4 border-l-amber-500"
                  >
                    <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{alerta.descricao}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {alerta.tipo === 'estoque_critico' ? 'Estoque' : 'Manejo'}
                    </Badge>
                  </div>
                ))}
                {alertas.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhum alerta pendente.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle border-none">
          <CardHeader>
            <CardTitle>Produtividade (kg/ha)</CardTitle>
            <CardDescription>Planejada vs Realizada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  Planejada: { color: 'hsl(var(--primary)/0.6)' },
                  Real: { color: 'hsl(var(--primary))' },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataProd}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip
                      cursor={{ fill: 'transparent' }}
                      content={<ChartTooltipContent />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="Planejada" fill="var(--color-Planejada)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Real" fill="var(--color-Real)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader>
            <CardTitle>Custo de Produção por Hectare</CardTitle>
            <CardDescription>Indicadores por safra atualizados em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Safra</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custo Real Total</TableHead>
                  <TableHead className="text-right">Custo / Ha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartDataCosts.map((data, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{data.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{safras[idx].status}</Badge>
                    </TableCell>
                    <TableCell>
                      R${' '}
                      {data.Real.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      R${' '}
                      {data.custoPorHa.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {chartDataCosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Sem dados disponíveis.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
