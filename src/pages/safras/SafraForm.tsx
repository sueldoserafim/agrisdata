import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { differenceInDays } from 'date-fns'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

const schema = z
  .object({
    nome_safra: z.string().min(3).max(150),
    codigo_safra: z.string().optional(),
    talhao_id: z.string().min(1),
    cultura_id: z.string().min(1),
    cultivar_id: z.string().min(1),
    data_plantio: z.string().min(1),
    data_colheita_prevista: z.string().min(1),
    area_planejada_ha: z.coerce.number().positive(),
    densidade_plantio: z.coerce.number().optional().or(z.literal('')),
    produtividade_planejada: z.coerce.number().optional().or(z.literal('')),
    meta_producao_kg: z.coerce.number().optional().or(z.literal('')),
    orcamento_total: z.coerce.number().optional().or(z.literal('')),
  })
  .refine((d) => new Date(d.data_colheita_prevista) > new Date(d.data_plantio), {
    message: 'Inválida',
    path: ['data_colheita_prevista'],
  })

export default function SafraForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [dataSources, setSources] = useState({
    talhoes: [] as any[],
    culturas: [] as any[],
    cultivares: [] as any[],
  })
  const [soloAnalysis, setSoloAnalysis] = useState<any>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo_safra: `SAFRA-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    },
  })

  const [wTalhaoId, wCulturaId, wCultivarId, wArea, wProd] = watch([
    'talhao_id',
    'cultura_id',
    'cultivar_id',
    'area_planejada_ha',
    'produtividade_planejada',
  ])

  useEffect(() => {
    if (wArea && wProd) setValue('meta_producao_kg', Number((wArea * Number(wProd)).toFixed(2)))
  }, [wArea, wProd, setValue])

  useEffect(() => {
    if (!empresa?.id) return
    Promise.all([
      supabase
        .from('talhoes')
        .select('*, fazendas(nome)')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null),
      supabase.from('culturas').select('*').eq('empresa_id', empresa.id).is('deleted_at', null),
      supabase.from('cultivares').select('*').eq('empresa_id', empresa.id).is('deleted_at', null),
    ]).then(([t, c, cv]) =>
      setSources({ talhoes: t.data || [], culturas: c.data || [], cultivares: cv.data || [] }),
    )
  }, [empresa?.id])

  useEffect(() => {
    if (wTalhaoId)
      supabase
        .from('analises_solo')
        .select('*')
        .eq('talhao_id', wTalhaoId)
        .order('data_coleta', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => setSoloAnalysis(data))
    else setSoloAnalysis(null)
  }, [wTalhaoId])

  useEffect(() => {
    if (id && empresa?.id)
      supabase
        .from('safras')
        .select('*, cultivares(cultura_id)')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) {
            const culturaId = (data.cultivares as any)?.cultura_id
            if (culturaId) setValue('cultura_id', culturaId)

            Object.keys(data).forEach((k) => {
              if (k in schema.shape && k !== 'cultura_id') {
                setValue(k as keyof z.infer<typeof schema>, data[k as keyof typeof data] || '')
              }
            })
          }
        })
  }, [id, empresa?.id, setValue])

  const selectedT = dataSources.talhoes.find((t) => t.id === wTalhaoId)
  const selectedC = dataSources.culturas.find((c) => c.id === wCulturaId)
  const selectedCv = dataSources.cultivares.find((c) => c.id === wCultivarId)

  useEffect(() => {
    if (selectedCv && !wProd)
      setValue('produtividade_planejada', (selectedCv.produtividade_esperada_t_ha || 0) * 1000)
  }, [selectedCv, setValue, wProd])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (selectedT?.area_plantavel_ha && data.area_planejada_ha > selectedT.area_plantavel_ha) {
      return toast({
        title: 'Aviso',
        description: 'Área excede a área plantável',
        variant: 'destructive',
      })
    }
    setLoading(true)
    const { cultura_id, ...restData } = data

    const payload = {
      ...restData,
      empresa_id: empresa!.id,
      densidade_plantio: data.densidade_plantio || null,
      produtividade_planejada: data.produtividade_planejada || null,
      meta_producao_kg: data.meta_producao_kg || null,
      orcamento_total: data.orcamento_total || null,
    }
    const { error } = id
      ? await supabase.from('safras').update(payload).eq('id', id)
      : await supabase.from('safras').insert(payload)
    setLoading(false)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso' })
      navigate('/app/safras')
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{id ? 'Editar Safra' : 'Nova Safra'}</h1>
        <Button variant="outline" onClick={() => navigate('/app/safras')}>
          Cancelar
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input disabled {...register('codigo_safra')} placeholder="Código da Safra" />
            <Input {...register('nome_safra')} placeholder="Nome da Safra *" />
            <Select
              value={wTalhaoId}
              onValueChange={(v) => {
                setValue('talhao_id', v)
                const talhao = dataSources.talhoes.find((t) => t.id === v)
                setValue('area_planejada_ha', talhao?.area_plantavel_ha || ('' as any), {
                  shouldValidate: true,
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Talhão *" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.talhoes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input disabled value={selectedT?.fazendas?.nome || 'Fazenda (Automático)'} />
            <Select
              value={wCulturaId}
              onValueChange={(v) => {
                setValue('cultura_id', v)
                setValue('cultivar_id', '')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cultura *" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.culturas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              disabled={!wCulturaId}
              value={wCultivarId}
              onValueChange={(v) => setValue('cultivar_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cultivar *" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.cultivares
                  .filter((c) => c.cultura_id === wCulturaId)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datas e Dimensionamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Plantio *</Label>
                <Input type="date" {...register('data_plantio')} />
              </div>
              <div className="space-y-1">
                <Label>Colheita *</Label>
                <Input type="date" {...register('data_colheita_prevista')} />
              </div>
              <div className="space-y-1">
                <Label>Área (ha) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('area_planejada_ha')}
                  placeholder={`Máx: ${selectedT?.area_plantavel_ha || 0}`}
                />
              </div>
              <div className="space-y-1">
                <Label>Densidade (pl/ha)</Label>
                <Input type="number" {...register('densidade_plantio')} />
              </div>
              <div className="space-y-1">
                <Label>Produtividade (kg/ha)</Label>
                <Input type="number" step="0.01" {...register('produtividade_planejada')} />
              </div>
              <div className="space-y-1">
                <Label>Meta (kg)</Label>
                <Input type="number" disabled {...register('meta_producao_kg')} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contexto Técnico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                step="0.01"
                {...register('orcamento_total')}
                placeholder="Orçamento Total (R$)"
              />
              <div className="p-4 bg-muted rounded text-sm flex gap-4">
                <span>
                  <b>GDA Base:</b> {selectedC?.temperatura_base_gda || 'N/A'}°C
                </span>
                <span>
                  <b>Shelf Life:</b> {selectedCv?.shelf_life_ideal_dias || 'N/A'} dias
                </span>
              </div>
              {soloAnalysis && (
                <div className="p-4 bg-muted border-l-4 border-primary rounded text-sm flex justify-between items-center">
                  <span>
                    Solo Recente: {new Date(soloAnalysis.data_coleta).toLocaleDateString()}
                  </span>
                  <Badge
                    variant={
                      differenceInDays(new Date(), new Date(soloAnalysis.data_coleta)) <= 365
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {differenceInDays(new Date(), new Date(soloAnalysis.data_coleta)) <= 365
                      ? 'Válida'
                      : 'Vencida'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Safra'}
          </Button>
        </div>
      </form>
    </div>
  )
}
