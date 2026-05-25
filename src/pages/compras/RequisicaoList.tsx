import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, HelpCircle, CheckCircle, XCircle, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function RequisicaoList() {
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const { toast } = useToast()

  const [requisicoes, setRequisicoes] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [perfil, setPerfil] = useState('')

  const [status, setStatus] = useState('all')
  const [safra, setSafra] = useState('all')
  const [solicitante, setSolicitante] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    if (!empresa || !user) return
    supabase
      .from('usuarios')
      .select('perfil')
      .eq('id', user.id)
      .single()
      .then(({ data }) => data && setPerfil(data.perfil))
    supabase
      .from('safras')
      .select('id, talhao:talhoes(nome), cultivar:cultivares(nome)')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setSafras(data || []))
    supabase
      .from('usuarios')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setUsuarios(data || []))
  }, [empresa, user])

  const loadData = useCallback(async () => {
    if (!empresa) return
    let q = supabase
      .from('compras_requisicao')
      .select(`*, solicitante:usuarios(id, nome)`)
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (status !== 'all') q = q.eq('status', status)
    if (safra !== 'all') q = q.eq('safra_id', safra)
    if (solicitante !== 'all') q = q.eq('solicitante_id', solicitante)
    if (dateFrom) q = q.gte('data_requisicao', dateFrom)
    if (dateTo) q = q.lte('data_requisicao', dateTo)
    const { data } = await q
    if (data) setRequisicoes(data)
  }, [empresa, status, safra, solicitante, dateFrom, dateTo])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleApprove = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('compras_requisicao')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: `Status atualizado` })
      loadData()
    }
  }

  const isManager = perfil === 'admin' || perfil === 'admin_saas'

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Solicitações de Compra</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <HelpCircle className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajuda: Solicitações de Compra</DialogTitle>
                <DialogDescription>
                  Módulo para gerenciar pedidos de compra de insumos. Solicitações até R$ 500,00 são
                  pré-aprovadas automaticamente. Valores superiores exigem aprovação de um gerente.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <Button asChild>
          <Link to="/app/compras/requisicoes/new">
            <Plus className="mr-2 size-4" /> Nova Solicitação
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-card p-4 rounded-xl border shadow-sm items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovada">Aprovada</SelectItem>
              <SelectItem value="rejeitada">Rejeitada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Safra</label>
          <Select value={safra} onValueChange={setSafra}>
            <SelectTrigger>
              <SelectValue placeholder="Safra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {safras.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.talhao?.nome} - {s.cultivar?.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
          <Select value={solicitante} onValueChange={setSolicitante}>
            <SelectTrigger>
              <SelectValue placeholder="Solicitante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {usuarios.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Data Inicial</label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Data Final</label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Valor Total Estimado</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell>
                  {req.valor_total_estimado != null
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        req.valor_total_estimado,
                      )
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === 'aprovada'
                        ? 'default'
                        : req.status === 'rejeitada'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === 'pendente' && req.valor_total_estimado > 500 && isManager && (
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
                  )}
                </TableCell>
              </TableRow>
            ))}
            {requisicoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
