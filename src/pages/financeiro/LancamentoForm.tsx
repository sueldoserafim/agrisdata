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
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [centrosCusto, setCentrosCusto] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({
    tipo: 'despesa',
    status: 'pendente',
    valor: 0,
    data_lancamento: new Date().toISOString().split('T')[0],
    data_vencimento: new Date().toISOString().split('T')[0],
    parcela: 1,
    total_parcelas: 1,
  })

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      if (id) loadData()
    }
  }, [empresa, id])

  const loadDependencies = async () => {
    const [cRes, pRes, fRes, clRes, ccRes, iRes] = await Promise.all([
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
      supabase.from('fornecedores').select('id, nome').eq('empresa_id', empresa?.id),
      supabase.from('clientes').select('id, nome').eq('empresa_id', empresa?.id),
      supabase.from('centros_custo').select('id, nome').eq('empresa_id', empresa?.id),
      supabase
        .from('invoices_exportacao')
        .select('id, numero_invoice')
        .eq('empresa_id', empresa?.id),
    ])
    if (cRes.data) setContas(cRes.data)
    if (iRes.data) setInvoices(iRes.data)
    if (pRes.data) setPlanoContas(pRes.data)
    if (fRes.data) setFornecedores(fRes.data)
    if (clRes.data) setClientes(clRes.data)
    if (ccRes.data) setCentrosCusto(ccRes.data)
  }

  const loadData = async () => {
    const { data } = await supabase.from('financeiro_lancamentos').select('*').eq('id', id).single()
    if (data) {
      setFormData({
        ...data,
        data_lancamento: data.data_lancamento ? data.data_lancamento.split('T')[0] : '',
        data_vencimento: data.data_vencimento ? data.data_vencimento.split('T')[0] : '',
        data_pagamento: data.data_pagamento ? data.data_pagamento.split('T')[0] : '',
      })
    }
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

    if (formData.valor <= 0) {
      toast.error('O valor deve ser maior que zero')
      return
    }

    if (
      (formData.status === 'pago' || formData.status === 'recebido') &&
      formData.data_pagamento &&
      formData.data_pagamento < formData.data_lancamento
    ) {
      toast.error('Data de pagamento não pode ser anterior à data de lançamento')
      return
    }

    setLoading(true)

    const payload = {
      ...formData,
      empresa_id: empresa?.id,
      fornecedor_id: formData.fornecedor_id || null,
      cliente_id: formData.cliente_id || null,
      centro_custo_id: formData.centro_custo_id || null,
      invoice_id: formData.invoice_id || null,
    }

    if (payload.status === 'pago' || payload.status === 'recebido') {
      if (!payload.data_pagamento) {
        payload.data_pagamento = new Date().toISOString().split('T')[0]
      }
    } else {
      payload.data_pagamento = null
    }

    let err
    if (id) {
      const { error } = await supabase.from('financeiro_lancamentos').update(payload).eq('id', id)
      err = error
    } else {
      const { error } = await supabase.from('financeiro_lancamentos').insert(payload)
      err = error
    }

    setLoading(false)
    if (err) toast.error('Erro ao salvar lançamento: ' + err.message)
    else {
      toast.success('Lançamento salvo')
      navigate('/app/financeiro/lancamentos')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Pagamento de Fornecedor X"
            />
          </div>
          <div className="space-y-2">
            <Label>Nº Documento / Fatura</Label>
            <Input
              value={formData.documento || ''}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              placeholder="Ex: NF 1234"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Label>Data Lançamento</Label>
            <Input
              type="date"
              value={formData.data_lancamento || ''}
              onChange={(e) => setFormData({ ...formData, data_lancamento: e.target.value })}
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

        {(formData.status === 'pago' || formData.status === 'recebido') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data do Pagamento/Recebimento</Label>
              <Input
                type="date"
                value={formData.data_pagamento || ''}
                onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{formData.tipo === 'despesa' ? 'Fornecedor' : 'Cliente'}</Label>
            {formData.tipo === 'despesa' ? (
              <Select
                value={formData.fornecedor_id || 'none'}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    fornecedor_id: val === 'none' ? null : val,
                    cliente_id: null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {fornecedores.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={formData.cliente_id || 'none'}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    cliente_id: val === 'none' ? null : val,
                    fornecedor_id: null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label>Exportação (Invoice)</Label>
            <Select
              value={formData.invoice_id || 'none'}
              onValueChange={(val) =>
                setFormData({ ...formData, invoice_id: val === 'none' ? null : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione (Opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {invoices.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.numero_invoice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Centro de Custo</Label>
            <Select
              value={formData.centro_custo_id || 'none'}
              onValueChange={(val) =>
                setFormData({ ...formData, centro_custo_id: val === 'none' ? null : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione (Opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {centrosCusto.map((cc) => (
                  <SelectItem key={cc.id} value={cc.id}>
                    {cc.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Parcela</Label>
            <Input
              type="number"
              min={1}
              value={formData.parcela || 1}
              onChange={(e) => setFormData({ ...formData, parcela: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>De (Total)</Label>
            <Input
              type="number"
              min={1}
              value={formData.total_parcelas || 1}
              onChange={(e) => setFormData({ ...formData, total_parcelas: Number(e.target.value) })}
            />
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
