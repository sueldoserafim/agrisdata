import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building, Edit, Trash2, Search, Building2 } from 'lucide-react'
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
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
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Empresas (Tenants)</h1>
            <p className="text-blue-100 text-sm md:text-base mt-1">
              Gerencie os clientes, planos e status das empresas
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-white text-blue-700 hover:bg-blue-50 w-full md:w-auto shadow-sm"
        >
          <Link to="/admin/empresas/new">
            <Plus className="mr-2 h-5 w-5" /> Nova Empresa
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="suspensa">Suspensa / Inativa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planoFilter} onValueChange={setPlanoFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card border rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">CNPJ</TableHead>
              <TableHead className="font-semibold">Plano</TableHead>
              <TableHead className="font-semibold">Criada em</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpresas.map((emp) => (
              <TableRow
                key={emp.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Building className="h-4 w-4" />
                    </div>
                    <Link
                      to={`/admin/empresas/${emp.id}`}
                      className="hover:text-primary transition-colors font-semibold"
                    >
                      {emp.nome}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{emp.cnpj || '—'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                    {emp.planos?.nome || 'Nenhum'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(emp.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={emp.ativo ? 'default' : 'secondary'}
                    className={emp.ativo ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {emp.ativo ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                      asChild
                    >
                      <Link to={`/admin/empresas/${emp.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmpresas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Building className="h-8 w-8 opacity-20" />
                    <p>Nenhuma empresa encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredEmpresas.map((emp) => (
          <Card key={emp.id} className="overflow-hidden">
            <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-bold leading-tight">
                  <Link
                    to={`/admin/empresas/${emp.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {emp.nome}
                  </Link>
                </CardTitle>
                <Badge
                  variant={emp.ativo ? 'default' : 'secondary'}
                  className={
                    emp.ativo ? 'bg-emerald-500 hover:bg-emerald-600 shrink-0' : 'shrink-0'
                  }
                >
                  {emp.ativo ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Building className="h-3 w-3" /> {emp.cnpj || 'Sem CNPJ'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-3">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Plano</p>
                  <p className="font-medium">{emp.planos?.nome || 'Nenhum'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Criação</p>
                  <p className="font-medium">{new Date(emp.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 border-t bg-slate-50/30 dark:bg-slate-900/10 pt-3 pb-3">
              <Button variant="outline" className="flex-1 bg-white dark:bg-transparent" asChild>
                <Link to={`/admin/empresas/${emp.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Link>
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(emp.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredEmpresas.length === 0 && (
          <div className="text-center py-12 px-4 border rounded-xl border-dashed">
            <Building className="h-10 w-10 opacity-20 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma empresa encontrada.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tente ajustar os filtros ou termo de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
