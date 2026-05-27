import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Trash2, Landmark } from 'lucide-react'
import { Label } from '@/components/ui/label'

type ContaBancaria = {
  id: string
  nome_banco: string
  agencia: string
  conta: string
  tipo: string
  moeda: string
  saldo_atual: number
}

export default function ContasBancariasList() {
  const { empresa } = useEmpresa()
  const [contas, setContas] = useState<ContaBancaria[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<ContaBancaria>>({
    tipo: 'corrente',
    moeda: 'brl',
    saldo_atual: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (empresa) loadContas()
  }, [empresa])

  const loadContas = async () => {
    const { data } = await supabase
      .from('contas_bancarias' as any)
      .select('*')
      .eq('empresa_id', empresa?.id)
      .eq('ativo', true)
      .order('created_at', { ascending: false })
    if (data) setContas(data)
  }

  const handleSave = async () => {
    if (!formData.nome_banco || !formData.tipo || !formData.moeda) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    let error
    if (editingId) {
      const { error: updateError } = await supabase
        .from('contas_bancarias' as any)
        .update({
          nome_banco: formData.nome_banco,
          agencia: formData.agencia,
          conta: formData.conta,
          tipo: formData.tipo,
          moeda: formData.moeda,
          saldo_atual: formData.saldo_atual,
        })
        .eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('contas_bancarias' as any).insert({
        empresa_id: empresa?.id,
        ...formData,
        saldo_inicial: formData.saldo_atual || 0,
      })
      error = insertError
    }

    if (error) {
      toast.error('Erro ao salvar conta bancária')
    } else {
      toast.success('Conta salva com sucesso')
      setOpen(false)
      loadContas()
      setFormData({ tipo: 'corrente', moeda: 'brl', saldo_atual: 0 })
      setEditingId(null)
    }
  }

  const handleEdit = (conta: ContaBancaria) => {
    setFormData(conta)
    setEditingId(conta.id)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Deseja inativar esta conta? Exclusão permanente não é permitida se houver lançamentos.',
      )
    )
      return
    const { error } = await supabase
      .from('contas_bancarias' as any)
      .update({ ativo: false, deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) {
      toast.error('Erro ao excluir.')
    } else {
      toast.success('Conta removida')
      loadContas()
    }
  }

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(val || 0)
  }

  const calcularTotalBRL = () => {
    // Estimativa simples para dashboard/relatório
    return contas.reduce((acc, c) => {
      let rate = 1
      if (c.moeda === 'usd') rate = 5.0
      if (c.moeda === 'eur') rate = 5.4
      return acc + (c.saldo_atual || 0) * rate
    }, 0)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas Bancárias</h1>
          <p className="text-muted-foreground">Gerencie saldos e contas da empresa.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted px-4 py-2 rounded-lg text-sm hidden md:block">
            Saldo Total Estimado:{' '}
            <span className="font-bold text-lg">{formatCurrency(calcularTotalBRL(), 'BRL')}</span>
          </div>
          <Button
            onClick={() => {
              setFormData({ tipo: 'corrente', moeda: 'brl', saldo_atual: 0 })
              setEditingId(null)
              setOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Conta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contas.map((conta) => (
          <Card key={conta.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-500" />
                {conta.nome_banco}
              </CardTitle>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleEdit(conta)}
                >
                  <Landmark className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-6 w-6 ml-1"
                  onClick={() => handleDelete(conta.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2 capitalize">
                {conta.tipo} - Ag: {conta.agencia || '-'} / CC: {conta.conta || '-'}
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(conta.saldo_atual, conta.moeda)}
              </div>
            </CardContent>
          </Card>
        ))}
        {contas.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/20 border rounded-lg border-dashed">
            Nenhuma conta bancária cadastrada.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Banco / Instituição</Label>
              <Input
                value={formData.nome_banco || ''}
                onChange={(e) => setFormData({ ...formData, nome_banco: e.target.value })}
                placeholder="Banco do Brasil, Itaú, Wise..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agência</Label>
                <Input
                  value={formData.agencia || ''}
                  onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Conta</Label>
                <Input
                  value={formData.conta || ''}
                  onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                    <SelectItem value="aplicacao">Aplicação / Investimento</SelectItem>
                    <SelectItem value="exterior">Exterior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select
                  value={formData.moeda}
                  onValueChange={(val) => setFormData({ ...formData, moeda: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brl">Real (BRL)</SelectItem>
                    <SelectItem value="usd">Dólar (USD)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Saldo Inicial</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.saldo_atual || ''}
                onChange={(e) => setFormData({ ...formData, saldo_atual: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
