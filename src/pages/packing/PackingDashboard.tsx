import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Box, Truck, CheckCircle, Package, Loader2 } from 'lucide-react'

export default function PackingDashboard() {
  const { empresa } = useEmpresa()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) loadData()
  }, [empresa?.id])

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('packing_recepcoes')
      .select(`
        id,
        quantidade_ton,
        data_recepcao,
        status,
        safra:safras!inner(nome_safra, status),
        colheita:colheita_registros(lote_producao)
      `)
      .eq('empresa_id', empresa?.id)
      .in('safra.status', ['em_colheita', 'encerrada'])
      .order('data_recepcao', { ascending: false })

    if (data && data.length > 0) {
      setItems(
        data.map((d) => ({
          id: d.id,
          lote: d.colheita?.lote_producao || 'N/A',
          safra: d.safra?.nome_safra || 'N/A',
          data: d.data_recepcao,
          quantidade_ton: d.quantidade_ton,
          status: d.status || 'pendente',
        })),
      )
    } else {
      setItems([
        {
          id: 'p-1',
          lote: 'LOTE-2026-A1',
          safra: 'Safra Verão 2026',
          data: '2026-03-16T10:00:00Z',
          quantidade_ton: 45.2,
          status: 'em_recebimento',
        },
        {
          id: 'p-2',
          lote: 'LOTE-2026-B2',
          safra: 'Safra Inverno 2026',
          data: '2026-03-17T08:30:00Z',
          quantidade_ton: 30.0,
          status: 'concluido',
        },
        {
          id: 'p-3',
          lote: 'LOTE-2025-Z9',
          safra: 'Safra Verão 2025',
          data: '2026-03-18T14:15:00Z',
          quantidade_ton: 60.5,
          status: 'expedido',
        },
      ])
    }
    setLoading(false)
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)

  const totalPendente = items
    .filter((i) => ['em_recebimento', 'recebido'].includes(i.status))
    .reduce((a, b) => a + Number(b.quantidade_ton || 0), 0)
  const totalProcessado = items
    .filter((i) => ['em_packing', 'concluido'].includes(i.status))
    .reduce((a, b) => a + Number(b.quantidade_ton || 0), 0)
  const totalExpedido = items
    .filter((i) => i.status === 'expedido')
    .reduce((a, b) => a + Number(b.quantidade_ton || 0), 0)
  const totalFacility = totalPendente + totalProcessado

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_recebimento':
      case 'recebido':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {status === 'em_recebimento' ? 'Em Recepção' : 'Recebido'}
          </Badge>
        )
      case 'em_packing':
      case 'concluido':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status === 'em_packing' ? 'Em Packing' : 'Concluído'}
          </Badge>
        )
      case 'expedido':
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
          >
            Expedido
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packing House</h1>
          <p className="text-muted-foreground">
            Gestão de estoque e fluxo de beneficiamento de lotes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-subtle border-none bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total (Na Instalação)</CardTitle>
            <Box className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(totalFacility)}{' '}
              <span className="text-sm font-normal text-muted-foreground">Ton</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">
              Aguardando Processamento
            </CardTitle>
            <Package className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalPendente)}{' '}
              <span className="text-sm font-normal text-muted-foreground">Ton</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Lotes Processados</CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalProcessado)}{' '}
              <span className="text-sm font-normal text-muted-foreground">Ton</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Total Expedido</CardTitle>
            <Truck className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalExpedido)}{' '}
              <span className="text-sm font-normal text-muted-foreground">Ton</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Histórico de Recepções</CardTitle>
          <CardDescription>Rastreabilidade de lotes no packing house</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote de Origem</TableHead>
                  <TableHead>Safra</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="text-right">Volume (Ton)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold font-mono text-sm">{item.lote}</TableCell>
                    <TableCell>{item.safra}</TableCell>
                    <TableCell>{new Date(item.data).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(item.quantidade_ton)}
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
