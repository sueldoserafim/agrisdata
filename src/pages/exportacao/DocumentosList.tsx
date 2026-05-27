import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, FileText, Download, AlertCircle } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { exportacaoService } from '@/services/exportacao'

export default function DocumentosList() {
  const [documentos, setDocumentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await exportacaoService.getDocumentos(empresa.id)
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setDocumentos(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este documento?')) return
    const { error } = await exportacaoService.deleteDocumento(id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Documento excluído com sucesso.' })
      loadData()
    }
  }

  const expiringDocs = documentos.filter((d) => {
    if (!d.data_validade) return false
    const days = (new Date(d.data_validade).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    return days <= 15 && days >= 0
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Documentos de Exportação
          </h1>
          <p className="text-slate-500 mt-1">Gerencie a documentação de compliance e embarque</p>
        </div>
        <Link to="/app/exportacao/documentos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Documento
          </Button>
        </Link>
      </div>

      {expiringDocs.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção - Documentos Próximos do Vencimento</AlertTitle>
          <AlertDescription>
            Existem {expiringDocs.length} documento(s) vencendo nos próximos 15 dias.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número/Tipo</TableHead>
                  <TableHead>Container</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  documentos.map((d) => {
                    const isExpiring =
                      d.data_validade &&
                      (new Date(d.data_validade).getTime() - new Date().getTime()) /
                        (1000 * 3600 * 24) <=
                        15 &&
                      d.status !== 'vencido'

                    return (
                      <TableRow key={d.id} className={isExpiring ? 'bg-orange-50/50' : ''}>
                        <TableCell>
                          <div className="font-medium">{d.numero_documento || 'S/N'}</div>
                          <div className="text-xs text-slate-500 uppercase">{d.tipo_documento}</div>
                        </TableCell>
                        <TableCell>{d.containers?.numero_container || '-'}</TableCell>
                        <TableCell>
                          {d.data_emissao ? new Date(d.data_emissao).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className={isExpiring ? 'text-red-600 font-semibold' : ''}>
                          {d.data_validade ? new Date(d.data_validade).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              d.status === 'valido'
                                ? 'default'
                                : d.status === 'vencido'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {d.arquivo_url && (
                            <Button variant="ghost" size="sm" asChild title="Baixar">
                              <a href={d.arquivo_url} target="_blank" rel="noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Link to={`/app/exportacao/documentos/${d.id}`}>
                            <Button variant="ghost" size="sm" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(d.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
