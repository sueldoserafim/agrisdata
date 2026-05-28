import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function FinanceBI() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    async function load() {
      const { data: lancamentos } = await supabase
        .from('financeiro_lancamentos')
        .select('valor, tipo, data_vencimento')
        .eq('empresa_id', empresa.id)
        .order('data_vencimento', { ascending: true })

      if (lancamentos) {
        const byMonth: Record<string, any> = {}
        lancamentos.forEach((l) => {
          if (!l.data_vencimento) return
          const month = l.data_vencimento.substring(0, 7)
          if (!byMonth[month]) byMonth[month] = { name: month, revenue: 0, expense: 0 }

          if (l.tipo === 'receita') {
            byMonth[month].revenue += Number(l.valor)
          } else {
            byMonth[month].expense += Number(l.valor)
          }
        })
        setData(Object.values(byMonth).sort((a: any, b: any) => a.name.localeCompare(b.name)))
      }
    }
    load()
  }, [empresa?.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expense Evolution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer
          config={{
            revenue: { color: '#10b981', label: 'Revenue' },
            expense: { color: '#ef4444', label: 'Expense' },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-expense)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
