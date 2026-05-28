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

export default function AbastecimentosList() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('frota_abastecimentos')
      .select('*, veiculo:veiculo_id(placa)')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => setData(data || []))
  }, [empresa])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Histórico de Abastecimentos</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Km Registro</TableHead>
                <TableHead>Litros</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.veiculo?.placa}</TableCell>
                  <TableCell>{m.km_registro}</TableCell>
                  <TableCell>{m.litros} L</TableCell>
                  <TableCell>R$ {m.valor_total}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Nenhum abastecimento.
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
