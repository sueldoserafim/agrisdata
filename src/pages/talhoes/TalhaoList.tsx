import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, Search } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { getTalhoes, getFazendas } from '@/services/talhoes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export default function TalhaoList() {
  const { empresa } = useEmpresa()
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [fazendas, setFazendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterFazenda, setFilterFazenda] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!empresa?.id) return
    const fetchDados = async () => {
      try {
        const [talhoesData, fazendasData] = await Promise.all([
          getTalhoes(empresa.id),
          getFazendas(empresa.id),
        ])
        setTalhoes(talhoesData)
        setFazendas(fazendasData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDados()
  }, [empresa?.id])

  const statusColors: Record<string, string> = {
    disponível: 'bg-green-100 text-green-800 border-green-200',
    em_plantio: 'bg-blue-100 text-blue-800 border-blue-200',
    em_produção: 'bg-purple-100 text-purple-800 border-purple-200',
    em_repouso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bloqueado: 'bg-red-100 text-red-800 border-red-200',
  }

  const filteredTalhoes = useMemo(() => {
    return talhoes.filter((t) => {
      const matchFazenda = filterFazenda === 'all' || t.fazenda_id === filterFazenda
      const matchStatus =
        filterStatus === 'all' || (t.status_atual || 'disponível') === filterStatus
      const matchSearch =
        t.nome.toLowerCase().includes(search.toLowerCase()) ||
        (t.codigo_talhao || '').toLowerCase().includes(search.toLowerCase())
      return matchFazenda && matchStatus && matchSearch
    })
  }, [talhoes, filterFazenda, filterStatus, search])

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talhões</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os talhões e áreas de plantio das suas fazendas
          </p>
        </div>
        <Button asChild>
          <Link to="/app/talhoes/new">
            <Plus className="size-4 mr-2" /> Novo Talhão
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6 bg-card p-4 rounded-xl border shadow-sm flex-wrap md:flex-nowrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={filterFazenda} onValueChange={setFilterFazenda}>
            <SelectTrigger>
              <SelectValue placeholder="Fazenda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Fazendas</SelectItem>
              {fazendas.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-64">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="disponível">Disponível</SelectItem>
              <SelectItem value="em_plantio">Em Plantio</SelectItem>
              <SelectItem value="em_produção">Em Produção</SelectItem>
              <SelectItem value="em_repouso">Em Repouso</SelectItem>
              <SelectItem value="bloqueado">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-2 overflow-y-auto pr-2 space-y-4 pb-12">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))
          ) : filteredTalhoes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
              Nenhum talhão encontrado
            </div>
          ) : (
            filteredTalhoes.map((t) => (
              <Card
                key={t.id}
                className="hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Link to={`/app/talhoes/${t.id}`} className="hover:underline">
                          {t.nome}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="size-3" /> {t.fazendas?.nome || 'Fazenda Desconhecida'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[t.status_atual || 'disponível']}
                    >
                      {(t.status_atual || 'disponível').replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm bg-muted/50 p-3 rounded-lg">
                    <div>
                      <span className="text-muted-foreground block text-xs">Código</span>
                      <span className="font-medium">{t.codigo_talhao || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Área</span>
                      <span className="font-medium">{t.area_ha || 0} ha</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-3 bg-muted/20 rounded-2xl border shadow-inner relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 bg-background/80 backdrop-blur-sm border-b absolute top-0 left-0 right-0 z-10 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Visualização Geográfica (Mapa)</h3>
            <span className="text-xs text-muted-foreground">Demo View</span>
          </div>

          <div
            className="flex-1 w-full h-full relative"
            style={{
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              backgroundColor: '#f9fafb',
            }}
          >
            <div className="absolute inset-0 pt-16 p-8 flex items-center justify-center">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
                className="opacity-80 drop-shadow-md"
              >
                {filteredTalhoes.map((t, i) => {
                  const x = 150 + ((i * 180) % 500)
                  const y = 100 + ((i * 120) % 350)
                  const scale = 0.5 + (t.area_ha ? Math.min(Number(t.area_ha) / 50, 1.5) : 1)
                  const color =
                    (t.status_atual || 'disponível') === 'disponível'
                      ? '#22c55e'
                      : t.status_atual === 'em_plantio'
                        ? '#3b82f6'
                        : t.status_atual === 'em_produção'
                          ? '#a855f7'
                          : t.status_atual === 'em_repouso'
                            ? '#eab308'
                            : '#ef4444'

                  return (
                    <g key={t.id} transform={`translate(${x}, ${y}) scale(${scale})`}>
                      <path
                        d="M0,0 L80,20 L100,100 L20,80 Z"
                        fill={color}
                        fillOpacity="0.4"
                        stroke={color}
                        strokeWidth="3"
                        className="hover:fill-opacity-0.6 hover:stroke-width-5 transition-all cursor-pointer"
                      />
                      <text
                        x="45"
                        y="55"
                        fontSize="14"
                        fill="#1f2937"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {t.codigo_talhao || t.nome.substring(0, 10)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {filteredTalhoes.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
                <p className="text-muted-foreground font-medium">
                  Nenhum talhão para exibir no mapa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
