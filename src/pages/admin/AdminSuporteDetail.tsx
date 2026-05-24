import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTicket, updateTicket } from '@/services/admin/suporte'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminSuporteDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState<any>(null)
  const { toast } = useToast()

  const loadTicket = () => getTicket(id!).then(setTicket)

  useEffect(() => {
    if (id) loadTicket()
  }, [id])

  const handleStatusChange = async (status: string) => {
    try {
      await updateTicket(id!, { status })
      toast({ title: 'Status atualizado' })
      loadTicket()
    } catch {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  if (!ticket) return <div>Carregando...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/suporte">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Ticket: {ticket.titulo}</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhes do Request</CardTitle>
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aberto">Aberto</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
            <div>
              <span className="font-semibold block">Empresa:</span> {ticket.empresas?.nome}
            </div>
            <div>
              <span className="font-semibold block">Módulo:</span> {ticket.modulo || 'Geral'}
            </div>
            <div>
              <span className="font-semibold block">Prioridade:</span>{' '}
              <span className="uppercase">{ticket.prioridade}</span>
            </div>
            <div>
              <span className="font-semibold block">Data de Criação:</span>{' '}
              {new Date(ticket.created_at).toLocaleString()}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Descrição do Problema</h3>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
              {ticket.descricao || 'Sem descrição.'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
