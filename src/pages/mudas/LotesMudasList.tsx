import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
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
import { useEmpresa } from '@/hooks/use-empresa'
import { lotesMudasService } from '@/services/lotes-mudas'

export default function LotesMudasList() {
  const { empresa } = useEmpresa()
  const [lotes, setLotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) loadLotes()
  }, [empresa?.id])

  const loadLotes = async () => {
    try {
      setLoading(true)
      const data = await lotesMudasService.getList(empresa!.id)
      setLotes(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    germinando: 'bg-blue-100 text-blue-800',
    em_desenvolvimento: 'bg-yellow-100 text-yellow-800',
    pronto: 'bg-green-100 text-green-800',
    transplantado: 'bg-purple-100 text-purple-800',
    descartado: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    germinando: 'Germinando',
    em_desenvolvimento: 'Em Desenvolvimento',
    pronto: 'Pronto',
    transplantado: 'Transplantado',
    descartado: 'Descartado',
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lotes de Mudas</h1>
          <p className="text-muted-foreground">
            Gerencie o ciclo de vida e custos das mudas no viveiro.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/mudas/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lote
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lote</TableHead>
              <TableHead>Cultura / Cultivar</TableHead>
              <TableHead>Estufa</TableHead>
              <TableHead className="text-right">Qtd. Inicial</TableHead>
              <TableHead className="text-right">Qtd. Viva</TableHead>
              <TableHead className="text-right">Custo / Muda</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : lotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum lote de mudas encontrado.
                </TableCell>
              </TableRow>
            ) : (
              lotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">{lote.nome_lote}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{lote.culturas?.nome || '-'}</span>
                      <span className="text-xs text-muted-foreground">
                        {lote.cultivares?.nome || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{lote.estufas?.nome || '-'}</TableCell>
                  <TableCell className="text-right">{lote.quantidade_mudas}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        lote.quantidade_viva < lote.quantidade_mudas
                          ? 'text-destructive font-medium'
                          : ''
                      }
                    >
                      {lote.quantidade_viva}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      lote.custo_por_muda || 0,
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-0 ${statusColors[lote.status || '']}`}
                    >
                      {statusLabels[lote.status || ''] || lote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/app/mudas/${lote.id}`}>
                        <Edit className="w-4 h-4" />
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
