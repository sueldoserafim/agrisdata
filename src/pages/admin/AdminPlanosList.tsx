import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPlanos, deletePlano } from '@/services/admin/planos'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

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
        <h1 className="text-2xl font-bold">Planos SaaS</h1>
        <Button asChild>
          <Link to="/admin/planos/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Plano
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço Mensal</TableHead>
              <TableHead>Limite Usuários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planos.map((plano) => (
              <TableRow key={plano.id}>
                <TableCell className="font-medium">{plano.nome}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={plano.descricao || ''}>
                  {plano.descricao || '-'}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    plano.preco_mensal,
                  )}
                </TableCell>
                <TableCell>{plano.limite_usuarios}</TableCell>
                <TableCell>
                  <Badge variant={plano.ativo ? 'default' : 'secondary'}>
                    {plano.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/planos/${plano.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(plano.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
