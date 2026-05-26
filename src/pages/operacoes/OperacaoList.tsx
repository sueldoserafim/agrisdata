import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Tractor } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const TIPOS_OPERACAO = [
  { value: 'preparo_solo', label: 'Preparo de Solo' },
  { value: 'plantio', label: 'Plantio' },
  { value: 'adubação', label: 'Adubação' },
  { value: 'aplicação_defensivo', label: 'Aplicação Defensivo' },
  { value: 'irrigação', label: 'Irrigação' },
  { value: 'colheita', label: 'Colheita' },
  { value: 'outro', label: 'Outro' },
]

export default function OperacaoList() {
  const { empresa } = useEmpresa()
  const [operacoes, setOperacoes] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])

  const [statusFilter, setStatusFilter] = useState('all')
  const [tipoFilter, setTipoFilter] = useState('all')
  const [safraFilter, setSafraFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (empresa) {
      fetchSafras()
      fetchOperacoes()
    }
  }, [empresa, statusFilter, tipoFilter, safraFilter])

  const fetchSafras = async () => {
    const { data } = await supabase
      .from('safras')
      .select('id, nome_safra')
      .eq('empresa_id', empresa?.id)
    if (data) setSafras(data)
  }

  const fetchOperacoes = async () => {
    let query = supabase
      .from('operacoes_campo')
      .select(`*, safras(nome_safra, talhoes(nome))`)
      .eq('empresa_id', empresa?.id)
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (tipoFilter !== 'all') query = query.eq('tipo_operacao', tipoFilter)
    if (safraFilter !== 'all') query = query.eq('safra_id', safraFilter)

    const { data } = await query
    setOperacoes(data || [])
  }

  const filteredData = operacoes.filter((op) =>
    search
      ? op.id.toLowerCase().includes(search.toLowerCase()) ||
        op.tipo_operacao?.toLowerCase().includes(search.toLowerCase())
      : true,
  )

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pendente: 'bg-yellow-500',
      em_execução: 'bg-blue-500',
      concluída: 'bg-green-500',
      cancelada: 'bg-red-500',
    }
    return map[status] || 'bg-gray-500'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operações de Campo (OS)</h1>
          <p className="text-muted-foreground">
            Gerencie as ordens de serviço e atividades no campo.
          </p>
        </div>
        <Link to="/app/operacoes/nova">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Nova OS
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar OS..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_execução">Em Execução</SelectItem>
            <SelectItem value="concluída">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {TIPOS_OPERACAO.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={safraFilter} onValueChange={setSafraFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Safra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Safras</SelectItem>
            {safras.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nome_safra}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS / Tipo</TableHead>
              <TableHead>Safra (Talhão)</TableHead>
              <TableHead>Data Planejada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((op) => (
              <TableRow key={op.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <Tractor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {op.tipo_operacao?.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {op.id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{op.safras?.nome_safra || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">
                    {op.safras?.talhoes?.nome || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  {op.data_inicio ? new Date(op.data_inicio).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(op.status)}>{op.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/app/operacoes/${op.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma operação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
