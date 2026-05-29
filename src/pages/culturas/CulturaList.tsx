import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, List as ListIcon, Map, Edit, Trash2, Search, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

type Cultura = {
  id: string
  nome: string
  nome_cientifico: string | null
  tipo: string | null
  ciclo_dias: number | null
  unidade_medida: string | null
  produtividade_media_t_ha: number | null
}

export default function CulturaList() {
  const [culturas, setCulturas] = useState<Cultura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const fetchCulturas = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('culturas')
        .select(
          'id, nome, nome_cientifico, tipo, ciclo_dias, unidade_medida, produtividade_media_t_ha',
        )
        .is('deleted_at', null)
        .order('nome', { ascending: true })

      if (error) throw error
      setCulturas(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar culturas',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCulturas()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('culturas')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Sucesso',
        description: 'Cultura excluída com sucesso.',
      })
      fetchCulturas()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredCulturas = culturas.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.nome_cientifico && c.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tipo && c.tipo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Culturas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as culturas e suas especificações técnicas
          </p>
        </div>
        <Link to="/app/culturas/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Nova Cultura
          </Button>
        </Link>
      </div>

      {/* Tabs and Content */}
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="lista">
            <ListIcon className="w-4 h-4 mr-2" /> Lista
          </TabsTrigger>
          <TabsTrigger value="mapa">
            <Map className="w-4 h-4 mr-2" /> Mapa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 m-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Todas as Culturas</CardTitle>
                  <CardDescription>Listagem detalhada das culturas cadastradas</CardDescription>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar cultura..."
                    className="pl-8 bg-muted/40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Nome / Nome Científico</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ciclo (dias)</TableHead>
                    <TableHead>Produtividade (t/ha)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredCulturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <Sprout className="h-10 w-10 text-muted-foreground/30 mb-2" />
                          <p>Nenhuma cultura encontrada</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCulturas.map((cultura) => (
                      <TableRow key={cultura.id}>
                        <TableCell>
                          <div className="font-medium">{cultura.nome}</div>
                          {cultura.nome_cientifico && (
                            <div className="text-sm text-muted-foreground italic">
                              {cultura.nome_cientifico}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {cultura.tipo || <span className="text-muted-foreground/50">-</span>}
                        </TableCell>
                        <TableCell>
                          {cultura.ciclo_dias ? (
                            <span>{cultura.ciclo_dias} dias</span>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {cultura.produtividade_media_t_ha ? (
                            <span>
                              {cultura.produtividade_media_t_ha} {cultura.unidade_medida || 't'}/ha
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/app/culturas/${cultura.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Cultura</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a cultura{' '}
                                    <strong>{cultura.nome}</strong>? Esta ação não poderá ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(cultura.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa" className="m-0">
          <Card className="border-none shadow-sm min-h-[400px] flex items-center justify-center bg-muted/10">
            <CardContent className="text-center text-muted-foreground">
              <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p>Visualização em mapa indisponível para culturas.</p>
              <p className="text-sm">As culturas não possuem coordenadas geográficas diretas.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
