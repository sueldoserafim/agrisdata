import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Tractor } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function EquipamentoList() {
  const { empresa } = useEmpresa()
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (empresa?.id) loadData()
  }, [empresa?.id])

  const loadData = async () => {
    const { data } = await supabase
      .from('equipamentos')
      .select('*')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('nome')
    setEquipamentos(data || [])
  }

  const filtered = equipamentos.filter(
    (eq) =>
      eq.nome.toLowerCase().includes(search.toLowerCase()) ||
      (eq.tipo && eq.tipo.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie o maquinário, implementos e log de uso da fazenda.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/equipamentos/new">
            <Plus className="w-4 h-4 mr-2" /> Novo Equipamento
          </Link>
        </Button>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader className="py-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou tipo..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Equipamento</TableHead>
                <TableHead>Data de Aquisição</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Tractor className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{eq.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {eq.tipo || 'Sem tipo definido'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {eq.data_aquisicao ? new Date(eq.data_aquisicao).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {eq.valor_aquisicao ? `R$ ${eq.valor_aquisicao.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/equipamentos/${eq.id}`}>Histórico e Uso</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum equipamento encontrado.
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
