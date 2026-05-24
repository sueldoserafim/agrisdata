import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

export function DashboardCharts({ charts }: { charts: any }) {
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-subtle border-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Produtividade Histórica (kg/ha)</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px]">
            {charts?.productivity?.length > 0 ? (
              <ChartContainer config={{ value: { color: 'hsl(var(--primary))' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.productivity}>
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sem dados suficientes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Custos</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px]">
            {charts?.cost?.length > 0 ? (
              <ChartContainer config={{ value: { color: 'hsl(var(--primary))' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.cost}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {charts.cost.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sem dados suficientes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
