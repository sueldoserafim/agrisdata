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
import { armazensService } from '@/services/armazens'
import { useEmpresa } from '@/hooks/use-empresa'

export default function ArmazemList() {
  const { empresa } = useEmpresa()
  const [armazens, setArmazens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) {
      armazensService
        .getAll(empresa.id)
        .then(setArmazens)
        .finally(() => setLoading(false))
    }
  }, [empresa?.id])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Armazéns</h1>
        <Button asChild>
          <Link to="/app/armazens/new">
            <Plus className="size-4 mr-2" /> Novo Armazém
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Fazenda</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Controles</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : armazens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum armazém encontrado
                </TableCell>
              </TableRow>
            ) : (
              armazens.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.nome}</TableCell>
                  <TableCell>{a.fazenda?.nome || '-'}</TableCell>
                  <TableCell className="capitalize">{a.tipo || '-'}</TableCell>
                  <TableCell>{a.responsavel?.nome || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {a.usa_peps && <Badge variant="outline">PEPS</Badge>}
                      {a.temperatura_controlada && (
                        <Badge variant="secondary">Temp. Controlada</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/app/armazens/${a.id}`}>
                        <Edit className="size-4" />
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
