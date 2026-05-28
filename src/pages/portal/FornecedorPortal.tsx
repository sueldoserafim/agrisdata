import { useParams } from 'react-router-dom'
import { usePortalData } from '@/hooks/use-portal-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { Loader2, AlertCircle, ShoppingCart, DollarSign } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FornecedorPortal() {
  const { token } = useParams<{ token: string }>()
  const { data, info, loading, error } = usePortalData(token || '')

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-slate-500">Carregando dados do portal...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>{error || 'Não foi possível carregar as informações.'}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Olá, {info.nome_entidade}
        </h2>
        <p className="text-slate-500">Portal do Fornecedor - {info.empresa_nome}</p>
      </div>

      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pedidos" disabled={!info.acessos_permitidos.includes('pedidos')}>
            Pedidos de Compra
          </TabsTrigger>
          <TabsTrigger
            value="pagamentos"
            disabled={!info.acessos_permitidos.includes('pagamentos')}
          >
            Pagamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Meus Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.pedidos?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.pedidos.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.data_pedido
                              ? format(new Date(item.data_pedido), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>{item.produto_nome}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.total_pedido || 0)}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Nenhum pedido encontrado.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Previsão de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.pagamentos?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.pagamentos.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.data_vencimento
                              ? format(new Date(item.data_vencimento), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                item.status === 'pago'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.valor || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Nenhum pagamento pendente ou histórico recente.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
