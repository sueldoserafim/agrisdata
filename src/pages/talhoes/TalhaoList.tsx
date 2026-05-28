import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmpresa } from '@/hooks/use-empresa'
import { getTalhoes, deleteTalhao } from '@/services/talhoes'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, List, Map as MapIcon, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

export default function TalhaoList() {
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTalhoes = async () => {
    if (!empresa?.id) return
    try {
      setLoading(true)
      const data = await getTalhoes(empresa.id)
      setTalhoes(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao buscar talhões',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTalhoes()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    try {
      await deleteTalhao(id)
      toast({
        title: 'Sucesso',
        description: 'Talhão excluído com sucesso.',
      })
      fetchTalhoes()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const mapData = useMemo(() => {
    return talhoes
      .filter((t) => t.latitude != null && t.longitude != null)
      .map((t) => ({
        x: Number(t.longitude),
        y: Number(t.latitude),
        name: t.nome,
        area: Number(t.area_ha) || 10,
        fazenda: t.fazendas?.nome || 'N/A',
        status: t.status_atual,
      }))
  }, [talhoes])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talhões</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as áreas de plantio e visualize no mapa
          </p>
        </div>
        <Button onClick={() => navigate('/app/talhoes/new')} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Talhão
        </Button>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Mapa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Todos os Talhões</CardTitle>
              <CardDescription>Listagem detalhada das áreas produtivas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome / Código</TableHead>
                      <TableHead>Fazenda</TableHead>
                      <TableHead>Área (ha)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {talhoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum talhão encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      talhoes.map((talhao) => (
                        <TableRow key={talhao.id}>
                          <TableCell>
                            <div className="font-medium">{talhao.nome}</div>
                            {talhao.codigo_talhao && (
                              <div className="text-xs text-muted-foreground">
                                {talhao.codigo_talhao}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{talhao.fazendas?.nome || 'N/A'}</TableCell>
                          <TableCell>{talhao.area_ha || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                talhao.status_atual === 'disponível' ? 'default' : 'secondary'
                              }
                            >
                              {talhao.status_atual || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/app/talhoes/${talhao.id}`)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Talhão?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. O talhão será movido para a
                                      lixeira.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground"
                                      onClick={() => handleDelete(talhao.id)}
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa" className="mt-0 h-[600px]">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle>Distribuição Geográfica</CardTitle>
              <CardDescription>
                Posicionamento dos talhões com base em suas coordenadas (Latitude / Longitude)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {mapData.length > 0 ? (
                <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-md border p-4">
                  <ChartContainer
                    config={{
                      talhao: {
                        label: 'Talhão',
                        color: 'hsl(var(--primary))',
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Longitude"
                          domain={['auto', 'auto']}
                          tickFormatter={(val) => val.toFixed(4)}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Latitude"
                          domain={['auto', 'auto']}
                          tickFormatter={(val) => val.toFixed(4)}
                        />
                        <ZAxis type="number" dataKey="area" range={[100, 1000]} name="Área (ha)" />
                        <ChartTooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-md text-sm">
                                  <div className="font-bold mb-1 text-base">{data.name}</div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <span className="text-muted-foreground">Fazenda:</span>
                                    <span className="font-medium">{data.fazenda}</span>
                                    <span className="text-muted-foreground">Área:</span>
                                    <span className="font-medium">{data.area} ha</span>
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium capitalize">{data.status}</span>
                                    <span className="text-muted-foreground">Lat/Lng:</span>
                                    <span className="font-medium text-xs">
                                      {data.y.toFixed(4)} / {data.x.toFixed(4)}
                                    </span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Scatter
                          name="Talhões"
                          data={mapData}
                          fill="hsl(var(--primary))"
                          fillOpacity={0.7}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-md bg-muted/20">
                  <MapIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p>Nenhum talhão com coordenadas geográficas cadastradas.</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => navigate('/app/talhoes/new')}
                  >
                    Cadastrar coordenadas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
