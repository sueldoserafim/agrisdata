import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function AprovacoesList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [requisicoes, setRequisicoes] = useState<any[]>([])

  const loadData = useCallback(async () => {
    if (!empresa) return
    const { data } = await supabase
      .from('compras_requisicao')
      .select(`*, solicitante:usuarios(id, nome)`)
      .eq('empresa_id', empresa.id)
      .eq('status', 'pendente')
      .order('created_at', { ascending: false })
    if (data) setRequisicoes(data)
  }, [empresa])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleApprove = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('compras_requisicao')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Sucesso',
        description: `Solicitação ${newStatus === 'aprovada' ? 'aprovada' : 'rejeitada'}`,
      })
      loadData()
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Aprovações Pendentes</h1>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Justificativa</TableHead>
              <TableHead>Valor Estimado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisicoes.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.numero_requisicao}</TableCell>
                <TableCell>
                  {req.data_requisicao ? format(new Date(req.data_requisicao), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>{req.solicitante?.nome || 'N/A'}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={req.justificativa}>
                  {req.justificativa || '-'}
                </TableCell>
                <TableCell className="font-semibold text-amber-600">
                  {req.valor_total_estimado != null
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        req.valor_total_estimado,
                      )
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(req.id, 'aprovada')}
                    >
                      <CheckCircle className="size-4 mr-1" /> Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleApprove(req.id, 'rejeitada')}
                    >
                      <XCircle className="size-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {requisicoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="size-12 mx-auto text-green-500/50 mb-3" />
                  Nenhuma aprovação pendente no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
