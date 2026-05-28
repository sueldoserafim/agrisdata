import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function AdminConfiguracoes() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold">Configurações Globais</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preferências do Sistema</CardTitle>
          <CardDescription>Ajustes globais aplicados a toda a plataforma SaaS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <div className="flex items-center justify-between border p-4 rounded-xl shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
              <div className="space-y-0.5">
                <Label className="text-base">Manutenção Programada</Label>
                <p className="text-sm text-muted-foreground">
                  Bloqueia o acesso de todos os usuários (exceto admin).
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between border p-4 rounded-xl shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar envio de faturas e alertas de suporte.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button className="w-full md:w-auto">Salvar Configurações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
