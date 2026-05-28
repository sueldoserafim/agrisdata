import { useParams } from 'react-router-dom'
import { usePortalData } from '@/hooks/use-portal-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Loader2, AlertCircle, FileText, Box, FileCheck, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ClientePortal() {
  const { token } = useParams<{ token: string }>()
  const { data, info, loading, error } = usePortalData(token || '')

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-slate-500">Loading portal data...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>{error || 'Could not load your information.'}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Hello, {info.nome_entidade}</h2>
        <p className="text-slate-500">Client Portal - {info.empresa_nome}</p>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="invoices" disabled={!info.acessos_permitidos.includes('invoices')}>Invoices</TabsTrigger>
          <TabsTrigger value="containers" disabled={!info.acessos_permitidos.includes('containers')}>Containers Tracking</TabsTrigger>
          <TabsTrigger value="documentos" disabled={!info.acessos_permitidos.includes('documentos')}>Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Commercial Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.invoices?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Incoterm</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.invoices.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.numero_invoice}</TableCell>
                          <TableCell>{item.data_emissao ? format(new Date(item.data_emissao), 'MMM dd, yyyy') : '-'}</TableCell>
                          <TableCell className="uppercase">{item.incoterm}</TableCell>
                          <TableCell>
                            <span className="capitalize px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.valor_total_usd || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">No invoices found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="containers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                Container Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.containers?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Container #</TableHead>
                        <TableHead>Booking #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ETD</TableHead>
                        <TableHead>ETA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.containers.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.numero_container}</TableCell>
                          <TableCell>{item.numero_booking || '-'}</TableCell>
                          <TableCell>
                            <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {item.status?.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{item.data_etd ? format(new Date(item.data_etd), 'MMM dd, yyyy') : '-'}</TableCell>
                          <TableCell>{item.data_eta ? format(new Date(item.data_eta), 'MMM dd, yyyy') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">No containers found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Export Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.documentos?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.documentos.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="uppercase font-medium">{item.tipo_documento?.replace('_', ' ')}</TableCell>
                          <TableCell>{item.numero_documento || '-'}</TableCell>
                          <TableCell>{item.data_emissao ? format(new Date(item.data_emissao), 'MMM dd, yyyy') : '-'}</TableCell>
                          <TableCell>
                            <span className="capitalize px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.arquivo_url ? (
                              <a href={item.arquivo_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                                Download <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400 text-sm">Unavailable</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">No documents available.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
