import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building2, Phone, Mail, FileText, Trash2, Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { useToast } from '@/hooks/use-toast'

export default function FornecedorList() {
  const { empresa } = useEmpresa()
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (empresa?.id) {
      loadData()
    }
  }, [empresa?.id])

  async function loadData() {
    try {
      setLoading(true)
      const data = await comprasService.getFornecedores(empresa!.id)
      setFornecedores(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover este fornecedor?')) return
    try {
      await comprasService.deleteFornecedor(id)
      toast({ title: 'Fornecedor removido com sucesso' })
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os fornecedores e parceiros da empresa.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/compras/fornecedores/new">
            <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : fornecedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum fornecedor cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {fornecedor.nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {fornecedor.cnpj || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {fornecedor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {fornecedor.email}
                        </div>
                      )}
                      {fornecedor.telefone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {fornecedor.telefone}
                        </div>
                      )}
                      {!fornecedor.email && !fornecedor.telefone && '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/app/compras/fornecedores/${fornecedor.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(fornecedor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
  )
}
