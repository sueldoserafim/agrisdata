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
import { Loader2, AlertCircle, Box, FileCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DespachantePortal() {
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
        <p className="text-slate-500">Portal do Despachante - {info.empresa_nome}</p>
      </div>

      <Tabs defaultValue="containers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="containers"
            disabled={!info.acessos_permitidos.includes('containers')}
          >
            Containers Ativos
          </TabsTrigger>
          <TabsTrigger
            value="documentos"
            disabled={!info.acessos_permitidos.includes('documentos')}
          >
            Pendências Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                Containers em Trânsito / Aguardando
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
                        <TableHead>Gate In</TableHead>
                        <TableHead>Cut Off</TableHead>
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
                          <TableCell>
                            {item.gate_in_data
                              ? format(new Date(item.gate_in_data), 'dd/MM/yyyy HH:mm')
                              : 'Pendente'}
                          </TableCell>
                          <TableCell>
                            {item.cut_off ? format(new Date(item.cut_off), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">Nenhum container ativo.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-500" />
                Documentação Pendente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.documentos?.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Emissão</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.documentos.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="uppercase font-medium">
                            {item.tipo_documento?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{item.numero_documento || '-'}</TableCell>
                          <TableCell>
                            {item.data_emissao
                              ? format(new Date(item.data_emissao), 'dd/MM/yyyy')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Nenhum documento pendente. Excelente!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
