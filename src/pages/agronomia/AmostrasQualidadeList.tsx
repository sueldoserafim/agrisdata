import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FlaskConical, FilterX } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useEmpresa } from '@/hooks/use-empresa'
import { getAmostrasQualidade } from '@/services/amostras-qualidade'
import { format } from 'date-fns'

export default function AmostrasQualidadeList() {
  const { empresa } = useEmpresa()
  const [amostras, setAmostras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [safraFilter, setSafraFilter] = useState('')
  const [talhaoFilter, setTalhaoFilter] = useState('')
  const [dataFilter, setDataFilter] = useState('')

  useEffect(() => {
    if (empresa?.id) {
      loadAmostras()
    }
  }, [empresa?.id])

  const loadAmostras = async () => {
    try {
      const data = await getAmostrasQualidade(empresa!.id)
      setAmostras(data || [])
    } catch (error) {
      console.error('Error loading amostras:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAmostras = amostras.filter((amostra) => {
    const matchSafra =
      !safraFilter ||
      (amostra.safras?.nome_safra || '').toLowerCase().includes(safraFilter.toLowerCase())
    const matchTalhao =
      !talhaoFilter ||
      (amostra.talhoes?.nome || '').toLowerCase().includes(talhaoFilter.toLowerCase())
    const matchData = !dataFilter || amostra.data_coleta === dataFilter
    return matchSafra && matchTalhao && matchData
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FlaskConical className="h-8 w-8 text-primary" />
            Amostras de Qualidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitore e analise a qualidade das safras em campo
          </p>
        </div>
        <Link to="/app/agronomia/amostras-qualidade/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Amostra
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por Safra</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar safra..."
              value={safraFilter}
              onChange={(e) => setSafraFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrar por Talhão</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar talhão..."
              value={talhaoFilter}
              onChange={(e) => setTalhaoFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Data de Coleta</label>
          <Input type="date" value={dataFilter} onChange={(e) => setDataFilter(e.target.value)} />
        </div>
        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSafraFilter('')
              setTalhaoFilter('')
              setDataFilter('')
            }}
          >
            <FilterX className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data de Coleta</TableHead>
              <TableHead>Safra / Talhão</TableHead>
              <TableHead>Estágio Fenológico</TableHead>
              <TableHead>Brix Médio</TableHead>
              <TableHead>Firmeza</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredAmostras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  Nenhuma amostra encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredAmostras.map((amostra) => (
                <TableRow key={amostra.id}>
                  <TableCell className="font-medium">
                    {format(new Date(amostra.data_coleta + 'T00:00:00'), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/app/agronomia/amostras-qualidade/${amostra.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <div className="font-semibold">
                        {amostra.safras?.nome_safra || amostra.safras?.codigo_safra}
                      </div>
                      <div className="text-xs text-muted-foreground">{amostra.talhoes?.nome}</div>
                    </Link>
                  </TableCell>
                  <TableCell>{amostra.estagio_fenologico || '-'}</TableCell>
                  <TableCell>{amostra.brix_medio ? `${amostra.brix_medio} °Bx` : '-'}</TableCell>
                  <TableCell>
                    {amostra.firmeza_media ? `${amostra.firmeza_media} N` : '-'}
                  </TableCell>
                  <TableCell>
                    {amostra.apto_colheita ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Apto para Colheita
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Em Desenvolvimento</Badge>
                    )}
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
