import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, HelpCircle, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    <div className="p-8 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cultivares</h1>
          <p className="text-muted-foreground">Gerencie as variedades e tipos de culturas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <HelpCircle className="size-4 mr-2" />
                Ajuda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Como cadastrar uma Cultivar</DialogTitle>
                <DialogDescription>
                  Guia para preenchimento dos campos de Cultivar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm mt-2">
                <div>
                  <h4 className="font-semibold text-foreground">Nome</h4>
                  <p className="text-muted-foreground">
                    Obrigatório. O nome da cultivar (ex: BRS Vitória). Deve ser único na sua
                    empresa.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Cultura</h4>
                  <p className="text-muted-foreground">
                    Obrigatório. A cultivar precisa estar vinculada a uma cultura já previamente
                    cadastrada no sistema.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dias para Colheita</h4>
                  <p className="text-muted-foreground">
                    A duração média do ciclo em dias, desde o plantio ou poda até a colheita.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Produtividade Esperada (t/ha)</h4>
                  <p className="text-muted-foreground">
                    A expectativa de rendimento médio da variedade em toneladas por hectare.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Shelf Life</h4>
                  <p className="text-muted-foreground">
                    O tempo de prateleira ou vida útil do produto. Defina os dias em condição ideal
                    e o mínimo exigido.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Código Interno / Detentor</h4>
                  <p className="text-muted-foreground">
                    Informações administrativas, como um código próprio da empresa e a
                    empresa/instituição detentora da patente ou licenciamento.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild className="rounded-full px-6">
            <Link to="/app/cultivares/new">
              <Plus className="size-4 mr-2" />
              Nova Cultivar
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista" className="w-full space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="lista" className="w-32 rounded-md">
            <List className="size-4 mr-2" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card className="border-border shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-card">
              <div>
                <CardTitle className="text-xl">Todas as Cultivares</CardTitle>
                <CardDescription>Listagem detalhada das variedades registradas</CardDescription>
              </div>
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
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Nome / Código</TableHead>
                    <TableHead>Cultura</TableHead>
                    <TableHead>Produtividade (t/ha)</TableHead>
                    <TableHead>Ciclo (Dias)</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : cultivares.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma cultivar encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cultivares.map((cultivar) => (
                      <TableRow key={cultivar.id}>
                        <TableCell>
                          <div className="font-medium text-foreground">{cultivar.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {cultivar.codigo_interno || '-'}
                          </div>
                        </TableCell>
                        <TableCell>{cultivar.culturas?.nome || '-'}</TableCell>
                        <TableCell>{cultivar.produtividade_esperada_t_ha || '-'}</TableCell>
                        <TableCell>{cultivar.dias_para_colheita || '-'}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
