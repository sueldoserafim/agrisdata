import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getEmpresas, deleteEmpresa } from '@/services/admin/empresas'
import { useToast } from '@/hooks/use-toast'

export default function AdminEmpresasList() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const { toast } = useToast()

  const loadData = async () => {
    const data = await getEmpresas()
    setEmpresas(data || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta empresa?')) {
      await deleteEmpresa(id)
      toast({ title: 'Empresa excluída' })
      loadData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Empresas (Tenants)</h1>
        <Button asChild>
          <Link to="/admin/empresas/new">
            <Plus className="mr-2 h-4 w-4" /> Nova Empresa
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Link to={`/admin/empresas/${emp.id}`} className="hover:underline">
                      {emp.nome}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{emp.cnpj || '—'}</TableCell>
                <TableCell>{emp.planos?.nome || 'Nenhum'}</TableCell>
                <TableCell>
                  <Badge variant={emp.ativo ? 'default' : 'secondary'}>
                    {emp.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/empresas/${emp.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(emp.id)}
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
