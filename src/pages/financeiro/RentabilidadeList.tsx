import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function RentabilidadeList() {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  const [clientes, setClientes] = useState<any[]>([])
  const [navios, setNavios] = useState<any[]>([])

  const [filterCliente, setFilterCliente] = useState<string>('todos')
  const [filterNavio, setFilterNavio] = useState<string>('todos')

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      loadData()
    }
  }, [empresa, filterCliente, filterNavio])

  const loadDependencies = async () => {
    const [clRes, nRes] = await Promise.all([
      supabase.from('clientes').select('id, nome').eq('empresa_id', empresa?.id),
      supabase.from('navios').select('id, nome_navio').eq('empresa_id', empresa?.id),
    ])
    if (clRes.data) setClientes(clRes.data)
    if (nRes.data) setNavios(nRes.data)
  }

  const loadData = async () => {
    setLoading(true)
    let query = supabase
      .from('invoices_exportacao')
      .select(`
        id, 
        numero_invoice, 
        data_emissao,
        cliente_id,
        clientes(nome),
        container_id,
        containers(navio_id, navios(nome_navio)),
        financeiro_lancamentos(id, tipo, valor, status)
      `)
      .eq('empresa_id', empresa?.id)

    if (filterCliente !== 'todos') {
      query = query.eq('cliente_id', filterCliente)
    }

    const { data: invoices } = await query

    if (invoices) {
      let filteredInvoices = invoices

      if (filterNavio !== 'todos') {
        filteredInvoices = filteredInvoices.filter(
          (inv: any) => inv.containers?.navio_id === filterNavio,
        )
      }

      const processed = filteredInvoices.map((inv: any) => {
        let receitas = 0
        let despesas = 0

        inv.financeiro_lancamentos?.forEach((lanc: any) => {
          if (lanc.tipo === 'receita') receitas += Number(lanc.valor)
          if (lanc.tipo === 'despesa' || lanc.tipo === 'custo') despesas += Number(lanc.valor)
        })

        const lucro = receitas - despesas
        const margem = receitas > 0 ? (lucro / receitas) * 100 : 0

        return {
          id: inv.id,
          numero: inv.numero_invoice,
          cliente: inv.clientes?.nome || 'N/A',
          navio: inv.containers?.navios?.nome_navio || 'N/A',
          receitas,
          despesas,
          lucro,
          margem,
        }
      })
      setData(processed)
    }
    setLoading(false)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rentabilidade por Exportação</h1>
        <p className="text-muted-foreground">Análise de lucro por Invoice (Receitas vs Custos).</p>
      </div>

      <div className="flex gap-4">
        <Select value={filterCliente} onValueChange={setFilterCliente}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Clientes</SelectItem>
            {clientes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterNavio} onValueChange={setFilterNavio}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Navio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Navios</SelectItem>
            {navios.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.nome_navio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Navio</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Custos/Despesas</TableHead>
                <TableHead className="text-right">Lucro Líquido</TableHead>
                <TableHead className="text-right">Margem (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.numero}</TableCell>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell>{row.navio}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(row.receitas)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatCurrency(row.despesas)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${row.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(row.lucro)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${row.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {row.margem.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhuma rentabilidade calculada para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
