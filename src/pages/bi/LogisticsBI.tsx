import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function LogisticsBI() {
  const { empresa } = useEmpresa()
  const [metrics, setMetrics] = useState<any>({ margin: [], transit: [] })

  useEffect(() => {
    if (!empresa?.id) return
    async function load() {
      const { data: containers } = await supabase
        .from('containers')
        .select(`
          id, numero_container, data_embarque,
          bookings ( data_eta, data_etd ),
          account_sales ( valor_liquido, despesas_internacionais )
        `)
        .eq('empresa_id', empresa.id)

      if (containers) {
        const margins = containers
          .map((c: any) => {
            const sal = Array.isArray(c.account_sales) ? c.account_sales[0] : c.account_sales
            return {
              name: c.numero_container,
              margin: sal ? (sal.valor_liquido || 0) - (sal.despesas_internacionais || 0) : 0,
            }
          })
          .filter((m: any) => m.margin > 0)
          .slice(0, 10)

        const transit = containers
          .map((c: any) => {
            const b = Array.isArray(c.bookings) ? c.bookings[0] : c.bookings
            if (!b?.data_eta || !b?.data_etd) return null
            const eta = new Date(b.data_eta).getTime()
            const etd = new Date(b.data_etd).getTime()
            const diff = (eta - etd) / (1000 * 3600 * 24)
            return {
              name: c.numero_container,
              days: Math.round(diff),
            }
          })
          .filter(Boolean)
          .slice(0, 10)

        setMetrics({ margin: margins, transit })
      }
    }
    load()
  }, [empresa?.id])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit Margin / Container (Top 10)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ margin: { color: '#10b981', label: 'Margin' } }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.margin}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="margin" fill="var(--color-margin)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Est. Transit Time (Days) ETA vs ETD</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ days: { color: '#3b82f6', label: 'Days' } }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.transit}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
