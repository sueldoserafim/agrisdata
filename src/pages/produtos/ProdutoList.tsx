import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit } from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { produtosService, Produto } from '@/services/produtos'
import { useEmpresa } from '@/hooks/use-empresa'

export default function ProdutoList() {
  const { empresa } = useEmpresa()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (empresa?.id) {
      produtosService
        .getAll(empresa.id)
        .then(setProdutos)
        .finally(() => setLoading(false))
    }
  }, [empresa?.id])

  const filtered = produtos.filter((p) => {
    if (filterCat !== 'all' && p.categoria !== filterCat) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (search) {
      const s = search.toLowerCase()
      if (!p.nome.toLowerCase().includes(s) && !(p.tipo || '').toLowerCase().includes(s))
        return false
    }
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos e Insumos</h1>
        <Button asChild>
          <Link to="/app/produtos/new">
            <Plus className="size-4 mr-2" /> Novo Produto
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto por nome ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="insumo">Insumo</SelectItem>
              <SelectItem value="defensivo">Defensivo</SelectItem>
              <SelectItem value="fertilizante">Fertilizante</SelectItem>
              <SelectItem value="sementes">Sementes</SelectItem>
              <SelectItem value="embalagem">Embalagem</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Preço Unit.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell className="capitalize">{p.categoria || '-'}</TableCell>
                  <TableCell>{p.tipo || '-'}</TableCell>
                  <TableCell>{p.unidade_medida || '-'}</TableCell>
                  <TableCell>
                    {p.preco_unitario != null ? `R$ ${p.preco_unitario.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'ativo' ? 'default' : 'secondary'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/app/produtos/${p.id}`}>
                        <Edit className="size-4" />
                      </Link>
                    </Button>
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
