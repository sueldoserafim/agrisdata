import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, FileText, Plus, Box, Tractor } from 'lucide-react'

export function AlertsShortcuts({
  osPendentes,
  cutoffsProximos,
}: {
  osPendentes: number
  cutoffsProximos: number
}) {
  const alerts = []
  if (osPendentes > 0)
    alerts.push({
      title: `${osPendentes} OS(s) Pendente(s)`,
      desc: 'Há ordens de serviço atrasadas ou não iniciadas.',
      action: 'Ver OS',
    })
  if (cutoffsProximos > 0)
    alerts.push({
      title: 'Cut-offs Próximos',
      desc: `Você tem ${cutoffsProximos} container(s) com cut-off para os próximos 7 dias.`,
      action: 'Ver Embarques',
    })
  if (alerts.length === 0)
    alerts.push({ title: 'Tudo em dia', desc: 'Nenhum alerta crítico no momento.', action: null })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-subtle border-none rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5 text-destructive" /> Alertas Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-4 rounded-lg border ${a.action ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}`}
            >
              <div>
                <p className={`font-semibold ${a.action ? 'text-red-900' : 'text-green-900'}`}>
                  {a.title}
                </p>
                <p className={`text-sm ${a.action ? 'text-red-700' : 'text-green-700'}`}>
                  {a.desc}
                </p>
              </div>
              {a.action && (
                <Button variant="outline" size="sm" className="bg-white">
                  {a.action}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/5 hover:border-primary border-border"
          >
            <Tractor className="size-5" /> + Nova Safra
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/5 hover:border-primary border-border"
          >
            <FileText className="size-5" /> + Ordem de Serviço
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/5 hover:border-primary border-border"
          >
            <Plus className="size-5" /> + Entrada NF
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/5 hover:border-primary border-border"
          >
            <Box className="size-5" /> + Pallet
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
