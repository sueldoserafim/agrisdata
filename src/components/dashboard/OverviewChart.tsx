import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

const monthlyData = [
  { month: 'Jan', value: 25000 },
  { month: 'Feb', value: 30000 },
  { month: 'Mar', value: 28000 },
  { month: 'Apr', value: 35000 },
  { month: 'May', value: 32000 },
  { month: 'Jun', value: 40000 },
  { month: 'Jul', value: 47500 },
  { month: 'Aug', value: 38000 },
  { month: 'Sep', value: 34000 },
  { month: 'Oct', value: 42000 },
  { month: 'Nov', value: 39000 },
  { month: 'Dec', value: 45000 },
]

export function OverviewChart() {
  const [period, setPeriod] = useState('1y')
  const activeIndex = 6 // July

  return (
    <Card className="shadow-subtle border-none rounded-2xl col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
        <div>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Avg per month</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-3xl font-bold tracking-tight">$138,500</span>
              <span className="flex items-center text-sm font-medium text-primary mb-1">
                13.4% <ArrowUpRight className="size-4 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={(v) => v && setPeriod(v)}
            className="bg-muted rounded-full p-1 h-9"
          >
            <ToggleGroupItem
              value="1y"
              className="rounded-full px-4 text-xs h-7 data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              1 Year
            </ToggleGroupItem>
            <ToggleGroupItem
              value="6m"
              className="rounded-full px-4 text-xs h-7 data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              6 Months
            </ToggleGroupItem>
            <ToggleGroupItem
              value="3m"
              className="rounded-full px-4 text-xs h-7 data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              3 Months
            </ToggleGroupItem>
            <ToggleGroupItem
              value="1m"
              className="rounded-full px-4 text-xs h-7 data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              1 Month
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-primary" /> Consultation
            </span>
            <span className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-muted-foreground/30" /> Medical Checkup
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="h-[250px] w-full mt-4">
          <ChartContainer config={{ value: { color: 'hsl(var(--primary))' } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={
                    <ChartTooltipContent formatter={(val) => `${Number(val).toLocaleString()}`} />
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === activeIndex
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--muted-foreground)/0.1)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
