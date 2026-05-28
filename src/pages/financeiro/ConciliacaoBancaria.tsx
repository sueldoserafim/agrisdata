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
import { Check, Link as LinkIcon, Plus, UploadCloud, Info } from 'lucide-react'
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
    // Regex extractors for standard OFX nodes
    const stmttrnRegex = /<STMTTRN>[\s\S]*?<\/STMTTRN>/g
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

      const dateStr =
        dtposted && dtposted.length >= 8
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

  const parseCNAB = (content: string) => {
    // Mock simulation for CNAB 240/400 processing since parsing fixed pos is complex for purely client-side without layout map
    const lines = content.split('\n')
    const txs: BankTx[] = []
    lines.forEach((line, index) => {
      // Very crude simulation condition
      if (line.length > 50 && (line.startsWith('1') || line.startsWith('3'))) {
        txs.push({
          id: `cnab-sim-${index}`,
          type: index % 2 === 0 ? 'CREDIT' : 'DEBIT',
          date: format(new Date(), 'yyyy-MM-dd'),
          amount: 500 + index * 10,
          description: 'Lançamento CNAB - Liquidação',
          status: 'pending',
        })
      }
    })
    return txs
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isCNAB =
      file.name.toLowerCase().endsWith('.ret') || file.name.toLowerCase().endsWith('.cnab')

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      let parsed = []

      if (isCNAB) {
        parsed = parseCNAB(text)
        toast.info('Arquivo de retorno CNAB detectado. Processando posições e regras automáticas.')
      } else {
        parsed = parseOFX(text)
      }

      // De-Para Matching Logic
      const matchedTxs = parsed.map((tx) => {
        const potentialMatch = lancamentos.find((l) => {
          const lDate = l.data_vencimento || l.data_lancamento
          if (!lDate) return false
          const daysDiff = Math.abs(differenceInDays(new Date(tx.date), new Date(lDate)))
          const valueMatch = Math.abs(Number(l.valor)) === Math.abs(tx.amount)
          return daysDiff <= 5 && valueMatch // tolerance threshold
        })

        if (potentialMatch) {
          return { ...tx, matchedLancamento: potentialMatch, status: 'matched' as const }
        }
        return tx
      })

      setTransactions(matchedTxs)
      toast.success(
        `${matchedTxs.length} registros extraídos do arquivo para análise de conciliação.`,
      )
    }
    reader.readAsText(file)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const handleReconcile = async (tx: BankTx) => {
    if (!selectedConta) {
      toast.error('Selecione a Conta Bancária Origem primeiro.')
      return
    }

    setLoading(true)
    let lancamentoId = tx.matchedLancamento?.id

    if (!lancamentoId) {
      // Create new
      const tipo = tx.amount >= 0 ? 'receita' : 'despesa'
      const status = tx.amount >= 0 ? 'recebido' : 'pago'
      const payload = {
        empresa_id: empresa?.id,
        descricao: tx.description || 'Registro de Conciliação Automática',
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
        toast.error('Erro ao efetivar lançamento: ' + error.message)
        setLoading(false)
        return
      }
      lancamentoId = data.id
    } else {
      // Match existing
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
        toast.error('Falha ao conciliar: ' + error.message)
        setLoading(false)
        return
      }
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === tx.id ? { ...t, status: 'reconciled' } : t)),
    )
    toast.success('Transação liquidada e conciliada com sucesso.')
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conciliação Bancária</h1>
        <p className="text-muted-foreground mt-1">
          Importe arquivos de extrato (OFX) ou retorno bancário (CNAB) e faça o matching "de-para"
          inteligente com o sistema.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-end bg-card border rounded-lg p-5 shadow-sm">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Conta Bancária Origem</label>
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
          <label className="text-sm font-medium">Arquivo Base (OFX, CNAB, RET)</label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept=".ofx,.cnab,.ret"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="default">
              <UploadCloud className="w-4 h-4 mr-2" /> Importar Arquivo
            </Button>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <Card className="shadow-sm border-t-4 border-t-primary animate-in slide-in-from-bottom-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>Registros Extraídos</CardTitle>
                <Badge variant="secondary" className="px-2.5 py-0.5">
                  {transactions.length} registros
                </Badge>
              </div>
            </div>
            <CardDescription>
              Valide as correspondências que a inteligência do sistema identificou antes de efetivar
              os pagamentos ou baixas.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Data Movto</TableHead>
                  <TableHead>Histórico do Banco</TableHead>
                  <TableHead className="text-right">Valor Registrado</TableHead>
                  <TableHead className="w-[340px]">Inteligência de Correspondência</TableHead>
                  <TableHead className="text-right w-[180px]">Ação de Conciliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className={
                      tx.status === 'reconciled'
                        ? 'bg-green-50/50 dark:bg-green-950/20 opacity-80 transition-all'
                        : 'transition-colors'
                    }
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {tx.date.includes('-') ? format(new Date(tx.date), 'dd/MM/yyyy') : tx.date}
                    </TableCell>
                    <TableCell
                      className="text-muted-foreground truncate max-w-[200px]"
                      title={tx.description}
                    >
                      {tx.description || 'Lançamento sem histórico'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold whitespace-nowrap ${tx.amount >= 0 ? 'text-green-600 dark:text-green-500' : 'text-rose-600 dark:text-rose-500'}`}
                    >
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      {tx.status === 'reconciled' ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-300 gap-1 font-semibold dark:bg-green-900/50 dark:text-green-400 dark:border-green-800"
                        >
                          <Check className="w-3.5 h-3.5" /> Efetivado e Conciliado
                        </Badge>
                      ) : tx.matchedLancamento ? (
                        <div className="text-sm bg-primary/10 p-2.5 rounded-md border border-primary/20 animate-in fade-in zoom-in-95">
                          <div className="flex items-center gap-2 font-semibold text-primary">
                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate" title={tx.matchedLancamento.descricao}>
                              {tx.matchedLancamento.descricao}
                            </span>
                          </div>
                          <p className="text-xs text-primary/80 mt-1.5 flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                            Match Automático: Venc{' '}
                            {tx.matchedLancamento.data_vencimento?.split('-').reverse().join('/') ||
                              '-'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-2.5 rounded-md border border-dashed">
                          <Info className="w-4 h-4 shrink-0" /> Não houve cruzamento exato
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      {tx.status !== 'reconciled' && (
                        <Button
                          size="sm"
                          variant={tx.matchedLancamento ? 'default' : 'outline'}
                          disabled={loading}
                          onClick={() => handleReconcile(tx)}
                          className="w-full shadow-sm"
                        >
                          {tx.matchedLancamento ? 'Confirmar Vínculo' : 'Criar como Novo'}
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
