import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'

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
import { toast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { lotesMudasService } from '@/services/lotes-mudas'
import { supabase } from '@/lib/supabase/client'

const schema = z.object({
  nome_lote: z.string().min(1, 'Nome do lote é obrigatório'),
  estufa_id: z.string().optional().nullable(),
  cultura_id: z.string().optional().nullable(),
  cultivar_id: z.string().optional().nullable(),
  quantidade_mudas: z.coerce.number().min(0, 'A quantidade deve ser maior ou igual a zero'),
  quantidade_viva: z.coerce.number().min(0, 'A quantidade deve ser maior ou igual a zero'),
  data_semeadura: z.string().optional().nullable(),
  data_prevista_transplantio: z.string().optional().nullable(),
  custo_total: z.coerce.number().min(0, 'O custo deve ser maior ou igual a zero'),
  status: z.string(),
  observacoes: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

export default function LotesMudasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [estufas, setEstufas] = useState<any[]>([])
  const [culturas, setCulturas] = useState<any[]>([])
  const [cultivares, setCultivares] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'germinando',
      quantidade_mudas: 0,
      quantidade_viva: 0,
      custo_total: 0,
    },
  })

  const watchCultura = watch('cultura_id')
  const watchQtdMudas = watch('quantidade_mudas') || 0
  const watchCustoTotal = watch('custo_total') || 0

  const custoPorMuda = watchQtdMudas > 0 ? watchCustoTotal / watchQtdMudas : 0

  useEffect(() => {
    if (empresa?.id) {
      loadDependencies()
      if (id) {
        loadLote()
      }
    }
  }, [id, empresa?.id])

  useEffect(() => {
    if (watchCultura && empresa?.id) {
      loadCultivares(watchCultura)
    } else {
      setCultivares([])
    }
  }, [watchCultura, empresa?.id])

  const loadDependencies = async () => {
    const [resEstufas, resCulturas] = await Promise.all([
      supabase
        .from('estufas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
      supabase
        .from('culturas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
    ])
    if (resEstufas.data) setEstufas(resEstufas.data)
    if (resCulturas.data) setCulturas(resCulturas.data)
  }

  const loadCultivares = async (culturaId: string) => {
    const { data } = await supabase
      .from('cultivares')
      .select('id, nome')
      .eq('empresa_id', empresa!.id)
      .eq('cultura_id', culturaId)
      .is('deleted_at', null)
    if (data) setCultivares(data)
  }

  const loadLote = async () => {
    try {
      const data = await lotesMudasService.getById(id!, empresa!.id)
      Object.keys(data).forEach((key) => {
        if (key in schema.shape) {
          setValue(
            key as keyof FormData,
            data[key as keyof typeof data] === null ? '' : (data[key as keyof typeof data] as any),
          )
        }
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o lote',
        variant: 'destructive',
      })
      navigate('/app/mudas')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const payload = {
        ...data,
        empresa_id: empresa!.id,
        estufa_id: data.estufa_id || null,
        cultura_id: data.cultura_id || null,
        cultivar_id: data.cultivar_id || null,
        data_semeadura: data.data_semeadura || null,
        data_prevista_transplantio: data.data_prevista_transplantio || null,
      }

      if (id) {
        await lotesMudasService.update(id, payload)
        toast({ title: 'Sucesso', description: 'Lote atualizado com sucesso' })
      } else {
        await lotesMudasService.create(payload)
        toast({ title: 'Sucesso', description: 'Lote criado com sucesso' })
      }
      navigate('/app/mudas')
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/mudas')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Lote de Mudas' : 'Novo Lote de Mudas'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 rounded-lg border shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome_lote">Identificação do Lote</Label>
            <Input id="nome_lote" {...register('nome_lote')} placeholder="Ex: LOTE-TOMATE-001" />
            {errors.nome_lote && (
              <p className="text-sm text-destructive">{errors.nome_lote.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={watch('status')} onValueChange={(value) => setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="germinando">Germinando</SelectItem>
                <SelectItem value="em_desenvolvimento">Em Desenvolvimento</SelectItem>
                <SelectItem value="pronto">Pronto para Transplantio</SelectItem>
                <SelectItem value="transplantado">Transplantado</SelectItem>
                <SelectItem value="descartado">Descartado</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estufa_id">Estufa / Viveiro</Label>
            <Select
              value={watch('estufa_id') || ''}
              onValueChange={(value) => setValue('estufa_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a estufa" />
              </SelectTrigger>
              <SelectContent>
                {estufas.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cultura_id">Cultura</Label>
            <Select
              value={watch('cultura_id') || ''}
              onValueChange={(value) => {
                setValue('cultura_id', value)
                setValue('cultivar_id', '')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cultura" />
              </SelectTrigger>
              <SelectContent>
                {culturas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cultivar_id">Cultivar</Label>
            <Select
              value={watch('cultivar_id') || ''}
              onValueChange={(value) => setValue('cultivar_id', value)}
              disabled={!watchCultura}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cultivar" />
              </SelectTrigger>
              <SelectContent>
                {cultivares.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 hidden md:block"></div>

          <div className="space-y-2">
            <Label htmlFor="data_semeadura">Data Semeadura</Label>
            <Input id="data_semeadura" type="date" {...register('data_semeadura')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_prevista_transplantio">Data Prevista Transplantio</Label>
            <Input
              id="data_prevista_transplantio"
              type="date"
              {...register('data_prevista_transplantio')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade_mudas">Quantidade Inicial (Sementes)</Label>
            <Input id="quantidade_mudas" type="number" {...register('quantidade_mudas')} />
            {errors.quantidade_mudas && (
              <p className="text-sm text-destructive">{errors.quantidade_mudas.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade_viva">Quantidade Viva Atual</Label>
            <Input id="quantidade_viva" type="number" {...register('quantidade_viva')} />
            {errors.quantidade_viva && (
              <p className="text-sm text-destructive">{errors.quantidade_viva.message}</p>
            )}
          </div>

          <div className="space-y-2 bg-muted/50 p-4 rounded-md border md:col-span-2">
            <Label htmlFor="custo_total">Custo Total Acumulado (R$)</Label>
            <Input
              id="custo_total"
              type="number"
              step="0.01"
              {...register('custo_total')}
              className="max-w-xs bg-background"
            />
            <p className="text-sm font-medium text-primary mt-2 flex items-center">
              Custo por muda calculado:{' '}
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                custoPorMuda,
              )}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register('observacoes')}
            rows={4}
            placeholder="Anotações sobre pragas, adubação, etc."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/app/mudas')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
