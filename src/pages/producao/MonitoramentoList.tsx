import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Bug, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export default function MonitoramentoList() {
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const [registros, setRegistros] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  const loadData = async () => {
    try {
      const [regRes, talhoesRes] = await Promise.all([
        supabase
          .from('monitoramento_pragas')
          .select(`
            *,
            safras(nome_safra, talhao_id),
            usuarios(nome)
          `)
          .eq('empresa_id', empresa?.id)
          .order('data_monitoramento', { ascending: false }),
        supabase
          .from('talhoes')
          .select('id, nome, latitude, longitude')
          .eq('empresa_id', empresa?.id),
      ])

      setRegistros(regRes.data || [])
      setTalhoes(talhoesRes.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = registros.filter(
    (r) =>
      r.praga_identificada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.safras?.nome_safra?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getNivelColor = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'ausente':
        return 'bg-green-500'
      case 'baixo':
        return 'bg-yellow-500'
      case 'médio':
        return 'bg-orange-500'
      case 'alto':
        return 'bg-red-500'
      case 'crítico':
        return 'bg-red-900 animate-pulse'
      default:
        return 'bg-gray-500'
    }
  }

  const getNivelBadge = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'ausente':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
            Ausente
          </Badge>
        )
      case 'baixo':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
            Baixo
          </Badge>
        )
      case 'médio':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
            Médio
          </Badge>
        )
      case 'alto':
        return <Badge variant="destructive">Alto</Badge>
      case 'crítico':
        return (
          <Badge variant="destructive" className="bg-red-900 hover:bg-red-900 animate-pulse">
            Crítico
          </Badge>
        )
      default:
        return <Badge variant="secondary">{nivel || 'N/A'}</Badge>
    }
  }

  // Calculate Map Grid
  const validTalhoes = talhoes.filter((t) => t.latitude && t.longitude)
  const minLat = Math.min(...validTalhoes.map((t) => t.latitude))
  const maxLat = Math.max(...validTalhoes.map((t) => t.latitude))
  const minLng = Math.min(...validTalhoes.map((t) => t.longitude))
  const maxLng = Math.max(...validTalhoes.map((t) => t.longitude))

  const getLatestLevel = (talhaoId: string) => {
    const records = registros.filter((r) => r.safras?.talhao_id === talhaoId)
    if (!records.length) return 'ausente'
    return records[0].nivel_infestacao
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento MIP</h1>
          <p className="text-muted-foreground">Mapeamento de pragas, doenças e deficiências</p>
        </div>
        <Button onClick={() => navigate('/app/producao/monitoramento/novo')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <Tabs defaultValue="mapa" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mapa">Mapa de Infestação</TabsTrigger>
          <TabsTrigger value="lista">Lista de Registros</TabsTrigger>
        </TabsList>

        <TabsContent value="mapa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Visão Geral do Campo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-50 border rounded-lg relative overflow-hidden flex items-center justify-center p-8">
                {validTalhoes.length === 0 ? (
                  <div className="text-muted-foreground text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Nenhum talhão com coordenadas (GPS) cadastradas.</p>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {validTalhoes.map((talhao) => {
                      const x =
                        maxLng === minLng
                          ? 50
                          : ((talhao.longitude - minLng) / (maxLng - minLng)) * 90 + 5
                      const y =
                        maxLat === minLat
                          ? 50
                          : ((maxLat - talhao.latitude) / (maxLat - minLat)) * 90 + 5
                      const nivel = getLatestLevel(talhao.id)

                      return (
                        <TooltipProvider key={talhao.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() =>
                                  navigate(`/app/producao/monitoramento/novo?talhao=${talhao.id}`)
                                }
                                className={cn(
                                  'absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 z-10',
                                  getNivelColor(nivel),
                                )}
                                style={{ left: `${x}%`, top: `${y}%` }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">{talhao.nome}</p>
                              <p className="text-xs">
                                Nível: <span className="capitalize">{nivel}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Clique para registrar
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-4 justify-center text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" /> Ausente
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" /> Baixo
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500" /> Médio
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" /> Alto
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-900 animate-pulse" /> Crítico
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Histórico de Monitoramento</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar praga ou safra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Safra/Talhão</TableHead>
                      <TableHead>Alvo (Praga/Doença)</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Responsável</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum registro encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((reg) => (
                        <TableRow
                          key={reg.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/app/producao/monitoramento/${reg.id}`)}
                        >
                          <TableCell>
                            {reg.data_monitoramento &&
                              format(new Date(reg.data_monitoramento), 'dd/MM/yyyy', {
                                locale: ptBR,
                              })}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{reg.safras?.nome_safra}</div>
                            <div className="text-xs text-muted-foreground">
                              {talhoes.find((t) => t.id === reg.safras?.talhao_id)?.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Bug className="w-4 h-4 text-muted-foreground" />
                              {reg.praga_identificada}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{reg.tipo}</TableCell>
                          <TableCell>{getNivelBadge(reg.nivel_infestacao)}</TableCell>
                          <TableCell>{reg.usuarios?.nome}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
