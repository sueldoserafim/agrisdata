import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function LancamentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()

  const [loading, setLoading] = useState(false)
  const [contas, setContas] = useState<any[]>([])
  const [planoContas, setPlanoContas] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({
    tipo: 'despesa',
    status: 'pendente',
    valor: 0,
    data_lancamento: new Date().toISOString().split('T')[0],
    data_vencimento: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      if (id) loadData()
    }
  }, [empresa, id])

  const loadDependencies = async () => {
    const [cRes, pRes] = await Promise.all([
      supabase
        .from('contas_bancarias' as any)
        .select('id, nome_banco, moeda')
        .eq('empresa_id', empresa?.id)
        .eq('ativo', true),
      supabase
        .from('plano_contas' as any)
        .select('id, codigo, descricao')
        .eq('empresa_id', empresa?.id)
        .eq('natureza', 'analitica'),
    ])
    if (cRes.data) setContas(cRes.data)
    if (pRes.data) setPlanoContas(pRes.data)
  }

  const loadData = async () => {
    const { data } = await supabase.from('financeiro_lancamentos').select('*').eq('id', id).single()
    if (data) setFormData(data)
  }

  const handleSave = async () => {
    if (
      !formData.descricao ||
      !formData.valor ||
      !formData.conta_bancaria_id ||
      !formData.plano_conta_id
    ) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    setLoading(true)
    const payload = { ...formData, empresa_id: empresa?.id }

    let err
    if (id) {
      const { error } = await supabase.from('financeiro_lancamentos').update(payload).eq('id', id)
      err = error
    } else {
      const { error } = await supabase.from('financeiro_lancamentos').insert(payload)
      err = error
    }

    setLoading(false)
    if (err) toast.error('Erro ao salvar lançamento')
    else {
      toast.success('Lançamento salvo')
      navigate('/app/financeiro/lancamentos')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{id ? 'Editar Lançamento' : 'Novo Lançamento'}</h1>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
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
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value={formData.tipo === 'receita' ? 'recebido' : 'pago'}>
                  {formData.tipo === 'receita' ? 'Recebido' : 'Pago'}
                </SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input
            value={formData.descricao || ''}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Ex: Pagamento de Fornecedor X"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor || ''}
              onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Vencimento</Label>
            <Input
              type="date"
              value={formData.data_vencimento || ''}
              onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Conta Bancária</Label>
            <Select
              value={formData.conta_bancaria_id || ''}
              onValueChange={(val) => setFormData({ ...formData, conta_bancaria_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {contas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome_banco} ({c.moeda.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Categoria (Plano de Contas)</Label>
            <Select
              value={formData.plano_conta_id || ''}
              onValueChange={(val) => setFormData({ ...formData, plano_conta_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {planoContas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.codigo} - {p.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea
            value={formData.observacoes || ''}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
