import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Plus, FileText, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AnalisesSoloList() {
  const { empresa } = useEmpresa()
  const [analises, setAnalises] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [talhaoFilter, setTalhaoFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (empresa?.id) {
      loadTalhoes()
      loadAnalises()
    }
  }, [empresa?.id, talhaoFilter])

  const loadTalhoes = async () => {
    const { data } = await supabase.from('talhoes').select('id, nome').eq('empresa_id', empresa?.id)
    setTalhoes(data || [])
  }

  const loadAnalises = async () => {
    setLoading(true)
    let query = supabase
      .from('analises_solo')
      .select('*, talhoes(nome)')
      .eq('empresa_id', empresa?.id)
    if (talhaoFilter !== 'all') query = query.eq('talhao_id', talhaoFilter)
    const { data } = await query.order('data_coleta', { ascending: false })
    setAnalises(data || [])
    setLoading(false)
  }

  const isExpirado = (date: string) => {
    if (!date) return false
    const d = new Date(date)
    const limit = new Date()
    limit.setFullYear(limit.getFullYear() - 2)
    return d < limit
  }

  const filteredAnalises = analises.filter((item) => {
    if (statusFilter === 'valido') return !isExpirado(item.data_coleta)
    if (statusFilter === 'expirado') return isExpirado(item.data_coleta)
    return true
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Análises de Solo</h1>
        <Button asChild>
          <Link to="/app/agronomia/analises-solo/novo">
            <Plus className="mr-2 h-4 w-4" /> Nova Análise
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="w-56">
          <Select value={talhaoFilter} onValueChange={setTalhaoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Talhão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Talhões</SelectItem>
              {talhoes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status Validade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="valido">Válido</SelectItem>
              <SelectItem value="expirado">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data de Coleta</TableHead>
              <TableHead>Talhão</TableHead>
              <TableHead>Laboratório</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredAnalises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma análise encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredAnalises.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.data_coleta
                      ? format(new Date(item.data_coleta), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell>{item.talhoes?.nome || '-'}</TableCell>
                  <TableCell>{item.laboratorio || '-'}</TableCell>
                  <TableCell>
                    {isExpirado(item.data_coleta) ? (
                      <Badge variant="destructive" className="flex w-fit items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Expirado
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        Válido
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {item.laudo_pdf_url && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={item.laudo_pdf_url} target="_blank" rel="noreferrer">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/app/agronomia/analises-solo/${item.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
