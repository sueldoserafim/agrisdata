import { useEffect, useState } from 'react'
import { FileText, Package } from 'lucide-react'
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
import { comprasService } from '@/services/compras'

export default function PedidoList() {
  const { empresa } = useEmpresa()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) {
      loadPedidos()
    }
  }, [empresa?.id])

  async function loadPedidos() {
    try {
      setLoading(true)
      const data = await comprasService.getPedidos(empresa!.id)
      setPedidos(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case 'recebido':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Recebido
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status || 'Pendente'}</Badge>
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos de Compra</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os pedidos gerados a partir de cotações aprovadas.
          </p>
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Preço Unit.</TableHead>
              <TableHead>Previsão Entrega</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {pedido.fornecedor?.nome || 'N/A'}
                  </TableCell>
                  <TableCell>{pedido.produto?.nome || 'Produto não encontrado'}</TableCell>
                  <TableCell className="text-right">{pedido.quantidade}</TableCell>
                  <TableCell className="text-right">
                    R$ {pedido.preco_unitario?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {pedido.data_entrega_prevista
                      ? new Date(pedido.data_entrega_prevista).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
