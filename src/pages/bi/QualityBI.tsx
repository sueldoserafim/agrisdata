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

export default function QualityBI() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    async function load() {
      const { data: amostras } = await supabase
        .from('amostras_qualidade_campo')
        .select('data_coleta, brix_medio, firmeza_media')
        .eq('empresa_id', empresa.id)
        .order('data_coleta', { ascending: true })

      if (amostras) {
        const valid = amostras.filter((a) => a.data_coleta && a.brix_medio)
        setData(
          valid.map((a) => ({
            date: a.data_coleta,
            brix: a.brix_medio,
            firmeza: a.firmeza_media || 0,
          })),
        )
      }
    }
    load()
  }, [empresa?.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Evolution (Brix & Firmness Trends)</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer
          config={{
            brix: { color: '#f59e0b', label: 'Brix' },
            firmeza: { color: '#8b5cf6', label: 'Firmness' },
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="brix" stroke="var(--color-brix)" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="firmeza"
                stroke="var(--color-firmeza)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
