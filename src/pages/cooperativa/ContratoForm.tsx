import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmpresa } from '@/hooks/use-empresa'
import { cooperativaService } from '@/services/cooperativa'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const formSchema = z.object({
  fornecedor_id: z.string().min(1, 'Cooperado é obrigatório'),
  safra_id: z.string().min(1, 'Safra é obrigatória'),
  talhao_id: z.string().optional().nullable(),
  percentual_participacao: z.coerce.number().min(0).max(100),
})

export default function ContratoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()

  const [loading, setLoading] = useState(false)
  const [cooperados, setCooperados] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { percentual_participacao: 0, talhao_id: 'none' },
  })

  useEffect(() => {
    if (empresa) {
      cooperativaService.getCooperados(empresa.id).then(setCooperados)
      supabase
        .from('safras')
        .select('id, nome_safra, codigo_safra')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null)
        .then(({ data }) => setSafras(data || []))
      supabase
        .from('talhoes')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null)
        .then(({ data }) => setTalhoes(data || []))

      if (id && id !== 'novo') {
        cooperativaService.getContrato(id).then((data) => {
          reset({
            fornecedor_id: data.fornecedor_id,
            safra_id: data.safra_id,
            talhao_id: data.talhao_id || 'none',
            percentual_participacao: data.percentual_participacao,
          })
        })
      }
    }
  }, [empresa, id])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!empresa) return
    setLoading(true)
    try {
      await cooperativaService.saveContrato({
        id: id !== 'novo' ? id : undefined,
        empresa_id: empresa.id,
        fornecedor_id: data.fornecedor_id,
        safra_id: data.safra_id,
        talhao_id: data.talhao_id === 'none' ? null : data.talhao_id,
        percentual_participacao: data.percentual_participacao,
      })
      toast.success('Contrato salvo com sucesso')
      navigate('/app/cooperativa/contratos')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/cooperativa/contratos')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id === 'novo' ? 'Novo Contrato de Cooperação' : 'Editar Contrato'}
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Cooperado *</Label>
              <Select
                value={watch('fornecedor_id')}
                onValueChange={(v) => setValue('fornecedor_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {cooperados.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fornecedor_id && (
                <p className="text-sm text-destructive">{errors.fornecedor_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Safra *</Label>
                <Select value={watch('safra_id')} onValueChange={(v) => setValue('safra_id', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {safras.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome_safra || s.codigo_safra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.safra_id && (
                  <p className="text-sm text-destructive">{errors.safra_id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Talhão Específico</Label>
                <Select
                  value={watch('talhao_id') || 'none'}
                  onValueChange={(v) => setValue('talhao_id', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos (Geral)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Todos (Geral)</SelectItem>
                    {talhoes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Percentual de Participação (%) *</Label>
              <Input
                type="number"
                step="0.0001"
                {...register('percentual_participacao')}
                placeholder="Ex: 15.5000"
              />
              {errors.percentual_participacao && (
                <p className="text-sm text-destructive">{errors.percentual_participacao.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Precisão de até 4 casas decimais para rateio.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" /> Salvar Contrato
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
