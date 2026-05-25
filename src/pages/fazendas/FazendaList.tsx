import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { getFazendas } from '@/services/fazendas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function FazendaList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [fazendas, setFazendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [municipio, setMunicipio] = useState('')
  const [tipo, setTipo] = useState('todos')

  const loadFazendas = async () => {
    if (!empresa?.id) return
    try {
      setLoading(true)
      const data = await getFazendas(empresa.id, { municipio, tipo_producao: tipo })
      setFazendas(data || [])
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFazendas()
  }, [empresa?.id, municipio, tipo])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fazendas</h1>
        <Button asChild>
          <Link to="/app/fazendas/new">
            <Plus className="mr-2 h-4 w-4" /> Nova Fazenda
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por município..."
                className="pl-8"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
              />
            </div>
          </div>
          <div className="w-[200px]">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Produção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="vegetais">Vegetais</SelectItem>
                <SelectItem value="graos">Grãos</SelectItem>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="cana">Cana</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Município / Estado</TableHead>
                <TableHead>Tipo Produção</TableHead>
                <TableHead className="text-right">Área Total (ha)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : fazendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma fazenda encontrada
                  </TableCell>
                </TableRow>
              ) : (
                fazendas.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {f.municipio} {f.estado ? `- ${f.estado}` : ''}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {f.tipo_producao || 'Não definido'}
                    </TableCell>
                    <TableCell className="text-right">
                      {f.area_total_ha?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/app/fazendas/${f.id}`}>Editar</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
