import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export function PragasModal({
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
    data_monitoramento: '',
    praga_identificada: '',
    nivel_infestacao: '',
    acao_recomendada: '',
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('monitoramento_pragas').insert({
      empresa_id: safra.empresa_id,
      talhao_id: safra.talhao_id,
      ...data,
    })
    setLoading(false)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Monitoramento salvo com sucesso' })
      onOpenChange(false)
      setData({
        data_monitoramento: '',
        praga_identificada: '',
        nivel_infestacao: '',
        acao_recomendada: '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro de Monitoramento de Pragas</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Data do Monitoramento *</Label>
            <Input
              type="date"
              required
              value={data.data_monitoramento}
              onChange={(e) => setData({ ...data, data_monitoramento: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Praga Identificada *</Label>
            <Input
              required
              value={data.praga_identificada}
              onChange={(e) => setData({ ...data, praga_identificada: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Nível de Infestação *</Label>
            <Select
              value={data.nivel_infestacao}
              onValueChange={(v) => setData({ ...data, nivel_infestacao: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixo">Baixo</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ação Recomendada</Label>
            <Textarea
              value={data.acao_recomendada}
              onChange={(e) => setData({ ...data, acao_recomendada: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Monitoramento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
