import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EquipamentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    data_aquisicao: '',
    valor_aquisicao: '',
  })

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const loadData = async () => {
    const { data } = await supabase.from('equipamentos').select('*').eq('id', id).single()
    if (data) {
      setFormData({
        nome: data.nome || '',
        tipo: data.tipo || '',
        data_aquisicao: data.data_aquisicao || '',
        valor_aquisicao: data.valor_aquisicao?.toString() || '',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa) return
    setLoading(true)

    const payload = {
      empresa_id: empresa.id,
      nome: formData.nome,
      tipo: formData.tipo,
      data_aquisicao: formData.data_aquisicao || null,
      valor_aquisicao: formData.valor_aquisicao ? parseFloat(formData.valor_aquisicao) : null,
    }

    const request = id
      ? supabase.from('equipamentos').update(payload).eq('id', id)
      : supabase.from('equipamentos').insert([payload])

    const { error } = await request

    setLoading(false)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Equipamento salvo com sucesso' })
      navigate('/app/equipamentos')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>{id ? 'Editar Equipamento' : 'Novo Equipamento'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome / Modelo</Label>
              <Input
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Trator John Deere 6100J"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo (Trator, Colheitadeira, Implemento, etc)</Label>
              <Input
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                placeholder="Ex: Trator"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Aquisição</Label>
                <Input
                  type="date"
                  value={formData.data_aquisicao}
                  onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor de Aquisição (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valor_aquisicao}
                  onChange={(e) => setFormData({ ...formData, valor_aquisicao: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
