import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getFaturas, updateFaturaStatus } from '@/services/admin/faturamento'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function AdminFaturamentoList() {
  const [faturas, setFaturas] = useState<any[]>([])
  const { toast } = useToast()

  const loadData = async () => setFaturas((await getFaturas()) || [])
  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateFaturaStatus(id, status)
      toast({ title: 'Status atualizado' })
      loadData()
    } catch {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Pago</Badge>
      case 'atrasado':
        return <Badge variant="destructive">Atrasado</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Faturamento (Invoices)</h1>
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Mês Referência</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faturas.map((fatura) => (
              <TableRow key={fatura.id}>
                <TableCell className="font-medium">{fatura.empresas?.nome}</TableCell>
                <TableCell>{fatura.mes_referencia}</TableCell>
                <TableCell>
                  {fatura.data_vencimento
                    ? new Date(fatura.data_vencimento).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    fatura.valor_total,
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(fatura.status)}</TableCell>
                <TableCell>
                  <Select
                    value={fatura.status}
                    onValueChange={(val) => handleStatusChange(fatura.id, val)}
                  >
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
