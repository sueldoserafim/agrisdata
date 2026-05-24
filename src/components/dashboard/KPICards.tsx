import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const generateSparklineData = (trend: 'up' | 'down') => {
  return Array.from({ length: 7 }).map((_, i) => ({
    value: trend === 'up' ? 20 + i * 5 + Math.random() * 10 : 50 - i * 5 + Math.random() * 10,
  }))
}

const kpiData = [
  {
    title: 'Patients',
    value: '6025',
    trend: '+68.95%',
    isPositive: true,
    subtitle: 'Since last week',
    data: generateSparklineData('up'),
  },
  {
    title: 'New This Week',
    value: '4152',
    trend: '-4.11%',
    isPositive: false,
    subtitle: 'Since last week',
    data: generateSparklineData('down'),
  },
  {
    title: 'Critical Alerts',
    value: '5948',
    trend: '-92.05%',
    isPositive: false,
    subtitle: 'Since last week',
    data: generateSparklineData('down'),
  },
  {
    title: 'Appointments',
    value: '5626',
    trend: '-27.47%',
    isPositive: false,
    subtitle: 'Since last week',
    data: generateSparklineData('down'),
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card
          key={index}
          className="shadow-subtle hover:shadow-card transition-shadow duration-300 rounded-2xl border-none"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <h3 className="text-3xl font-bold mt-2 text-foreground tracking-tight">
                  {kpi.value}
                </h3>
              </div>
              <div className="h-10 w-20">
                <ChartContainer
                  config={{
                    value: {
                      color: kpi.isPositive ? 'hsl(var(--primary))' : 'hsl(var(--warning))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={kpi.isPositive ? 'hsl(var(--primary))' : 'hsl(var(--warning))'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{kpi.subtitle}</span>
              <span
                className={cn(
                  'flex items-center font-medium ml-auto',
                  kpi.isPositive ? 'text-primary' : 'text-warning',
                )}
              >
                {kpi.trend}
                {kpi.isPositive ? (
                  <ArrowUpRight className="size-4 ml-1" />
                ) : (
                  <ArrowDownRight className="size-4 ml-1" />
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
