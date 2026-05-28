import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Building2, User, FilterX } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmpresa } from '@/hooks/use-empresa'
import { getClientes } from '@/services/clientes'

const ESTADOS_UF = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export default function ClienteList() {
  const { empresa } = useEmpresa()
  const [clientes, setClientes] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCidade, setFiltroCidade] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  useEffect(() => {
    if (empresa) {
      getClientes(empresa.id).then((res) => setClientes(res.data || []))
    }
  }, [empresa])

  const limparFiltros = () => {
    setBusca('')
    setFiltroEstado('todos')
    setFiltroCidade('')
    setFiltroStatus('todos')
  }

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      const matchBusca =
        c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cnpj_cpf?.includes(busca)
      const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
      const matchCidade =
        !filtroCidade || c.cidade?.toLowerCase().includes(filtroCidade.toLowerCase())

      let matchStatus = true
      if (filtroStatus === 'ativo') matchStatus = c.acesso_portal === true
      if (filtroStatus === 'inativo')
        matchStatus = c.acesso_portal === false || c.acesso_portal === null

      return matchBusca && matchEstado && matchCidade && matchStatus
    })
  }, [clientes, busca, filtroEstado, filtroCidade, filtroStatus])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerenciamento avançado de clientes e importadores.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/clientes/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 border rounded-md px-3 bg-slate-50 min-w-[300px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou documento..."
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-0"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Filtrar por Cidade"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            />
          </div>

          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado (UF)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Estados</SelectItem>
              {ESTADOS_UF.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={limparFiltros} className="text-muted-foreground">
            <FilterX className="w-4 h-4 mr-2" /> Limpar
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Localidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Portal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((cliente: any) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <Link
                    to={`/app/clientes/${cliente.id}`}
                    className="font-medium text-primary hover:underline flex items-center gap-2"
                  >
                    {cliente.tipo_pessoa === 'PJ' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    {cliente.nome}
                  </Link>
                </TableCell>
                <TableCell>{cliente.cnpj_cpf}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {cliente.cidade ? `${cliente.cidade} - ${cliente.estado}` : '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cliente.tipo_cliente || 'Nacional'}</Badge>
                </TableCell>
                <TableCell>
                  {cliente.acesso_portal ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
