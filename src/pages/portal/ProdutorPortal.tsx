import { useParams } from 'react-router-dom'
import { usePortalData } from '@/hooks/use-portal-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Loader2, AlertCircle, FileText, TrendingUp, Truck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProdutorPortal() {
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Olá, {info.nome_entidade}</h2>
        <p className="text-slate-500">Portal do Produtor - {info.empresa_nome}</p>
      </div>

      <Tabs defaultValue="extrato" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="extrato" disabled={!info.acessos_permitidos.includes('extrato')}>Extrato</TabsTrigger>
          <TabsTrigger value="entregas" disabled={!info.acessos_permitidos.includes('entregas')}>Entregas</TabsTrigger>
          <TabsTrigger value="pagamentos" disabled={!info.acessos_permitidos.includes('pagamentos')}>Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="extrato" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Conta Corrente
              </CardTitle>
              <CardDescription>Acompanhe os movimentos financeiros da sua produção.</CardDescription>
            </CardHeader>
            <CardContent>
              {data.conta_corrente?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.conta_corrente.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.data_movimento ? format(new Date(item.data_movimento), 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell>
                            <span className="capitalize">{item.tipo_movimento}</span>
                          </TableCell>
                          <TableCell className={`text-right ${item.valor < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor || 0)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.saldo || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Nenhum movimento encontrado.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Histórico de Entregas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.entregas?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data Recepção</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Peso Bruto</TableHead>
                        <TableHead className="text-right">Peso Líquido</TableHead>
                        <TableHead className="text-right">Caixas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.entregas.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.data_recepcao ? format(new Date(item.data_recepcao), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium capitalize">
                              {item.status?.replace('_', ' ') || 'Pendente'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{item.peso_bruto_kg ? `${item.peso_bruto_kg} kg` : '-'}</TableCell>
                          <TableCell className="text-right">{item.peso_liquido_kg ? `${item.peso_liquido_kg} kg` : '-'}</TableCell>
                          <TableCell className="text-right">{item.quantidade_caixas || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Nenhuma entrega registrada.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Pagamentos e Adiantamentos
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
                          <TableCell>{item.data_vencimento ? format(new Date(item.data_vencimento), 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              item.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Nenhum pagamento encontrado.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
