import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
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
import { ArrowLeft, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EquipamentoDetail() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const [equipamento, setEquipamento] = useState<any>(null)
  const [operacoes, setOperacoes] = useState<any[]>([])

  useEffect(() => {
    if (empresa && id) {
      loadEquipamento()
      loadOperacoes()
    }
  }, [empresa, id])

  const loadEquipamento = async () => {
    const { data } = await supabase.from('equipamentos').select('*').eq('id', id).single()
    if (data) setEquipamento(data)
  }

  const loadOperacoes = async () => {
    const { data } = await supabase
      .from('operacoes_campo')
      .select('*, safras(nome_safra)')
      .eq('equipamento_id', id)
      .order('data_inicio', { ascending: false })

    if (data) setOperacoes(data)
  }

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1
    const s = new Date(start)
    const e = new Date(end)
    const diff = Math.abs(e.getTime() - s.getTime())
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const totalDays = operacoes.reduce(
    (acc, op) => acc + calculateDays(op.data_inicio, op.data_conclusao),
    0,
  )

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/equipamentos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{equipamento?.nome}</h1>
            <p className="text-muted-foreground">{equipamento?.tipo}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link to={`/app/equipamentos/new?id=${id}`}>Editar Cadastro</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-subtle border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Data de Aquisição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipamento?.data_aquisicao
                ? new Date(equipamento.data_aquisicao).toLocaleDateString()
                : 'Não informada'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {equipamento?.valor_aquisicao
                ? `Investimento: R$ ${equipamento.valor_aquisicao.toLocaleString()}`
                : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Uso Total Estimado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <div className="text-3xl font-bold tracking-tight">
              {totalDays}{' '}
              <span className="text-lg font-normal text-muted-foreground">dias operando</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Operações Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{operacoes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Histórico de Operações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operação</TableHead>
                <TableHead>Safra</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operacoes.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-medium capitalize">
                    {op.tipo_operacao?.replace('_', ' ')}
                  </TableCell>
                  <TableCell>{op.safras?.nome_safra || 'N/A'}</TableCell>
                  <TableCell>
                    {op.data_inicio ? new Date(op.data_inicio).toLocaleDateString() : 'N/A'}
                    {' a '}
                    {op.data_conclusao ? new Date(op.data_conclusao).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>{calculateDays(op.data_inicio, op.data_conclusao)} dias</TableCell>
                  <TableCell>
                    <Badge variant={op.status === 'concluída' ? 'default' : 'secondary'}>
                      {op.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {operacoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma operação vinculada a este equipamento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
