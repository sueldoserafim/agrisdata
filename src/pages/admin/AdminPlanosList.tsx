import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, CheckCircle2, Users, Layers, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getPlanos, deletePlano } from '@/services/admin/planos'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const MODULE_LABELS: Record<string, string> = {
  producao: 'Produção',
  estoque: 'Estoque',
  financeiro: 'Financeiro',
  qualidade: 'Qualidade',
  rh: 'Recursos Humanos',
  caderno_campo: 'Caderno de Campo',
}

export default function AdminPlanosList() {
  const [planos, setPlanos] = useState<any[]>([])
  const { toast } = useToast()

  const loadData = async () => setPlanos((await getPlanos()) || [])
  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este plano?')) {
      try {
        await deletePlano(id)
        toast({ title: 'Plano excluído' })
        loadData()
      } catch (error: any) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos SaaS</h1>
          <p className="text-muted-foreground">Gerencie os planos de assinatura disponíveis.</p>
        </div>
        <Button asChild>
          <Link to="/admin/planos/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Plano
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card
            key={plano.id}
            className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-bold">{plano.nome}</CardTitle>
                <Badge variant={plano.ativo ? 'default' : 'secondary'} className="shrink-0">
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <CardDescription className="h-10 line-clamp-2 mt-2">
                {plano.descricao || 'Sem descrição'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    plano.preco_mensal,
                  )}
                </span>
                <span className="text-sm text-muted-foreground font-medium">/mês</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm font-medium text-foreground">
                  <Users className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>
                    {plano.limite_usuarios === 999
                      ? 'Usuários Ilimitados'
                      : `Até ${plano.limite_usuarios} usuários`}
                  </span>
                </div>

                <div className="flex items-start text-sm pt-2 border-t">
                  <Layers className="h-4 w-4 mr-3 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <span className="font-medium text-foreground">Módulos incluídos</span>
                    {plano.modulos_habilitados && plano.modulos_habilitados.length > 0 ? (
                      <ul className="space-y-2 text-muted-foreground">
                        {plano.modulos_habilitados.map((mod: string) => (
                          <li key={mod} className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-primary shrink-0" />
                            <span>{MODULE_LABELS[mod] || mod}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        Nenhum módulo selecionado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t gap-3 mt-auto bg-muted/20">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/admin/planos/${plano.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                size="icon"
                onClick={() => handleDelete(plano.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {planos.length === 0 && (
          <div className="col-span-full py-16 px-6 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed flex flex-col items-center justify-center">
            <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-1">Nenhum plano encontrado</h3>
            <p className="text-sm">Cadastre um novo plano para disponibilizá-lo aos clientes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
