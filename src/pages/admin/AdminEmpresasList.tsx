import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building, Edit, Trash2, Search } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getEmpresas, deleteEmpresa } from '@/services/admin/empresas'
import { useToast } from '@/hooks/use-toast'

export default function AdminEmpresasList() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planoFilter, setPlanoFilter] = useState('all')
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

  const filteredEmpresas = empresas.filter((emp) => {
    const matchSearch =
      emp.nome.toLowerCase().includes(search.toLowerCase()) || (emp.cnpj || '').includes(search)
    let matchStatus = true
    if (statusFilter === 'ativa') matchStatus = emp.ativo === true
    if (statusFilter === 'suspensa') matchStatus = emp.ativo === false

    const pName = emp.planos?.nome?.toLowerCase() || 'nenhum'
    const matchPlano = planoFilter === 'all' ? true : pName === planoFilter.toLowerCase()

    return matchSearch && matchStatus && matchPlano
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Empresas (Tenants)</h1>
        <Button asChild>
          <Link to="/admin/empresas/new">
            <Plus className="mr-2 h-4 w-4" /> Nova Empresa
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="suspensa">Suspensa / Inativa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planoFilter} onValueChange={setPlanoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Planos</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="enterprise plus">Enterprise Plus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpresas.map((emp) => (
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
                <TableCell>{new Date(emp.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={emp.ativo ? 'default' : 'secondary'}>
                    {emp.ativo ? 'Ativa' : 'Inativa'}
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
            {filteredEmpresas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
