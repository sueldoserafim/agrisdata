import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function AdminConfiguracoes() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Configurações Globais</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preferências do Sistema</CardTitle>
          <CardDescription>Ajustes globais aplicados a toda a plataforma SaaS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Manutenção Programada</Label>
              <p className="text-sm text-muted-foreground">
                Bloqueia o acesso de todos os usuários (exceto admin).
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Ativar envio de faturas e alertas de suporte.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  )
}
