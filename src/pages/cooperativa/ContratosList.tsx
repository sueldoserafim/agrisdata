import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEmpresa } from '@/hooks/use-empresa'
import { cooperativaService } from '@/services/cooperativa'
import { toast } from 'sonner'

export default function ContratosList() {
  const { empresa } = useEmpresa()
  const [contratos, setContratos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  async function loadData() {
    try {
      setLoading(true)
      const data = await cooperativaService.getContratos(empresa!.id)
      setContratos(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar contratos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover este contrato?')) return
    try {
      await cooperativaService.deleteContrato(id)
      toast.success('Contrato removido com sucesso')
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos de Cooperação</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as participações dos cooperados por safra e talhão.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/cooperativa/contratos/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Contrato
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cooperado</TableHead>
              <TableHead>Safra</TableHead>
              <TableHead>Talhão</TableHead>
              <TableHead>Participação (%)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : contratos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum contrato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              contratos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {c.fornecedores?.nome}
                  </TableCell>
                  <TableCell>{c.safras?.nome_safra || c.safras?.codigo_safra}</TableCell>
                  <TableCell>{c.talhoes?.nome || 'Todos (Geral)'}</TableCell>
                  <TableCell className="font-semibold">
                    {Number(c.percentual_participacao).toFixed(4)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/app/cooperativa/contratos/${c.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
