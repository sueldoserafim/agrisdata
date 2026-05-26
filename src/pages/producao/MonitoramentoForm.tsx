import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Camera, MapPin, Trash2, ShieldAlert, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const schema = z.object({
  safra_id: z.string().min(1, 'Safra é obrigatória'),
  data_monitoramento: z.string().min(1, 'Data é obrigatória'),
  tipo: z.enum(['praga', 'doença', 'deficiência', 'fisiopatia']),
  praga_identificada: z.string().min(2, 'Identificação é obrigatória'),
  nivel_infestacao: z.enum(['ausente', 'baixo', 'médio', 'alto', 'crítico']),
  area_afetada_percentual: z.coerce.number().min(0).max(100).optional().nullable(),
  num_armadilhas: z.coerce.number().min(0).optional().nullable(),
  num_capturas: z.coerce.number().min(0).optional().nullable(),
  acao_recomendada: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  fotos_existentes: z.array(z.string()).optional(),
})

export default function MonitoramentoForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [safras, setSafras] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [isCapturingGPS, setIsCapturingGPS] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      data_monitoramento: new Date().toISOString().split('T')[0],
      tipo: 'praga',
      nivel_infestacao: 'ausente',
      fotos_existentes: [],
    },
  })

  const watchSafra = form.watch('safra_id')
  const watchNivel = form.watch('nivel_infestacao')
  const watchPraga = form.watch('praga_identificada')
  const watchAcao = form.watch('acao_recomendada')

  const selectedSafra = safras.find((s) => s.id === watchSafra)
  const selectedTalhao = talhoes.find((t) => t.id === selectedSafra?.talhao_id)

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  const loadData = async () => {
    try {
      const [safRes, talRes] = await Promise.all([
        supabase
          .from('safras')
          .select('*')
          .eq('empresa_id', empresa?.id)
          .neq('status', 'encerrada'),
        supabase.from('talhoes').select('*').eq('empresa_id', empresa?.id),
      ])

      setSafras(safRes.data || [])
      setTalhoes(talRes.data || [])

      if (id) {
        const { data: reg } = await supabase
          .from('monitoramento_pragas')
          .select('*')
          .eq('id', id)
          .single()
        if (reg) {
          form.reset({
            ...reg,
            fotos_existentes: reg.fotos || [],
          })
        }
      } else {
        const queryTalhaoId = searchParams.get('talhao')
        if (queryTalhaoId && safRes.data?.length) {
          const safra = safRes.data.find((s) => s.talhao_id === queryTalhaoId)
          if (safra) form.setValue('safra_id', safra.id)
        }
        captureGPS()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const captureGPS = () => {
    if ('geolocation' in navigator) {
      setIsCapturingGPS(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          form.setValue('latitude', pos.coords.latitude)
          form.setValue('longitude', pos.coords.longitude)
          setIsCapturingGPS(false)
        },
        (err) => {
          console.warn('Erro GPS:', err)
          setIsCapturingGPS(false)
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingPhoto = (url: string) => {
    const current = form.getValues('fotos_existentes') || []
    form.setValue(
      'fotos_existentes',
      current.filter((u) => u !== url),
    )
  }

  const uploadFiles = async () => {
    if (!files.length) return []

    const uploadedUrls: string[] = []
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${empresa?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('monitoramento-evidencias')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('monitoramento-evidencias').getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }
    return uploadedUrls
  }

  const handleGerarOS = () => {
    if (!selectedSafra) {
      toast.error('Selecione uma safra primeiro')
      return
    }
    const obs = `Alvo: ${watchPraga || 'Não identificado'}. Nível: ${watchNivel}. Recomendação: ${watchAcao || 'Nenhuma'}`
    navigate(
      `/app/operacoes/nova?safra_id=${selectedSafra.id}&tipo_operacao=aplicacao_defensivo&obs=${encodeURIComponent(obs)}`,
    )
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setLoading(true)

      // Upload new photos
      const newPhotoUrls = await uploadFiles()
      const allPhotos = [...(values.fotos_existentes || []), ...newPhotoUrls]

      const payload = {
        empresa_id: empresa?.id,
        talhao_id: selectedSafra?.talhao_id,
        safra_id: values.safra_id,
        responsavel_id: user?.id,
        data_monitoramento: values.data_monitoramento,
        tipo: values.tipo,
        praga_identificada: values.praga_identificada,
        nivel_infestacao: values.nivel_infestacao,
        area_afetada_percentual: values.area_afetada_percentual || null,
        num_armadilhas: values.num_armadilhas || null,
        num_capturas: values.num_capturas || null,
        acao_recomendada: values.acao_recomendada || null,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        fotos: allPhotos,
      }

      if (id) {
        await supabase.from('monitoramento_pragas').update(payload).eq('id', id)
      } else {
        await supabase.from('monitoramento_pragas').insert(payload)
      }

      // Se for crítico e for um novo registro ou nível mudou
      if (values.nivel_infestacao === 'crítico' && !id) {
        await supabase.from('alertas').insert({
          empresa_id: empresa?.id,
          titulo: `ALERTA CRÍTICO: ${values.tipo === 'doença' ? 'Doença' : 'Infestação'} Detectada`,
          descricao: `Nível crítico de ${values.praga_identificada} detectado no Talhão ${selectedTalhao?.nome || 'Desconhecido'}.`,
          tipo: 'manejo_fenologia',
          lido: false,
        })
      }

      toast.success('Registro de monitoramento salvo com sucesso!')
      navigate('/app/producao/monitoramento')
    } catch (error: any) {
      toast.error(`Erro ao salvar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const isHighRisk = watchNivel === 'alto' || watchNivel === 'crítico'

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id ? 'Editar Monitoramento' : 'Novo Monitoramento (MIP)'}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/app/producao/monitoramento')}>
            Cancelar
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(onSubmit)}>
            Salvar Registro
          </Button>
        </div>
      </div>

      {isHighRisk && (
        <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg">Atenção Necessária</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p>Nível de infestação {watchNivel}. Recomenda-se ação imediata.</p>
            <Button size="sm" variant="destructive" onClick={handleGerarOS} className="shrink-0">
              Gerar OS de Aplicação <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <FormProvider {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localização e Alvo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_monitoramento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Monitoramento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra Ativa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a safra..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Talhão Vinculado</FormLabel>
                <Input
                  readOnly
                  value={selectedTalhao?.nome || 'Selecione uma safra primeiro'}
                  className="bg-muted"
                />
              </FormItem>

              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 border-t pt-4 mt-2">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ocorrência</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="praga">Praga</SelectItem>
                          <SelectItem value="doença">Doença</SelectItem>
                          <SelectItem value="deficiência">Deficiência Nutricional</SelectItem>
                          <SelectItem value="fisiopatia">Fisiopatia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="praga_identificada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificação (Alvo)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Mosca Branca, Ferrugem..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliação</CardTitle>
              <CardDescription>Detalhes quantitativos e qualitativos da infestação</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nivel_infestacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Infestação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="baixo">Baixo (Sob Controle)</SelectItem>
                        <SelectItem value="médio">Médio (Atenção)</SelectItem>
                        <SelectItem value="alto">Alto (Ação Necessária)</SelectItem>
                        <SelectItem value="crítico">Crítico (Dano Iminente)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_afetada_percentual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Afetada (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_armadilhas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Armadilhas Vistoriadas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Opcional"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_capturas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Total de Capturas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Opcional"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acao_recomendada"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Ação Recomendada / Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Recomendações técnicas ou notas sobre o monitoramento..."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Evidências & GPS</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {isCapturingGPS
                    ? 'Capturando GPS...'
                    : form.watch('latitude')
                      ? `${form.watch('latitude')?.toFixed(5)}, ${form.watch('longitude')?.toFixed(5)}`
                      : 'GPS Indisponível'}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={captureGPS}
                    disabled={isCapturingGPS}
                  >
                    Atualizar GPS
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Existing Photos */}
                {form.watch('fotos_existentes')?.map((url, i) => (
                  <div
                    key={`ext-${i}`}
                    className="relative aspect-square rounded-md overflow-hidden border group"
                  >
                    <img src={url} className="object-cover w-full h-full" alt={`Evidência ${i}`} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingPhoto(url)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}

                {/* New Photos (Files) */}
                {files.map((f, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative aspect-square rounded-md overflow-hidden border border-primary/50 group"
                  >
                    <img
                      src={URL.createObjectURL(f)}
                      className="object-cover w-full h-full"
                      alt={`Nova Evidência ${i}`}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(i)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Adicionar Foto</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  )
}
