import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function EpiList() {
  const { empresa } = useEmpresa()
  const [entregas, setEntregas] = useState<any[]>([])

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('rh_epi_entregas')
      .select('*, epi:epi_id(nome), func:funcionario_id(nome)')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .then(({ data }) => setEntregas(data || []))
  }, [empresa])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Controle de EPIs</h1>
        <Button>Registrar Entrega</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>EPI</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Assinatura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entregas.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.func?.nome}</TableCell>
                  <TableCell>{e.epi?.nome}</TableCell>
                  <TableCell>{new Date(e.data_entrega).toLocaleDateString()}</TableCell>
                  <TableCell
                    className={
                      new Date(e.data_vencimento) < new Date() ? 'text-destructive font-bold' : ''
                    }
                  >
                    {new Date(e.data_vencimento).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{e.assinatura_digital_url ? 'Digital' : 'Pendente'}</TableCell>
                </TableRow>
              ))}
              {entregas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum registro encontrado
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
