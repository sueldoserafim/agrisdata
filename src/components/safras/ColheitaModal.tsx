import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export function ColheitaModal({
  open,
  onOpenChange,
  safra,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  safra: any
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    data_colheita: '',
    quantidade_colhida_kg: '',
    qualidade_visual: '',
    observacoes: '',
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('colheita_registros').insert({
      empresa_id: safra.empresa_id,
      safra_id: safra.id,
      data_colheita: data.data_colheita,
      quantidade_colhida_kg: Number(data.quantidade_colhida_kg),
      qualidade_visual: data.qualidade_visual,
      observacoes: data.observacoes,
    })
    setLoading(false)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Registro de colheita salvo com sucesso' })
      onOpenChange(false)
      setData({
        data_colheita: '',
        quantidade_colhida_kg: '',
        qualidade_visual: '',
        observacoes: '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Registro de Colheita</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Data da Colheita *</Label>
            <Input
              type="date"
              required
              value={data.data_colheita}
              onChange={(e) => setData({ ...data, data_colheita: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Quantidade Colhida (kg) *</Label>
            <Input
              type="number"
              step="0.01"
              required
              value={data.quantidade_colhida_kg}
              onChange={(e) => setData({ ...data, quantidade_colhida_kg: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Qualidade Visual (opcional)</Label>
            <Input
              value={data.qualidade_visual}
              onChange={(e) => setData({ ...data, qualidade_visual: e.target.value })}
              placeholder="Ex: Excelente, Frutos pequenos..."
            />
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={data.observacoes}
              onChange={(e) => setData({ ...data, observacoes: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
