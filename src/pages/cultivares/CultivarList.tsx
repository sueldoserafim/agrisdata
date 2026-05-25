import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Leaf, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { cultivaresService, CultivarRow } from '@/services/cultivares'
import { supabase } from '@/lib/supabase/client'

export default function CultivarList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [cultivares, setCultivares] = useState<CultivarRow[]>([])
  const [culturas, setCulturas] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCultura, setFilterCultura] = useState<string>('all')

  useEffect(() => {
    if (empresa) {
      loadData()
    }
  }, [empresa, filterCultura])

  const loadData = async () => {
    try {
      setLoading(true)
      const cultivaresPromise = cultivaresService.fetchAll(
        empresa!.id,
        filterCultura === 'all' ? null : filterCultura,
      )
      const culturasPromise = supabase
        .from('culturas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null)
        .order('nome')

      const [cultivaresData, culturasResult] = await Promise.all([
        cultivaresPromise,
        culturasPromise,
      ])
      if (culturasResult.error) throw culturasResult.error
      setCultivares(cultivaresData)
      setCulturas(culturasResult.data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir esta cultivar?')) return
    try {
      await cultivaresService.remove(id)
      toast({ title: 'Sucesso', description: 'Cultivar excluída com sucesso' })
      loadData()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Leaf className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cultivares</h1>
            <p className="text-muted-foreground">Gerencie as variedades e suas características.</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/app/cultivares/new">
            <Plus className="size-4 mr-2" />
            Nova Cultivar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Lista de Cultivares</CardTitle>
          <div className="w-64">
            <Select value={filterCultura} onValueChange={setFilterCultura}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por cultura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Culturas</SelectItem>
                {culturas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cultura</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Ciclo (Dias)</TableHead>
                  <TableHead>Shelf Life (Ideal/Mín)</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : cultivares.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma cultivar encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  cultivares.map((cultivar) => (
                    <TableRow key={cultivar.id}>
                      <TableCell className="font-medium">{cultivar.nome}</TableCell>
                      <TableCell>{cultivar.culturas?.nome || '-'}</TableCell>
                      <TableCell>{cultivar.codigo_interno || '-'}</TableCell>
                      <TableCell>{cultivar.dias_para_colheita || '-'}</TableCell>
                      <TableCell>
                        {cultivar.shelf_life_ideal_dias || '-'} /{' '}
                        {cultivar.shelf_life_minimo_dias || '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/app/cultivares/${cultivar.id}`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cultivar.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
