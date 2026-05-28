import { useEffect, useState } from 'react'
import { FileText, Search, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ContaCorrenteProdutor() {
  const { empresa } = useEmpresa()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [cooperados, setCooperados] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])

  const [produtorId, setProdutorId] = useState<string>('all')
  const [safraId, setSafraId] = useState<string>('all')

  useEffect(() => {
    if (empresa) {
      supabase
        .from('fornecedores')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setCooperados(data || []))
      supabase
        .from('safras')
        .select('id, nome_safra, codigo_safra')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null)
        .then(({ data }) => setSafras(data || []))
      loadData()
    }
  }, [empresa])

  async function loadData() {
    if (!empresa) return
    setLoading(true)
    let query = supabase
      .from('conta_corrente_produtor')
      .select('*, fornecedores(nome), safras(nome_safra, codigo_safra)')
      .eq('empresa_id', empresa.id)
      .order('data_movimento', { ascending: false })

    if (produtorId !== 'all') query = query.eq('produtor_id', produtorId)
    if (safraId !== 'all') query = query.eq('safra_id', safraId)

    const { data, error } = await query
    setLoading(false)
    if (error) toast.error('Erro ao carregar extrato')
    else setEntries(data || [])
  }

  const subtotal = entries.reduce((acc, curr) => acc + Number(curr.valor), 0)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Extrato Individual (Conta Corrente)</h1>
        <p className="text-muted-foreground mt-2">
          Demonstrativo financeiro detalhado de entregas, rateios de custo, receitas e
          adiantamentos.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Cooperado / Produtor</label>
            <Select value={produtorId} onValueChange={setProdutorId}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os Produtores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Produtores</SelectItem>
                {cooperados.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Safra</label>
            <Select value={safraId} onValueChange={setSafraId}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as Safras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Safras</SelectItem>
                {safras.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nome_safra || s.codigo_safra}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={loadData} disabled={loading} className="w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" /> Filtrar
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Saldo Acumulado (Filtro)
            </p>
            <h2
              className={cn(
                'text-3xl font-bold',
                subtotal >= 0 ? 'text-green-600' : 'text-destructive',
              )}
            >
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(
                subtotal,
              )}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cooperado</TableHead>
              <TableHead>Safra</TableHead>
              <TableHead>Histórico / Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado para os filtros.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {e.data_movimento ? new Date(e.data_movimento).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="font-medium">{e.fornecedores?.nome}</TableCell>
                  <TableCell>{e.safras?.nome_safra || e.safras?.codigo_safra || '-'}</TableCell>
                  <TableCell className="max-w-md truncate" title={e.descricao}>
                    {e.descricao}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {e.tipo_movimento?.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div
                      className={cn(
                        'flex items-center justify-end gap-2',
                        Number(e.valor) >= 0 ? 'text-green-600' : 'text-destructive',
                      )}
                    >
                      {Number(e.valor) >= 0 ? (
                        <ArrowUpCircle className="w-4 h-4" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4" />
                      )}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 4,
                      }).format(Math.abs(Number(e.valor)))}
                    </div>
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
