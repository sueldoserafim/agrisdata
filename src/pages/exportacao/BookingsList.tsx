import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { exportacaoService } from '@/services/exportacao'

export default function BookingsList() {
  const [bookings, setBookings] = useState<any[]>([])
  const [navios, setNavios] = useState<any[]>([])
  const [filterNavio, setFilterNavio] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await exportacaoService.getBookings(empresa.id)
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!empresa?.id) return
    loadData()
    exportacaoService.getNavios(empresa.id).then(({ data }) => setNavios(data || []))
  }, [empresa?.id])

  const filteredBookings = bookings.filter((b) => {
    if (filterNavio !== 'all' && b.navio_id !== filterNavio) return false
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este booking?')) return
    const { error } = await exportacaoService.deleteBooking(id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Booking excluído com sucesso.' })
      loadData()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Bookings de Exportação
          </h1>
          <p className="text-slate-500 mt-1">Gerencie reservas marítimas e rotas</p>
        </div>
        <Link to="/app/exportacao/bookings/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Booking
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={filterNavio}
          onChange={(e) => setFilterNavio(e.target.value)}
          className="flex h-10 w-full md:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">Todos os Navios</option>
          {navios.map((n) => (
            <option key={n.id} value={n.id}>
              {n.nome_navio}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">Todos os Status</option>
          <option value="reservado">Reservado</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_transito">Em Trânsito</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Booking</TableHead>
                  <TableHead>Navio</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>ETD</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      Nenhum booking encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.numero_booking}</TableCell>
                      <TableCell>{b.navios?.nome_navio || '-'}</TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500 block">
                          De: {b.porto_origem?.nome_porto || '-'}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Para: {b.porto_destino?.nome_porto || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {b.data_etd ? new Date(b.data_etd).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{b.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/app/exportacao/bookings/${b.id}`}>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(b.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
