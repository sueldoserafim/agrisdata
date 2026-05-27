import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ContaCorrenteProdutor() {
  const { empresa } = useEmpresa()
  const [produtores, setProdutores] = useState<any[]>([])
  const [selectedProdutor, setSelectedProdutor] = useState<string>('')
  const [movimentos, setMovimentos] = useState<any[]>([])
  const [saldoFinal, setSaldoFinal] = useState(0)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
    tipo_movimento: 'adiantamento',
    data_movimento: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (empresa) loadProdutores()
  }, [empresa])

  useEffect(() => {
    if (selectedProdutor) loadMovimentos()
    else setMovimentos([])
  }, [selectedProdutor])

  const loadProdutores = async () => {
    const { data } = await supabase
      .from('fornecedores')
      .select('id, nome')
      .eq('empresa_id', empresa?.id)
      .order('nome')
    if (data) setProdutores(data)
  }

  const loadMovimentos = async () => {
    const { data } = await supabase
      .from('conta_corrente_produtor' as any)
      .select('*, safras(nome_safra)')
      .eq('produtor_id', selectedProdutor)
      .order('data_movimento', { ascending: true })
      .order('created_at', { ascending: true })

    if (data) {
      let calcSaldo = 0
      const processed = data.map((m) => {
        if (m.tipo_movimento === 'entrega') calcSaldo += Number(m.valor)
        else calcSaldo -= Number(m.valor) // adiantamento, pagamento, desconto
        return { ...m, saldo: calcSaldo }
      })
      setMovimentos(processed)
      setSaldoFinal(calcSaldo)
    }
  }

  const handleSave = async () => {
    if (!formData.descricao || !formData.valor || !formData.tipo_movimento) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    const { error } = await supabase.from('conta_corrente_produtor' as any).insert({
      empresa_id: empresa?.id,
      produtor_id: selectedProdutor,
      ...formData,
    })

    if (error) toast.error('Erro ao salvar')
    else {
      toast.success('Movimento registrado')
      setOpen(false)
      loadMovimentos()
      setFormData({
        tipo_movimento: 'adiantamento',
        data_movimento: new Date().toISOString().split('T')[0],
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conta Corrente do Produtor</h1>
          <p className="text-muted-foreground">Extrato de entregas, adiantamentos e acertos.</p>
        </div>
      </div>

      <div className="bg-card border p-4 rounded-lg flex items-end gap-4">
        <div className="space-y-2 flex-1 max-w-md">
          <Label>Selecione o Produtor</Label>
          <Select value={selectedProdutor} onValueChange={setSelectedProdutor}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {produtores.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProdutor && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo Movimento
          </Button>
        )}
      </div>

      {selectedProdutor && (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
            <h3 className="font-semibold">Extrato</h3>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Saldo Final:</span>
              <div
                className={`text-xl font-bold ${saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  saldoFinal,
                )}
              </div>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 font-medium">Data</th>
                <th className="p-3 font-medium">Descrição</th>
                <th className="p-3 font-medium">Tipo</th>
                <th className="p-3 font-medium text-right">Crédito (Entrega)</th>
                <th className="p-3 font-medium text-right">Débito (Adto/Pag)</th>
                <th className="p-3 font-medium text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movimentos.map((m) => (
                <tr key={m.id} className="hover:bg-muted/50">
                  <td className="p-3">{format(new Date(m.data_movimento), 'dd/MM/yyyy')}</td>
                  <td className="p-3">
                    {m.descricao} {m.safras ? `(${m.safras.nome_safra})` : ''}
                  </td>
                  <td className="p-3 capitalize">{m.tipo_movimento}</td>
                  <td className="p-3 text-right text-green-600">
                    {m.tipo_movimento === 'entrega'
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(m.valor)
                      : '-'}
                  </td>
                  <td className="p-3 text-right text-red-600">
                    {m.tipo_movimento !== 'entrega'
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(m.valor)
                      : '-'}
                  </td>
                  <td className="p-3 text-right font-medium border-l border-muted">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      m.saldo,
                    )}
                  </td>
                </tr>
              ))}
              {movimentos.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhum movimento registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.data_movimento}
                  onChange={(e) => setFormData({ ...formData, data_movimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo_movimento}
                  onValueChange={(val) => setFormData({ ...formData, tipo_movimento: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrega">Entrega de Produto (Crédito)</SelectItem>
                    <SelectItem value="adiantamento">Adiantamento (Débito)</SelectItem>
                    <SelectItem value="pagamento">Pagamento Final (Débito)</SelectItem>
                    <SelectItem value="desconto">Desconto (Débito)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Motivo/Produto"
              />
            </div>
            <div className="space-y-2">
              <Label>Valor (BRL)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.valor || ''}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
