import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function ProductionBI() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    async function load() {
      const { data: safras } = await supabase
        .from('safras')
        .select(`
          id, ano_safra, nome_safra, area_planejada_ha,
          colheita_registros ( producao_liquida_ton ),
          custos_talhao ( valor )
        `)
        .eq('empresa_id', empresa.id)

      if (safras) {
        const aggregated = safras
          .map((s: any) => {
            const totalTon =
              s.colheita_registros?.reduce(
                (acc: number, c: any) => acc + (c.producao_liquida_ton || 0),
                0,
              ) || 0
            const totalKg = totalTon * 1000
            const area = s.area_planejada_ha || 1
            const prod = totalKg / area
            const cost =
              s.custos_talhao?.reduce((acc: number, c: any) => acc + (c.valor || 0), 0) || 0
            return {
              name: s.nome_safra || String(s.ano_safra),
              ano: s.ano_safra || 0,
              produtividade: Math.round(prod),
              custoPorKg: totalKg > 0 ? Number((cost / totalKg).toFixed(2)) : 0,
            }
          })
          .sort((a, b) => a.ano - b.ano)
        setData(aggregated)
      }
    }
    load()
  }, [empresa?.id])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Productivity (kg/ha) YOY</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ produtividade: { color: 'hsl(var(--primary))', label: 'kg/ha' } }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="produtividade"
                  fill="var(--color-produtividade)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost per kg (R$)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ custoPorKg: { color: 'hsl(var(--destructive))', label: 'R$/kg' } }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="custoPorKg" fill="var(--color-custoPorKg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
