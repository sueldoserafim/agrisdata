import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function PortalCotacaoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [preco, setPreco] = useState('')
  const [prazo, setPrazo] = useState('')
  const [condicao, setCondicao] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    setLoading(true)
    try {
      const { data: item, error } = await supabase
        .from('compras_cotacao_fornecedores' as any)
        .select(`
          *,
          cotacao:compras_cotacoes (
            *,
            requisicao:compras_requisicao (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setData(item)
      setPreco(item.preco_unitario?.toString() || '')
      setPrazo(item.prazo_entrega_dias?.toString() || '')
      setCondicao(item.condicao_pagamento || '')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('compras_cotacao_fornecedores' as any)
        .update({
          preco_unitario: Number(preco),
          prazo_entrega_dias: Number(prazo),
          condicao_pagamento: condicao,
        })
        .eq('id', id)

      if (error) throw error
      toast({ title: 'Proposta salva com sucesso!' })
      navigate('/portal-fornecedor/cotacoes')
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (!data) return <div className="p-8 text-center text-destructive">Não encontrado.</div>

  const isFechada = data.cotacao.status !== 'aberta'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/portal-fornecedor/cotacoes')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold">Detalhes da Cotação</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="font-semibold block">Requisição:</span>
              <span className="text-muted-foreground">
                {data.cotacao.requisicao?.numero_requisicao || '-'}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Justificativa / Observações:</span>
              <span className="text-muted-foreground">
                {data.cotacao.requisicao?.justificativa || '-'}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Prazo para Resposta:</span>
              <span className="text-muted-foreground">
                {new Date(data.cotacao.prazo_respostas).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Status Atual:</span>
              <span className="text-muted-foreground">{data.cotacao.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sua Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Preço Unitário (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  disabled={isFechada}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo de Entrega (Dias)</Label>
                <Input
                  type="number"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  disabled={isFechada}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Condição de Pagamento</Label>
                <Input
                  value={condicao}
                  onChange={(e) => setCondicao(e.target.value)}
                  disabled={isFechada}
                  placeholder="Ex: 30 dias"
                />
              </div>

              {!isFechada && (
                <div className="pt-4">
                  <Button type="submit" disabled={saving} className="w-full">
                    <Save className="w-4 h-4 mr-2" /> Enviar Proposta
                  </Button>
                </div>
              )}
              {isFechada && (
                <div className="pt-4 text-center text-sm text-destructive font-medium">
                  Cotação encerrada. Não é possível alterar a proposta.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
