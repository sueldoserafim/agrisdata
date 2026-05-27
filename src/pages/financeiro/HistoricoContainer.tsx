import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

export default function HistoricoContainer() {
  const { empresa } = useEmpresa()
  const [containers, setContainers] = useState<any[]>([])
  const [selectedContainer, setSelectedContainer] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [summary, setSummary] = useState({ totalDespesas: 0, totalReceitas: 0, saldo: 0 })

  useEffect(() => {
    if (empresa) loadContainers()
  }, [empresa])

  useEffect(() => {
    if (selectedContainer) loadHistory()
  }, [selectedContainer])

  const loadContainers = async () => {
    const { data } = await supabase
      .from('containers')
      .select('id, numero_container')
      .eq('empresa_id', empresa?.id)
      .order('created_at', { ascending: false })
    if (data) setContainers(data)
  }

  const loadHistory = async () => {
    setLoading(true)

    // Get invoices linked to this container
    const { data: invs } = await supabase
      .from('invoices_exportacao')
      .select('id')
      .eq('container_id', selectedContainer)

    const invoiceIds = invs?.map((i) => i.id) || []

    let query = supabase
      .from('financeiro_lancamentos')
      .select('*, contas_bancarias(moeda)')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)

    if (invoiceIds.length > 0) {
      query = query.in('invoice_id', invoiceIds)
    } else {
      // Return empty if no invoices linked and no direct linkage
      setHistory([])
      setSummary({ totalDespesas: 0, totalReceitas: 0, saldo: 0 })
      setLoading(false)
      return
    }

    const { data } = await query

    if (data) {
      let r = 0
      let d = 0
      data.forEach((item) => {
        if (item.tipo === 'receita') r += Number(item.valor)
        if (item.tipo === 'despesa' || item.tipo === 'custo') d += Number(item.valor)
      })

      setHistory(data)
      setSummary({ totalReceitas: r, totalDespesas: d, saldo: r - d })
    }
    setLoading(false)
  }

  const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico Financeiro por Container</h1>
        <p className="text-muted-foreground">
          Analise todos os custos e receitas vinculados a um container específico.
        </p>
      </div>

      <div className="max-w-md">
        <label className="text-sm font-medium mb-1 block">Selecione o Container</label>
        <Select value={selectedContainer} onValueChange={setSelectedContainer}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {containers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.numero_container}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedContainer && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {fmtCurrency(summary.totalReceitas)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Despesas/Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {fmtCurrency(summary.totalDespesas)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${summary.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {fmtCurrency(summary.saldo)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lançamentos Vinculados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor (BRL)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.data_vencimento || h.data_lancamento}</TableCell>
                      <TableCell>{h.descricao}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${h.tipo === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {h.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">{h.status}</TableCell>
                      <TableCell className="text-right font-medium">
                        {fmtCurrency(Number(h.valor))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {history.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum lançamento financeiro vinculado a este container.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
