import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Neurology', value: 120, color: 'hsl(var(--primary))' },
  { name: 'Oncology', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Urology', value: 24, color: 'hsl(var(--warning))' },
]

export function DiagnosisChart() {
  return (
    <Card className="shadow-subtle border-none rounded-2xl flex flex-col">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-lg font-semibold">Avg Diagnose</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col items-center justify-center">
        <div className="h-[200px] w-full relative">
          <ChartContainer config={{}} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
            <span className="text-sm text-muted-foreground font-medium">Total Patients</span>
            <span className="text-4xl font-bold tracking-tight text-foreground">640</span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4 flex-wrap w-full">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold">{item.value}</span>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
