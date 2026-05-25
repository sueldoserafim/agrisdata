import { Card, CardContent } from '@/components/ui/card'

interface KPIRowProps {
  title: string
  items: { label: string; value: string | number | undefined }[]
}

export function KPIRow({ title, items }: KPIRowProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <Card
            key={i}
            className="shadow-subtle hover:shadow-md transition-shadow duration-300 rounded-xl border-none"
          >
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <h4 className="text-2xl font-bold mt-2 text-foreground">{item.value ?? 0}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
