import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FileText, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
import { comprasService } from '@/services/compras'

export default function CotacaoList() {
  const { empresa } = useEmpresa()
  const [cotacoes, setCotacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (empresa?.id) {
      loadCotacoes()
    }
  }, [empresa?.id])

  async function loadCotacoes() {
    try {
      setLoading(true)
      const data = await comprasService.getCotacoes(empresa!.id)
      setCotacoes(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = cotacoes.filter((c) =>
    c.requisicao?.numero_requisicao?.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Aberta
          </Badge>
        )
      case 'finalizada':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Finalizada
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie cotações de fornecedores para requisições aprovadas.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/compras/cotacoes/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Cotação
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número da requisição..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisição</TableHead>
              <TableHead>Justificativa</TableHead>
              <TableHead>Prazo Respostas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma cotação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cotacao) => (
                <TableRow key={cotacao.id}>
                  <TableCell className="font-medium">
                    {cotacao.requisicao?.numero_requisicao || 'N/A'}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={cotacao.requisicao?.justificativa}
                  >
                    {cotacao.requisicao?.justificativa || '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(cotacao.prazo_respostas), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{getStatusBadge(cotacao.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/compras/cotacoes/${cotacao.id}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Detalhes
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
