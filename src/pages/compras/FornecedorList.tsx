import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Map as MapIcon, List as ListIcon, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function FornecedorList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (empresa?.id) {
      loadFornecedores()
    }
  }, [empresa?.id])

  const loadFornecedores = async () => {
    try {
      setLoading(true)
      const data = await comprasService.getFornecedores(empresa!.id)
      setFornecedores(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar fornecedores',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await comprasService.deleteFornecedor(deleteId)
      toast({ title: 'Fornecedor excluído com sucesso' })
      loadFornecedores()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = fornecedores.filter(
    (f) =>
      f.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cnpj?.includes(searchTerm) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os fornecedores de insumos, serviços e parceiros
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Link to="/app/compras/fornecedores/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm">
        <Tabs defaultValue="lista" className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2 sm:w-[200px]">
            <TabsTrigger value="lista" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" /> Lista
            </TabsTrigger>
            <TabsTrigger value="mapa" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" /> Mapa
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ ou email..."
            className="pl-9 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50/80">
          <h2 className="font-semibold text-lg text-slate-800">Todos os Fornecedores</h2>
          <p className="text-sm text-muted-foreground">
            Listagem detalhada dos parceiros comerciais
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold">Nome / Razão Social</TableHead>
                <TableHead className="font-semibold">CNPJ / CPF</TableHead>
                <TableHead className="font-semibold">Contato</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[100px] text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-[250px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[140px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-[70px] ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p>Nenhum fornecedor encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((f) => (
                  <TableRow key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-medium text-slate-900">{f.nome}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">
                      {f.cnpj || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-slate-900">{f.email || '-'}</div>
                        <div className="text-slate-500 mt-0.5">{f.telefone || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          f.is_cooperado
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-none'
                        }
                      >
                        {f.is_cooperado ? 'Cooperado' : 'Padrão'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          asChild
                        >
                          <Link to={`/app/compras/fornecedores/${f.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(f.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fornecedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O fornecedor será removido permanentemente do sistema
              e poderá afetar histórico de compras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
