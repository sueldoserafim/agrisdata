import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Box } from 'lucide-react'
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

export default function ContainersList() {
  const [containers, setContainers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await exportacaoService.getContainers(empresa.id)
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setContainers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este container?')) return
    const { error } = await exportacaoService.deleteContainer(id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Container excluído com sucesso.' })
      loadData()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Tracking de Containers
          </h1>
          <p className="text-slate-500 mt-1">Gerencie os containers e checklist logístico</p>
        </div>
        <Link to="/app/exportacao/containers/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Container
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Containers Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Container</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gate In</TableHead>
                  <TableHead>Gate Out</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      Nenhum container encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  containers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.numero_container}</TableCell>
                      <TableCell>{c.bookings?.numero_booking || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'entregue' ? 'default' : 'secondary'}>
                          {c.status || 'aguardando'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {c.gate_in_data ? new Date(c.gate_in_data).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {c.gate_out_data ? new Date(c.gate_out_data).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/app/exportacao/containers/${c.id}`}>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(c.id)}
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
