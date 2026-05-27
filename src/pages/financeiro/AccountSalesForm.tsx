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
import { ArrowLeft, Calculator } from 'lucide-react'

export default function AccountSalesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()

  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [containers, setContainers] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({
    data_venda: new Date().toISOString().split('T')[0],
    valor_bruto: 0,
    despesas_internacionais: 0,
    comissoes: 0,
    valor_liquido: 0,
    margem_percentual: 0,
    status: 'rascunho',
  })

  useEffect(() => {
    if (empresa) {
      supabase
        .from('invoices_exportacao')
        .select('id, numero_invoice')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setInvoices(data || []))

      supabase
        .from('containers')
        .select('id, numero_container')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setContainers(data || []))

      if (id) {
        supabase
          .from('account_sales' as any)
          .select('*')
          .eq('id', id)
          .single()
          .then(({ data }) => {
            if (data) setFormData(data)
          })
      }
    }
  }, [empresa, id])

  const calculateTotals = () => {
    const bruto = Number(formData.valor_bruto) || 0
    const despesas = Number(formData.despesas_internacionais) || 0
    const comissoes = Number(formData.comissoes) || 0

    const liquido = bruto - despesas - comissoes
    const margem = bruto > 0 ? (liquido / bruto) * 100 : 0

    setFormData({
      ...formData,
      valor_liquido: liquido,
      margem_percentual: margem,
    })
  }

  const handleSave = async () => {
    if (!formData.invoice_id) {
      toast.error('Selecione uma Invoice')
      return
    }
    if (formData.margem_percentual < 0) {
      toast.error('A margem percentual não pode ser negativa nesta apuração')
      return
    }

    setLoading(true)
    const payload = { ...formData, empresa_id: empresa?.id }

    let err
    if (id) {
      const { error } = await supabase
        .from('account_sales' as any)
        .update(payload)
        .eq('id', id)
      err = error
    } else {
      const { error } = await supabase.from('account_sales' as any).insert(payload)
      err = error
    }

    setLoading(false)
    if (err) toast.error('Erro ao salvar')
    else {
      toast.success('Account Sale salvo com sucesso')
      navigate('/app/financeiro/account-sales')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{id ? 'Editar Account Sale' : 'Novo Account Sale'}</h1>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Invoice de Exportação</Label>
            <Select
              value={formData.invoice_id || ''}
              onValueChange={(val) => setFormData({ ...formData, invoice_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.numero_invoice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Container Relacionado</Label>
            <Select
              value={formData.container_id || 'none'}
              onValueChange={(val) =>
                setFormData({ ...formData, container_id: val === 'none' ? null : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione (Opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {containers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.numero_container}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Fechamento</Label>
            <Input
              type="date"
              value={formData.data_venda || ''}
              onChange={(e) => setFormData({ ...formData, data_venda: e.target.value })}
            />
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
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="liquidado">Liquidado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 bg-muted/30 rounded border relative mt-4">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={calculateTotals}
          >
            <Calculator className="w-4 h-4 mr-2" /> Recalcular
          </Button>

          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="space-y-2">
              <Label>Valor Bruto Vendido (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.valor_bruto || ''}
                onChange={(e) => setFormData({ ...formData, valor_bruto: Number(e.target.value) })}
                onBlur={calculateTotals}
              />
            </div>
            <div className="space-y-2">
              <Label>Despesas no Destino (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.despesas_internacionais || ''}
                onChange={(e) =>
                  setFormData({ ...formData, despesas_internacionais: Number(e.target.value) })
                }
                onBlur={calculateTotals}
              />
            </div>
            <div className="space-y-2">
              <Label>Comissões (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.comissoes || ''}
                onChange={(e) => setFormData({ ...formData, comissoes: Number(e.target.value) })}
                onBlur={calculateTotals}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Valor Líquido Apurado (USD)</Label>
              <Input
                type="number"
                value={formData.valor_liquido?.toFixed(2) || ''}
                readOnly
                className="bg-muted font-bold text-green-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Percentual (%)</Label>
              <Input
                type="number"
                value={formData.margem_percentual?.toFixed(2) || ''}
                readOnly
                className="bg-muted font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Account Sale'}
          </Button>
        </div>
      </div>
    </div>
  )
}
