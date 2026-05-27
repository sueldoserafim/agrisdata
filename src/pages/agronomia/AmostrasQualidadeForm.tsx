import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, UploadCloud, Trash2 } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { HelpTooltip } from '@/components/HelpTooltip'
import { HelpPopover } from '@/components/HelpPopover'
import { useEmpresa } from '@/hooks/use-empresa'
import {
  getAmostraQualidade,
  saveAmostraQualidade,
  uploadAmostraFoto,
} from '@/services/amostras-qualidade'
import { supabase } from '@/lib/supabase/client'

const formSchema = z.object({
  safra_id: z.string().min(1, 'Safra é obrigatória'),
  talhao_id: z.string().min(1, 'Talhão é obrigatório'),
  data_coleta: z.string().min(1, 'Data de coleta é obrigatória'),
  estagio_fenologico: z.string().optional(),
  tamanho_amostra_frutos: z.number({ required_error: 'Obrigatório' }).min(1, 'No mínimo 1 fruto'),

  brix_minimo: z.number().optional(),
  brix_medio: z.number({ required_error: 'Obrigatório' }).min(0, 'Não pode ser negativo'),
  brix_maximo: z.number().optional(),
  acidez_titulavel: z.number().optional(),
  ratio_brix_acidez: z.number().optional(),

  firmeza_media: z.number().optional(),
  coloracao_escala: z.number().min(1, 'Mínimo 1').max(9, 'Máximo 9').optional(),
  peso_medio_fruto: z.number().optional(),
  defeitos_percentual: z.number().min(0, 'Mínimo 0').max(100, 'Máximo 100').optional(),

  apto_colheita: z.boolean().default(false),
  data_estimada_colheita: z.string().optional().nullable(),
  fotos: z.array(z.string()).default([]),
  observacoes: z.string().optional(),
})

