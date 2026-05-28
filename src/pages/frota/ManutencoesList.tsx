import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ManutencoesList() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('frota_manutencoes')
      .select('*, veiculo:veiculo_id(placa)')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('data_prevista', { ascending: true })
      .then(({ data }) => setData(data || []))
  }, [empresa])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Manutenções (Preventivas e Corretivas)
      </h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.veiculo?.placa}</TableCell>
                  <TableCell className="capitalize">{m.tipo}</TableCell>
                  <TableCell>
                    {m.data_prevista ? new Date(m.data_prevista).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>R$ {m.custo}</TableCell>
                  <TableCell>
                    <Badge variant={m.data_realizada ? 'default' : 'secondary'}>
                      {m.data_realizada ? 'Realizada' : 'Pendente'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma manutenção.
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
