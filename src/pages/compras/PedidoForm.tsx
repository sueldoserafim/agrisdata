import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle2, XCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { comprasService } from '@/services/compras'

export default function PedidoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    data_entrega_prevista: '',
    condicoes_pagamento: '',
    observacoes: '',
  })

  useEffect(() => {
    if (id) {
      loadPedido()
    }
  }, [id])

  async function loadPedido() {
    try {
      setLoading(true)
      const data = await comprasService.getPedido(id!)
      setPedido(data)
      setFormData({
        data_entrega_prevista: data.data_entrega_prevista || '',
        condicoes_pagamento: data.condicoes_pagamento || '',
        observacoes: data.observacoes || '',
      })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await comprasService.updatePedido(pedido.id, formData)
      toast({ title: 'Pedido atualizado com sucesso' })
      loadPedido()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleSendSupplier() {
    try {
      await comprasService.enviarEmail({
        to: pedido.fornecedor?.email || 'fornecedor@exemplo.com',
        subject: `Novo Pedido de Compra - ${pedido.id}`,
        body: `Você recebeu um novo pedido de compra. Verifique o anexo para mais detalhes.`,
      })
      toast({ title: 'Email enviado ao fornecedor com sucesso!' })
    } catch (err: any) {
      toast({ title: 'Erro ao enviar email', description: err.message, variant: 'destructive' })
    }
  }

  async function handleCancel() {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return
    try {
      await comprasService.updatePedido(pedido.id, { status: 'cancelado' })
      toast({ title: 'Pedido cancelado' })
      navigate('/app/compras/pedidos')
    } catch (err: any) {
      toast({ title: 'Erro ao cancelar', description: err.message, variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>
  if (!pedido) return <div className="p-8">Pedido não encontrado.</div>

  const isEditable = pedido.status === 'pendente'

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras/pedidos')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalhes do Pedido</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">ID: {pedido.id.split('-')[0]}</span>
              <Badge
                variant={
                  pedido.status === 'recebido'
                    ? 'default'
                    : pedido.status === 'cancelado'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {pedido.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditable && (
            <>
              <Button variant="outline" onClick={handleSendSupplier}>
                <Mail className="w-4 h-4 mr-2" /> Enviar Fornecedor
              </Button>
              <Button onClick={() => navigate(`/app/compras/recebimento/${pedido.id}`)}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Registrar Recebimento
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Fornecedor e Prazos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Fornecedor</Label>
                <div className="font-semibold">{pedido.fornecedor?.nome || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <Label>Data do Pedido</Label>
                <div className="font-semibold">
                  {pedido.data_pedido
                    ? new Date(pedido.data_pedido).toLocaleDateString()
                    : new Date(pedido.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Previsão de Entrega *</Label>
                <Input
                  type="date"
                  value={formData.data_entrega_prevista}
                  onChange={(e) =>
                    setFormData({ ...formData, data_entrega_prevista: e.target.value })
                  }
                  disabled={!isEditable}
                />
              </div>
              <div className="space-y-2">
                <Label>Condições de Pagamento</Label>
                <Input
                  value={formData.condicoes_pagamento}
                  onChange={(e) =>
                    setFormData({ ...formData, condicoes_pagamento: e.target.value })
                  }
                  placeholder="Ex: 30 dias líquidos"
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Notas adicionais para o fornecedor ou recebimento..."
                disabled={!isEditable}
              />
            </div>

            {isEditable && (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  Salvar Alterações
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="w-8 h-8 text-primary mt-1" />
              <div>
                <p className="font-bold">{pedido.produto?.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Qtd: {pedido.quantidade} {pedido.produto?.unidade_medida}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor Unit: R$ {pedido.preco_unitario?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
              <span>Total Geral</span>
              <span>
                R${' '}
                {pedido.total_pedido
                  ? pedido.total_pedido.toFixed(2)
                  : (pedido.preco_unitario * pedido.quantidade).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