export default function AmostrasQualidadeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [safras, setSafras] = useState<any[]>([])
  const [phenologies, setPhenologies] = useState<any[]>([])
  const [uploadingFotos, setUploadingFotos] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_coleta: format(new Date(), 'yyyy-MM-dd'),
      tamanho_amostra_frutos: 10,
      fotos: [],
      apto_colheita: false,
    },
  })

  const watchSafraId = form.watch('safra_id')
  const watchDataColeta = form.watch('data_coleta')
  const watchBrixMedio = form.watch('brix_medio')
  const watchAcidez = form.watch('acidez_titulavel')
  const watchFotos = form.watch('fotos')

  useEffect(() => {
    if (empresa?.id) {
      loadDependencies()
      if (id) loadAmostra()
    }
  }, [empresa?.id, id])

  const loadDependencies = async () => {
    const [resSafras, resPheno] = await Promise.all([
      supabase
        .from('safras')
        .select(
          'id, nome_safra, codigo_safra, data_plantio, talhao_id, talhoes(nome), cultivares(id, cultura_id, gda_objetivo_colheita, culturas(id, brix_minimo_ideal))',
        )
        .eq('empresa_id', empresa!.id),
      supabase
        .from('culturas_fenologia')
        .select('*')
        .eq('empresa_id', empresa!.id)
        .order('dias_desde_plantio', { ascending: false }),
    ])
    if (resSafras.data) setSafras(resSafras.data)
    if (resPheno.data) setPhenologies(resPheno.data)
  }

  const loadAmostra = async () => {
    try {
      const data = await getAmostraQualidade(id!)
      form.reset({
        ...data,
        data_estimada_colheita: data.data_estimada_colheita
          ? format(new Date(data.data_estimada_colheita + 'T00:00:00'), 'yyyy-MM-dd')
          : null,
      })
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar amostra', variant: 'destructive' })
      navigate('/app/agronomia/amostras-qualidade')
    }
  }

  // Update Talhão when Safra changes
  useEffect(() => {
    if (watchSafraId && safras.length) {
      const safra = safras.find((s) => s.id === watchSafraId)
      if (safra) form.setValue('talhao_id', safra.talhao_id)
    }
  }, [watchSafraId, safras])

  // Phenology Calc
  useEffect(() => {
    if (watchSafraId && watchDataColeta && safras.length && phenologies.length) {
      const safra = safras.find((s) => s.id === watchSafraId)
      if (safra && safra.data_plantio) {
        const diffDays = differenceInDays(new Date(watchDataColeta), new Date(safra.data_plantio))
        const culturaId = safra.cultivares?.cultura_id
        if (culturaId) {
          const fenosCultura = phenologies.filter((p) => p.cultura_id === culturaId)
          const stage = fenosCultura.find((p) => p.dias_desde_plantio <= diffDays)
          form.setValue('estagio_fenologico', stage ? stage.estagio : 'Estágio não identificado')
        }
      }
    }
  }, [watchSafraId, watchDataColeta, safras, phenologies])

  // Ratio Calc
  useEffect(() => {
    if (watchBrixMedio && watchAcidez && watchAcidez > 0) {
      form.setValue('ratio_brix_acidez', Number((watchBrixMedio / watchAcidez).toFixed(2)))
    } else {
      form.setValue('ratio_brix_acidez', undefined)
    }
  }, [watchBrixMedio, watchAcidez])

  const selectedSafra = safras.find((s) => s.id === watchSafraId)
  const brixMinimoIdeal = selectedSafra?.cultivares?.culturas?.brix_minimo_ideal
  const meetsBrixCriteria =
    watchBrixMedio !== undefined &&
    brixMinimoIdeal !== undefined &&
    watchBrixMedio >= brixMinimoIdeal

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploadingFotos(true)
    try {
      const urls = await Promise.all(files.map((file) => uploadAmostraFoto(empresa!.id, file)))
      const validUrls = urls.filter(Boolean) as string[]
      form.setValue('fotos', [...watchFotos, ...validUrls])
      toast({ title: 'Sucesso', description: `${validUrls.length} foto(s) enviada(s)` })
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao subir imagens', variant: 'destructive' })
    } finally {
      setUploadingFotos(false)
      if (e.target) e.target.value = ''
    }
  }

  const removePhoto = (index: number) => {
    const updated = [...watchFotos]
    updated.splice(index, 1)
    form.setValue('fotos', updated)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      await saveAmostraQualidade({
        ...data,
        id,
        empresa_id: empresa!.id,
      })
      toast({ title: 'Sucesso', description: 'Amostra salva com sucesso' })
      navigate('/app/agronomia/amostras-qualidade')
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao salvar',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/app/agronomia/amostras-qualidade')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? 'Editar Amostra' : 'Nova Amostra de Qualidade'}
          </h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          {loading ? (
            'Salvando...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IDENTIFICAÇÃO */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Identificação da Amostra</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="safra_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safra</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a safra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {safras.map((safra) => (
                            <SelectItem key={safra.id} value={safra.id}>
                              {safra.nome_safra || safra.codigo_safra} ({safra.talhoes?.nome})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_coleta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Coleta</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estagio_fenologico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estágio Fenológico (Automático)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tamanho_amostra_frutos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Tamanho da Amostra (frutos)
                        <HelpTooltip content="Quantidade de frutos coletados para formar a média desta amostra representativa." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* BRIX E QUÍMICOS */}
            <Card>
              <CardHeader>
                <CardTitle>Brix & Parâmetros Químicos</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brix_minimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brix Mínimo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brix_medio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center">
                        Brix Médio *
                        <HelpTooltip content="Grau Brix (ºBx) indica o teor aproximado de sólidos solúveis, principalmente açúcares, no suco da fruta." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brix_maximo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brix Máximo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acidez_titulavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acidez Titulável</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ratio_brix_acidez"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="flex items-center">
                        Ratio Brix/Acidez (Auto)
                        <HelpPopover
                          title="Ratio Brix/Acidez"
                          content={
                            <div className="space-y-2 mt-2">
                              <p>
                                O "Ratio" é a relação entre o teor de açúcares (Brix) e a Acidez
                                Titulável.
                              </p>
                              <p>
                                É o principal indicador do grau de maturação e sabor da fruta
                                (doçura vs. acidez).
                              </p>
                              <p>
                                Calculado automaticamente quando os dois campos são preenchidos.
                              </p>
                            </div>
                          }
                        />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ''}
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* FÍSICOS */}
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros Físicos</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firmeza_media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firmeza Média (N)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coloracao_escala"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coloração Visual (1-9)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="9"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="peso_medio_fruto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso Médio do Fruto (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defeitos_percentual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defeitos (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* DECISÃO E EVIDÊNCIAS */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Decisão de Colheita e Evidências</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="apto_colheita"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Apto para Colheita?</FormLabel>
                          <FormDescription>
                            A qualidade atual permite o envio para o packing?
                          </FormDescription>
                          {meetsBrixCriteria && (
                            <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                              Atingiu Brix Mínimo Ideal ({brixMinimoIdeal})
                            </Badge>
                          )}
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data_estimada_colheita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Estimada de Colheita</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Gerais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalhes qualitativos da amostra"
                            rows={4}
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="block mb-2">Fotos da Amostra</FormLabel>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 text-center">
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-4">
                      Clique para fazer upload de evidências (Max 5MB/foto)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('foto-upload')?.click()}
                      disabled={uploadingFotos}
                    >
                      {uploadingFotos ? 'Enviando...' : 'Selecionar Fotos'}
                    </Button>
                    <input
                      id="foto-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotosUpload}
                    />
                  </div>

                  {watchFotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {watchFotos.map((url, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={url}
                            alt={`Foto ${i + 1}`}
                            className="w-full h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  )
}
