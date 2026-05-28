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

export default function ViagensList() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('frota_viagens')
      .select('*, veiculo:veiculo_id(placa)')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('data_inicio', { ascending: false })
      .then(({ data }) => setData(data || []))
  }, [empresa])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Viagens e Logística</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.veiculo?.placa}</TableCell>
                  <TableCell>{v.origem}</TableCell>
                  <TableCell>{v.destino}</TableCell>
                  <TableCell>{new Date(v.data_inicio).toLocaleString()}</TableCell>
                  <TableCell>{v.data_fim ? 'Concluída' : 'Em curso'}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma viagem registrada.
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
