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

export default function AdiantamentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()

  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  const [formData, setFormData] = useState<any>({
    data_adiantamento: new Date().toISOString().split('T')[0],
    taxa_cambio: 1,
    valor_usd: 0,
    valor_brl: 0,
    status: 'pendente',
  })

  useEffect(() => {
    if (empresa) {
      supabase
        .from('clientes')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setClientes(data || []))

      supabase
        .from('invoices_exportacao')
        .select('id, numero_invoice')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setInvoices(data || []))

      if (id) {
        supabase
          .from('adiantamentos_internacionais' as any)
          .select('*')
          .eq('id', id)
          .single()
          .then(({ data }) => {
            if (data) setFormData(data)
          })
      }
    }
  }, [empresa, id])

  const handleValorUSD = (val: number) => {
    setFormData((prev: any) => ({ ...prev, valor_usd: val, valor_brl: val * prev.taxa_cambio }))
  }

  const handleTaxa = (val: number) => {
    setFormData((prev: any) => ({ ...prev, taxa_cambio: val, valor_brl: prev.valor_usd * val }))
  }

  const handleSave = async () => {
    if (!formData.numero_adiantamento || !formData.cliente_id || !formData.valor_usd) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    setLoading(true)
    const payload = { ...formData, empresa_id: empresa?.id }

    let err
    if (id) {
      const { error } = await supabase
        .from('adiantamentos_internacionais' as any)
        .update(payload)
        .eq('id', id)
      err = error
    } else {
      const { error } = await supabase.from('adiantamentos_internacionais' as any).insert(payload)
      err = error
    }

    setLoading(false)
    if (err) toast.error('Erro ao salvar adiantamento')
    else {
      toast.success('Adiantamento salvo')
      navigate('/app/financeiro/adiantamentos')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {id ? 'Editar Adiantamento' : 'Novo Adiantamento Internacional'}
        </h1>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nº de Referência / Contrato</Label>
            <Input
              value={formData.numero_adiantamento || ''}
              onChange={(e) => setFormData({ ...formData, numero_adiantamento: e.target.value })}
              placeholder="Ex: AD-2026-001"
            />
          </div>
          <div className="space-y-2">
            <Label>Data do Adiantamento</Label>
            <Input
              type="date"
              value={formData.data_adiantamento || ''}
              onChange={(e) => setFormData({ ...formData, data_adiantamento: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cliente Internacional</Label>
            <Select
              value={formData.cliente_id || ''}
              onValueChange={(val) => setFormData({ ...formData, cliente_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o importador" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Invoice de Exportação (Opcional)</Label>
            <Select
              value={formData.invoice_id || 'none'}
              onValueChange={(val) =>
                setFormData({ ...formData, invoice_id: val === 'none' ? null : val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Invoice" />
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
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded border">
          <div className="space-y-2">
            <Label>Valor Estrangeiro (Ex: USD)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor_usd || ''}
              onChange={(e) => handleValorUSD(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Taxa de Câmbio Acordada (BRL)</Label>
            <Input
              type="number"
              step="0.0001"
              value={formData.taxa_cambio || ''}
              onChange={(e) => handleTaxa(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Convertido (BRL)</Label>
            <Input
              type="number"
              value={formData.valor_brl?.toFixed(2) || ''}
              readOnly
              className="bg-muted font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Prevista para Reembolso (Embarque)</Label>
            <Input
              type="date"
              value={formData.data_prevista_reembolso || ''}
              onChange={(e) =>
                setFormData({ ...formData, data_prevista_reembolso: e.target.value })
              }
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
                <SelectItem value="pendente">Pendente de Embarque</SelectItem>
                <SelectItem value="parcial">Reembolsado Parcialmente</SelectItem>
                <SelectItem value="reembolsado">Totalmente Reembolsado/Vinculado</SelectItem>
                <SelectItem value="cancelado">Cancelado / Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Adiantamento'}
          </Button>
        </div>
      </div>
    </div>
  )
}
