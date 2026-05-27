import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Box } from 'lucide-react'
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

export default function RolagensList() {
  const [rolagens, setRolagens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await exportacaoService.getRolagens(empresa.id)
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setRolagens(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este registro?')) return
    const { error } = await exportacaoService.deleteRolagem(id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro excluído com sucesso.' })
      loadData()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Rolagens de Container
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie a transferência de containers entre bookings
          </p>
        </div>
        <Link to="/app/exportacao/rolagem/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Rolagem
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Rolagens</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Container</TableHead>
                  <TableHead>Booking Origem</TableHead>
                  <TableHead>Booking Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Custo (USD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolagens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                      Nenhuma rolagem registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  rolagens.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.containers?.numero_container || 'N/A'}
                      </TableCell>
                      <TableCell>{r.booking_original?.numero_booking || '-'}</TableCell>
                      <TableCell>{r.booking_novo?.numero_booking || '-'}</TableCell>
                      <TableCell className="uppercase text-xs">{r.motivo_rolagem}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        ${Number(r.custo_rolagem_usd).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === 'aprovada' || r.status === 'executada'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(r.id)}
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
