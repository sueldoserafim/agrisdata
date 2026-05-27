import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { format, differenceInDays } from 'date-fns'
import { toast } from 'sonner'
import { Check, Link as LinkIcon, Plus, UploadCloud } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BankTx {
  id: string
  type: string
  date: string
  amount: number
  description: string
  matchedLancamento?: any
  status: 'pending' | 'matched' | 'reconciled'
}

export default function ConciliacaoBancaria() {
  const { empresa } = useEmpresa()
  const [contas, setContas] = useState<any[]>([])
  const [selectedConta, setSelectedConta] = useState<string>('')
  const [transactions, setTransactions] = useState<BankTx[]>([])
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (empresa) {
      loadContas()
      loadLancamentos()
    }
  }, [empresa])

  const loadContas = async () => {
    const { data } = await supabase
      .from('contas_bancarias' as any)
      .select('*')
      .eq('empresa_id', empresa?.id)
    if (data) setContas(data)
  }

  const loadLancamentos = async () => {
    const { data } = await supabase
      .from('financeiro_lancamentos')
      .select('*')
      .eq('empresa_id', empresa?.id)
      .in('status', ['pendente', 'atrasado'])
    if (data) setLancamentos(data)
  }

  const parseOFX = (content: string) => {
    const stmttrnRegex = /<STMTTRN>[\s\S]*?<\/STMTTRN>/g
    const trntypeRegex = /<TRNTYPE>(.*?)(\r?\n|<)/
    const dtpostedRegex = /<DTPOSTED>(.*?)(\r?\n|<)/
    const trnamtRegex = /<TRNAMT>(.*?)(\r?\n|<)/
    const fitidRegex = /<FITID>(.*?)(\r?\n|<)/
    const memoRegex = /<MEMO>(.*?)(\r?\n|<)/

    const txs: BankTx[] = []
    let match
    while ((match = stmttrnRegex.exec(content)) !== null) {
      const trn = match[0]
      const dtposted = trn.match(dtpostedRegex)?.[1]
      const amt = trn.match(trnamtRegex)?.[1]
      const fitid = trn.match(fitidRegex)?.[1] || Math.random().toString()
      const memo = trn.match(memoRegex)?.[1] || ''

      const dateStr = dtposted
        ? `${dtposted.substring(0, 4)}-${dtposted.substring(4, 6)}-${dtposted.substring(6, 8)}`
        : format(new Date(), 'yyyy-MM-dd')

      txs.push({
        id: fitid,
        type: Number(amt) >= 0 ? 'CREDIT' : 'DEBIT',
        date: dateStr,
        amount: parseFloat(amt || '0'),
        description: memo.trim(),
        status: 'pending',
      })
    }
    return txs
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const parsed = parseOFX(text)

      const matchedTxs = parsed.map((tx) => {
        const potentialMatch = lancamentos.find((l) => {
          const lDate = l.data_vencimento || l.data_lancamento
          if (!lDate) return false
          const daysDiff = Math.abs(differenceInDays(new Date(tx.date), new Date(lDate)))
          const valueMatch = Math.abs(Number(l.valor)) === Math.abs(tx.amount)
          return daysDiff <= 3 && valueMatch
        })
        if (potentialMatch) {
          return { ...tx, matchedLancamento: potentialMatch, status: 'matched' as const }
        }
        return tx
      })

      setTransactions(matchedTxs)
      toast.success(`${matchedTxs.length} transações importadas.`)
    }
    reader.readAsText(file)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const handleReconcile = async (tx: BankTx) => {
    if (!selectedConta) {
      toast.error('Selecione uma conta bancária primeiro.')
      return
    }

    setLoading(true)
    let lancamentoId = tx.matchedLancamento?.id

    if (!lancamentoId) {
      const tipo = tx.amount >= 0 ? 'receita' : 'despesa'
      const status = tx.amount >= 0 ? 'recebido' : 'pago'
      const payload = {
        empresa_id: empresa?.id,
        descricao: tx.description || 'Lançamento Conciliado',
        valor: Math.abs(tx.amount),
        tipo,
        status,
        data_lancamento: tx.date,
        data_pagamento: tx.date,
        conta_bancaria_id: selectedConta,
      }
      const { data, error } = await supabase
        .from('financeiro_lancamentos')
        .insert(payload)
        .select()
        .single()
      if (error) {
        toast.error('Erro ao criar lançamento: ' + error.message)
        setLoading(false)
        return
      }
      lancamentoId = data.id
    } else {
      const status = tx.matchedLancamento.tipo === 'receita' ? 'recebido' : 'pago'
      const { error } = await supabase
        .from('financeiro_lancamentos')
        .update({
          status,
          data_pagamento: tx.date,
          conta_bancaria_id: selectedConta,
        })
        .eq('id', lancamentoId)
      if (error) {
        toast.error('Erro ao atualizar lançamento: ' + error.message)
        setLoading(false)
        return
      }
    }

    const { data: acc } = await supabase
      .from('contas_bancarias' as any)
      .select('saldo_atual')
      .eq('id', selectedConta)
      .single()
    if (acc) {
      await supabase
        .from('contas_bancarias' as any)
        .update({ saldo_atual: Number(acc.saldo_atual || 0) + tx.amount })
        .eq('id', selectedConta)
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: 'reconciled' } : t)),
    )
    toast.success('Conciliação realizada com sucesso.')
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conciliação Bancária</h1>
        <p className="text-muted-foreground">
          Importe o arquivo OFX e reconcilie com os lançamentos do sistema.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-end bg-card border rounded-lg p-4">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Conta Bancária</label>
          <Select value={selectedConta} onValueChange={setSelectedConta}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a conta" />
            </SelectTrigger>
            <SelectContent>
              {contas.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome_banco} ({c.moeda?.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex-1 min-w-[250px]">
          <label className="text-sm font-medium">Arquivo OFX</label>
          <div className="flex gap-2">
            <Input type="file" accept=".ofx" ref={fileInputRef} onChange={handleFileUpload} />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <UploadCloud className="w-4 h-4 mr-2" /> Importar
            </Button>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transações Importadas</CardTitle>
            <CardDescription>Reveja e concilie as transações com o sistema.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição (Banco)</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Correspondência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className={tx.status === 'reconciled' ? 'bg-muted/50' : ''}>
                    <TableCell>{format(new Date(tx.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      {tx.status === 'reconciled' ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                        >
                          Conciliado
                        </Badge>
                      ) : tx.matchedLancamento ? (
                        <div className="text-sm">
                          <span className="font-medium">{tx.matchedLancamento.descricao}</span>
                          <p className="text-xs text-muted-foreground">
                            Venc: {tx.matchedLancamento.data_vencimento}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum correspondente</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== 'reconciled' && (
                        <Button
                          size="sm"
                          variant={tx.matchedLancamento ? 'default' : 'secondary'}
                          disabled={loading}
                          onClick={() => handleReconcile(tx)}
                        >
                          {tx.matchedLancamento ? (
                            <LinkIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          {tx.matchedLancamento ? 'Vincular' : 'Criar Lançamento'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
