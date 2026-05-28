import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Download,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Truck,
  FileText,
  Anchor,
} from 'lucide-react'

// --- PRODUTOR ---
export function PortalProdutor({ data, access }: { data: any; access: string[] }) {
  if (access.length === 0) return <NoAccess />

  return (
    <Tabs defaultValue={access[0]}>
      <TabsList className="mb-6 grid w-full grid-cols-3 max-w-2xl bg-white border">
        {access.includes('extrato') && <TabsTrigger value="extrato">Extrato C/C</TabsTrigger>}
        {access.includes('entregas') && <TabsTrigger value="entregas">Entregas</TabsTrigger>}
        {access.includes('financeiro') && <TabsTrigger value="financeiro">Financeiro</TabsTrigger>}
      </TabsList>

      {access.includes('extrato') && (
        <TabsContent value="extrato">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Extrato de Conta Corrente
              </CardTitle>
              <CardDescription>Acompanhe suas movimentações e saldos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor (R$)</TableHead>
                      <TableHead className="text-right">Saldo (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.conta_corrente?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhuma movimentação encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.conta_corrente?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.data_movimento
                              ? format(new Date(item.data_movimento), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.tipo_movimento}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.descricao || '-'}</TableCell>
                          <TableCell className="text-right text-slate-700">
                            {item.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {item.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('entregas') && (
        <TabsContent value="entregas">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Histórico de Entregas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Data Recepção</TableHead>
                      <TableHead>Safra</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Qtd. Caixas</TableHead>
                      <TableHead className="text-right">Peso Líquido (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.entregas?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhuma entrega encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.entregas?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.data_recepcao
                              ? format(new Date(item.data_recepcao), 'dd/MM/yyyy HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>{item.nome_safra || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {item.status?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantidade_caixas || '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.peso_liquido_kg?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('financeiro') && (
        <TabsContent value="financeiro">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Pagamentos e Adiantamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.financeiro?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum registro encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.financeiro?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.data ? format(new Date(item.data), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.descricao || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              className="capitalize"
                              variant={
                                item.status === 'pago' || item.status === 'reembolsado'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.valor?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

// --- CLIENTE ---
export function PortalCliente({ data, access }: { data: any; access: string[] }) {
  if (access.length === 0) return <NoAccess />

  return (
    <Tabs defaultValue={access[0]}>
      <TabsList className="mb-6 grid w-full grid-cols-3 max-w-2xl bg-white border">
        {access.includes('invoices') && (
          <TabsTrigger value="invoices">Invoices & Orders</TabsTrigger>
        )}
        {access.includes('documentos') && (
          <TabsTrigger value="documentos">Documentation</TabsTrigger>
        )}
        {access.includes('tracking') && (
          <TabsTrigger value="tracking">Container Tracking</TabsTrigger>
        )}
      </TabsList>

      {access.includes('invoices') && (
        <TabsContent value="invoices">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Incoterm</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total (USD)</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.invoices?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No invoices found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.invoices?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.numero_invoice}</TableCell>
                          <TableCell>
                            {item.data_emissao
                              ? format(new Date(item.data_emissao), 'MM/dd/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="uppercase">
                              {item.incoterm || '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            $
                            {item.valor_total_usd?.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.pdf_url ? (
                              <a
                                href={item.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-2 text-primary hover:bg-slate-100 rounded-md transition-colors"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('documentos') && (
        <TabsContent value="documentos">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Export Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Container</TableHead>
                      <TableHead>Doc Type</TableHead>
                      <TableHead>Doc Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.documentos?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.documentos?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.numero_container || '-'}
                          </TableCell>
                          <TableCell className="uppercase">
                            {item.tipo_documento?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{item.numero_documento || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.arquivo_url ? (
                              <a
                                href={item.arquivo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-2 text-primary hover:bg-slate-100 rounded-md transition-colors"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('tracking') && (
        <TabsContent value="tracking">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.tracking?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground bg-white rounded-lg border">
                No active containers found.
              </div>
            ) : (
              data?.tracking?.map((item: any) => (
                <Card key={item.id} className="border-0 shadow-md overflow-hidden">
                  <div className="h-2 w-full bg-primary" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.numero_container}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Anchor className="h-3.5 w-3.5" /> Booking: {item.numero_booking || 'N/A'}
                        </CardDescription>
                      </div>
                      <Badge
                        className="uppercase"
                        variant={item.status === 'concluido' ? 'default' : 'secondary'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-500 block mb-1">Departure (ETD)</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {item.data_etd ? format(new Date(item.data_etd), 'MM/dd/yyyy') : 'TBD'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Arrival (ETA)</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {item.data_eta ? format(new Date(item.data_eta), 'MM/dd/yyyy') : 'TBD'}
                        </span>
                      </div>
                      <div className="col-span-2 mt-2 pt-2 border-t border-slate-200">
                        <span className="text-slate-500 block mb-1">Destination</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.destino || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}

// --- FORNECEDOR ---
export function PortalFornecedor({ data, access }: { data: any; access: string[] }) {
  if (access.length === 0) return <NoAccess />

  return (
    <Tabs defaultValue={access[0]}>
      <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md bg-white border">
        {access.includes('pedidos') && <TabsTrigger value="pedidos">Pedidos de Compra</TabsTrigger>}
        {access.includes('pagamentos') && (
          <TabsTrigger value="pagamentos">Pagamentos Pendentes</TabsTrigger>
        )}
      </TabsList>

      {access.includes('pedidos') && (
        <TabsContent value="pedidos">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Data Pedido</TableHead>
                      <TableHead>Produto/Serviço</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead>Previsão Entrega</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.pedidos?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nenhum pedido encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.pedidos?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.data_pedido
                              ? format(new Date(item.data_pedido), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>{item.produto_nome}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell className="text-right">
                            {item.preco_unitario?.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                          <TableCell>
                            {item.data_entrega_prevista
                              ? format(new Date(item.data_entrega_prevista), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('pagamentos') && (
        <TabsContent value="pagamentos">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.pagamentos?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Nenhum pagamento pendente.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.pagamentos?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.data_vencimento
                              ? format(new Date(item.data_vencimento), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell>
                            {item.parcela} / {item.total_parcelas}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-700">
                            {item.valor?.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

// --- DESPACHANTE ---
export function PortalDespachante({ data, access }: { data: any; access: string[] }) {
  if (access.length === 0) return <NoAccess />

  return (
    <Tabs defaultValue={access[0]}>
      <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md bg-white border">
        {access.includes('containers') && (
          <TabsTrigger value="containers">Containers Ativos</TabsTrigger>
        )}
        {access.includes('documentos') && (
          <TabsTrigger value="documentos">Documentação</TabsTrigger>
        )}
      </TabsList>

      {access.includes('containers') && (
        <TabsContent value="containers">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Containers Pendentes/Embarcados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Número</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>ETD</TableHead>
                      <TableHead>Gate In</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.containers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nenhum container ativo.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.containers?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-bold">{item.numero_container}</TableCell>
                          <TableCell>{item.numero_booking || '-'}</TableCell>
                          <TableCell>{item.destino || '-'}</TableCell>
                          <TableCell>
                            {item.data_etd ? format(new Date(item.data_etd), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>
                            {item.gate_in_data
                              ? format(new Date(item.gate_in_data), 'dd/MM HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.status?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {access.includes('documentos') && (
        <TabsContent value="documentos">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Documentos Pendentes
              </CardTitle>
              <CardDescription>
                Lista de documentos que necessitam emissão ou validação.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Container</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nº Documento</TableHead>
                      <TableHead>Status Atual</TableHead>
                      <TableHead className="text-center">Visualizar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.documentos?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Toda a documentação está em dia.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.documentos?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.numero_container}</TableCell>
                          <TableCell className="uppercase text-xs font-semibold">
                            {item.tipo_documento?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{item.numero_documento || 'Pendente'}</TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="capitalize">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.arquivo_url ? (
                              <a
                                href={item.arquivo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-2 text-primary hover:bg-slate-100 rounded-md transition-colors"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

function NoAccess() {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-12 text-center text-muted-foreground">
        Não há permissões concedidas para visualizar dados neste portal.
      </CardContent>
    </Card>
  )
}
