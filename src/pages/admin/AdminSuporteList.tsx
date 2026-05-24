import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import {
  getTickets,
  updateTicket,
  getMensagens,
  addMensagem,
  getAdminUsers,
  getEmpresas,
} from '@/services/admin/suporte'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'

export default function AdminSuporteList() {
  const [tickets, setTickets] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [adminUsers, setAdminUsers] = useState<any[]>([])

  const [filters, setFilters] = useState({
    prioridade: 'todos',
    status: 'todos',
    empresa_id: 'todas',
    modulo: 'todos',
  })

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [mensagens, setMensagens] = useState<any[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { session } = useAuth()
  const currentUser = session?.user

  const loadData = async () => {
    try {
      const [tData, eData, uData] = await Promise.all([
        getTickets(filters),
        getEmpresas(),
        getAdminUsers(),
      ])
      setTickets(tData || [])
      setEmpresas(eData || [])
      setAdminUsers(uData || [])
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' })
    }
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const handleTicketClick = async (ticket: any) => {
    setSelectedTicket(ticket)
    try {
      const msgs = await getMensagens(ticket.id)
      setMensagens(msgs || [])
    } catch {
      toast({ title: 'Erro ao carregar mensagens', variant: 'destructive' })
    }
  }

  const handleSendMessage = async () => {
    if (!novaMensagem.trim() || !selectedTicket || !currentUser) return
    setIsSubmitting(true)
    try {
      const msg = await addMensagem(selectedTicket.id, currentUser.id, novaMensagem)
      setMensagens([...mensagens, msg])
      setNovaMensagem('')
    } catch {
      toast({ title: 'Erro ao enviar mensagem', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTicket = async (field: string, value: string | null) => {
    if (!selectedTicket) return
    try {
      await updateTicket(selectedTicket.id, { [field]: value })
      setSelectedTicket({ ...selectedTicket, [field]: value })
      loadData()
      toast({ title: 'Ticket atualizado' })
    } catch {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  }

  const statusColors: Record<string, string> = {
    aberto: 'bg-blue-100 text-blue-800 border-blue-200',
    em_andamento: 'bg-purple-100 text-purple-800 border-purple-200',
    resolvido: 'bg-teal-100 text-teal-800 border-teal-200',
    fechado: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
      </div>

      <div className="flex flex-wrap gap-4 bg-muted/50 p-4 rounded-lg border">
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select
            value={filters.status}
            onValueChange={(v) => setFilters({ ...filters, status: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="aberto">Aberto</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select
            value={filters.prioridade}
            onValueChange={(v) => setFilters({ ...filters, prioridade: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select
            value={filters.empresa_id}
            onValueChange={(v) => setFilters({ ...filters, empresa_id: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Empresas</SelectItem>
              {empresas.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleTicketClick(t)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {t.id.split('-')[0]}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate" title={t.titulo}>
                  {t.titulo}
                </TableCell>
                <TableCell>{t.empresas?.nome}</TableCell>
                <TableCell>{t.modulo || 'Geral'}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${priorityColors[t.prioridade] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {t.prioridade}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${statusColors[t.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(t.created_at), 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            ))}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum ticket encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="sm:max-w-[500px] w-[90vw] overflow-y-auto flex flex-col p-6">
          {selectedTicket && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl pr-6 leading-tight">
                  {selectedTicket.titulo}
                </SheetTitle>
                <SheetDescription>
                  Ticket criado por{' '}
                  <span className="font-semibold text-foreground">
                    {selectedTicket.empresas?.nome}
                  </span>{' '}
                  em {format(new Date(selectedTicket.created_at), "dd/MM/yyyy 'às' HH:mm")}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(v) => handleUpdateTicket('status', v)}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Atendente
                  </label>
                  <Select
                    value={selectedTicket.atendente_id || 'unassigned'}
                    onValueChange={(v) =>
                      handleUpdateTicket('atendente_id', v === 'unassigned' ? null : v)
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Não atribuído" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Não atribuído</SelectItem>
                      {adminUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nome || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Descrição do Problema
                </label>
                <div className="bg-muted/40 p-4 rounded-lg text-sm whitespace-pre-wrap border border-muted">
                  {selectedTicket.descricao || 'Nenhuma descrição fornecida.'}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[300px] border rounded-lg overflow-hidden bg-muted/10 shadow-sm">
                <div className="p-3 border-b bg-muted/30 font-medium text-sm text-foreground">
                  Histórico de Mensagens
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensagens.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      Nenhuma mensagem enviada ainda.
                    </div>
                  ) : (
                    mensagens.map((msg) => {
                      const isMe = msg.usuario_id === currentUser?.id
                      const isStaff =
                        msg.usuarios?.perfil === 'admin_saas' || msg.usuarios?.perfil === 'admin'

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            {!isMe && (
                              <span className="text-xs font-medium text-foreground">
                                {msg.usuarios?.nome || 'Usuário'}
                              </span>
                            )}
                            {isStaff && !isMe && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-semibold tracking-wider uppercase">
                                Staff
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(msg.created_at), 'dd/MM HH:mm')}
                            </span>
                            {isMe && (
                              <span className="text-xs font-medium text-foreground">Você</span>
                            )}
                          </div>
                          <div
                            className={`text-sm p-3.5 rounded-xl max-w-[85%] whitespace-pre-wrap leading-relaxed shadow-sm ${
                              isMe
                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                : 'bg-background border rounded-tl-sm text-foreground'
                            }`}
                          >
                            {msg.mensagem}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="p-3 border-t bg-background flex flex-col gap-3">
                  <Textarea
                    placeholder="Escreva uma resposta..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    className="resize-none min-h-[80px] text-sm focus-visible:ring-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Pressione <kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> para
                      enviar
                    </span>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={isSubmitting || !novaMensagem.trim()}
                      className="px-6"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
