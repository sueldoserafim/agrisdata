import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function RomaneioList() {
  const { empresa } = useEmpresa()
  const [romaneios, setRomaneios] = useState<any[]>([])

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('romaneios_venda')
        .select(`*, cliente:clientes(nome)`)
        .eq('empresa_id', empresa.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setRomaneios(data || []))
    }
  }, [empresa?.id])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Romaneios de Venda</h1>
          <p className="text-muted-foreground">Gerencie a separação e carregamento de pedidos</p>
        </div>
        <Button asChild>
          <Link to="/app/packing/romaneios/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Romaneio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Romaneios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Total Pallets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {romaneios.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono font-medium">{r.numero_romaneio}</TableCell>
                  <TableCell>{r.cliente?.nome || 'Avulso'}</TableCell>
                  <TableCell>{new Date(r.data_emissao).toLocaleDateString()}</TableCell>
                  <TableCell>{r.total_pallets}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === 'em_aberto'
                          ? 'secondary'
                          : r.status === 'carregado'
                            ? 'default'
                            : 'outline'
                      }
                      className="capitalize"
                    >
                      {r.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/app/packing/romaneios/${r.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {romaneios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhum romaneio encontrado
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
