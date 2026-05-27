import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ArrowDownIcon, ArrowUpIcon, Wallet, DollarSign, PiggyBank } from 'lucide-react'

export default function FinanceiroDashboard() {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(true)
  const [saldos, setSaldos] = useState({ brl: 0, usd: 0, eur: 0 })
  const [lancamentosPendentes, setLancamentosPendentes] = useState({ aReceber: 0, aPagar: 0 })

  useEffect(() => {
    if (!empresa) return
    loadData()
  }, [empresa])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: contas } = await supabase
        .from('contas_bancarias' as any)
        .select('moeda, saldo_atual')
        .eq('empresa_id', empresa?.id)
        .eq('ativo', true)

      let b = 0,
        u = 0,
        e = 0
      contas?.forEach((c) => {
        if (c.moeda === 'brl') b += Number(c.saldo_atual || 0)
        if (c.moeda === 'usd') u += Number(c.saldo_atual || 0)
        if (c.moeda === 'eur') e += Number(c.saldo_atual || 0)
      })
      setSaldos({ brl: b, usd: u, eur: e })

      const hoje = format(new Date(), 'yyyy-MM-dd')
      const { data: lancamentos } = await supabase
        .from('financeiro_lancamentos')
        .select('tipo, valor')
        .eq('empresa_id', empresa?.id)
        .in('status', ['pendente', 'atrasado'])

      let r = 0,
        p = 0
      lancamentos?.forEach((l) => {
        if (l.tipo === 'receita') r += Number(l.valor)
        if (l.tipo === 'despesa') p += Number(l.valor)
      })
      setLancamentosPendentes({ aReceber: r, aPagar: p })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(val)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Visão geral do caixa e próximos vencimentos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo Total em Reais (BRL)</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldos.brl, 'BRL')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo Total em Dólares (USD)</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldos.usd, 'USD')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Saldo Total em Euros (EUR)</CardTitle>
            <PiggyBank className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(saldos.eur, 'EUR')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">A Receber (Pendentes)</CardTitle>
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(lancamentosPendentes.aReceber, 'BRL')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">A Pagar (Pendentes)</CardTitle>
            <ArrowDownIcon className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(lancamentosPendentes.aPagar, 'BRL')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
