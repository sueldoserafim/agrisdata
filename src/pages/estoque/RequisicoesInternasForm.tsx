import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reqInternasService } from '@/services/requisicoes-internas'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function RequisicoesInternasForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [empresaId, setEmpresaId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: '',
    justificativa: '',
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()
        if (profile && mounted) {
          setEmpresaId(profile.empresa_id)
          const { data: prods } = await supabase
            .from('produtos')
            .select('id, nome, unidade_medida')
            .eq('empresa_id', profile.empresa_id)
            .is('deleted_at', null)
            .order('nome')
          if (prods) setProdutos(prods)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresaId || !user) return
    if (!formData.produto_id || !formData.quantidade) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha os campos obrigatórios.',
      })
      return
    }

    setSubmitting(true)
    try {
      await reqInternasService.create({
        empresa_id: empresaId,
        solicitante_id: user.id,
        produto_id: formData.produto_id,
        quantidade: parseFloat(formData.quantidade),
        justificativa: formData.justificativa,
      })
      toast({ title: 'Sucesso', description: 'Requisição criada com sucesso.' })
      navigate('/app/estoque/requisicoes-internas')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao criar.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Carregando formulário...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nova Requisição Interna</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Requisição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Select
                value={formData.produto_id}
                onValueChange={(val) => setFormData({ ...formData, produto_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} ({p.unidade_medida || 'un'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                value={formData.justificativa}
                onChange={(e) => setFormData({ ...formData, justificativa: e.target.value })}
                placeholder="Descreva o motivo desta requisição..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/app/estoque/requisicoes-internas')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Criar Requisição'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
