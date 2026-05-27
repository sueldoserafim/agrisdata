import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { exportacaoService } from '@/services/exportacao'

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await exportacaoService.getInvoices(empresa.id)
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setInvoices(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta invoice?')) return
    const { error } = await exportacaoService.deleteInvoice(id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Invoice excluída com sucesso.' })
      loadData()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Invoices de Exportação
          </h1>
          <p className="text-slate-500 mt-1">Gerencie a documentação comercial e exportação</p>
        </div>
        <Link to="/app/exportacao/invoices/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices Emitidas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Invoice</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Container</TableHead>
                  <TableHead>Valor USD</TableHead>
                  <TableHead>Incoterm</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                      Nenhuma invoice encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.numero_invoice}</TableCell>
                      <TableCell>{inv.clientes?.nome || 'N/A'}</TableCell>
                      <TableCell>{inv.containers?.numero_container || '-'}</TableCell>
                      <TableCell>${Number(inv.valor_total_usd).toLocaleString()}</TableCell>
                      <TableCell className="uppercase">{inv.incoterm || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{inv.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.pdf_url && (
                          <Button variant="ghost" size="sm" title="Baixar PDF">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Link to={`/app/exportacao/invoices/${inv.id}`}>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(inv.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
