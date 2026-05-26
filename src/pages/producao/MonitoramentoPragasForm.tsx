import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, AlertTriangle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  safra_id: z.string().min(1, 'Obrigatório'),
  talhao_id: z.string().min(1, 'Obrigatório'),
  tipo: z.string().min(1, 'Obrigatório'),
  praga_identificada: z.string().min(1, 'Obrigatório'),
  nivel_infestacao: z.string().min(1, 'Obrigatório'),
  area_afetada_percentual: z.coerce.number().min(0).max(100).optional().nullable(),
  num_armadilhas: z.coerce.number().optional().nullable(),
  num_capturas: z.coerce.number().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  acao_recomendada: z.string().optional().nullable(),
  fotos: z.array(z.string()).optional(),
})

export default function MonitoramentoPragasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [safras, setSafras] = useState<any[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      safra_id: searchParams.get('safra') || '',
      talhao_id: searchParams.get('talhao') || '',
      fotos: [],
    },
  })

  const watchSafra = form.watch('safra_id')
  const watchNivel = form.watch('nivel_infestacao')
  const isHighRisk = ['alto', 'crítico'].includes(watchNivel)

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  useEffect(() => {
    if (watchSafra && safras.length) {
      const s = safras.find((x) => x.id === watchSafra)
      if (s) form.setValue('talhao_id', s.talhao_id)
    }
  }, [watchSafra, safras])

  const loadData = async () => {
    const { data: safrasData } = await supabase
      .from('safras')
      .select('id, nome_safra, talhao_id, talhoes(nome)')
      .eq('empresa_id', empresa?.id)
    setSafras(safrasData || [])

    if (id) {
      const { data } = await supabase.from('monitoramento_pragas').select('*').eq('id', id).single()
      if (data) form.reset(data)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        form.setValue('latitude', pos.coords.latitude)
        form.setValue('longitude', pos.coords.longitude)
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setLoading(true)
    const newFotos = [...(form.getValues('fotos') || [])]
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i]
        const name = `${Date.now()}_${file.name}`
        const { error } = await supabase.storage.from('monitoramento-evidencias').upload(name, file)
        if (error) throw error
        const { data } = supabase.storage.from('monitoramento-evidencias').getPublicUrl(name)
        newFotos.push(data.publicUrl)
      } catch (err) {
        newFotos.push(`https://img.usecurling.com/p/400/300?q=bug&color=gray&seed=${Math.random()}`)
      }
    }
    form.setValue('fotos', newFotos)
    setLoading(false)
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setLoading(true)
      const payload = {
        empresa_id: empresa?.id,
        responsavel_id: user?.id,
        data_monitoramento: new Date().toISOString().split('T')[0],
        ...values,
      }

      if (id) {
        await supabase.from('monitoramento_pragas').update(payload).eq('id', id)
      } else {
        const { data } = await supabase
          .from('monitoramento_pragas')
          .insert(payload)
          .select()
          .single()
        if (values.nivel_infestacao === 'crítico') {
          const tNome = safras.find((s) => s.id === values.safra_id)?.talhoes?.nome
          await supabase.from('alertas').insert({
            empresa_id: empresa?.id,
            titulo: 'ALERTA CRÍTICO: Infestação Detectada',
            descricao: `Nível crítico de ${values.praga_identificada} no Talhão ${tNome}.`,
            tipo: 'manejo_fenologia',
            lido: false,
          })
        }
        if (data) return navigate(`/app/producao/monitoramento/${data.id}`)
      }
      toast.success('Registro salvo com sucesso!')
      if (!isHighRisk) navigate('/app/producao/monitoramento')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/producao/monitoramento')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">{id ? 'Ver/Editar Registro' : 'Novo Monitoramento'}</h1>
      </div>

      {id && isHighRisk && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-red-800 gap-2 font-medium">
            <AlertTriangle className="w-5 h-5" /> Nível de infestação ALTO/CRÍTICO detectado.
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              navigate('/app/operacoes/nova', {
                state: {
                  tipo_operacao: 'aplicação_defensivo',
                  safra_id: watchSafra,
                  observacoes: `Controle de ${form.getValues('praga_identificada')}. Rec: ${form.getValues('acao_recomendada') || ''}`,
                },
              })
            }
          >
            Gerar OS de Aplicação
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Principais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra} ({s.talhoes?.nome})
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
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ocorrência</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                    <FormLabel>Identificação (Nome)</FormLabel>
                    <FormControl>
                      <Input
                        list="pragas-list"
                        {...field}
                        value={field.value || ''}
                        placeholder="Ex: Cigarrinha"
                      />
                    </FormControl>
                    <datalist id="pragas-list">
                      <option value="Cigarrinha" />
                      <option value="Mosca Branca" />
                      <option value="Ferrugem" />
                      <option value="Lagarta" />
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nivel_infestacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Infestação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="baixo">Baixo</SelectItem>
                        <SelectItem value="médio">Médio</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="crítico">Crítico</SelectItem>
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
                      <Input type="number" {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="num_armadilhas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº Armadilhas</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="num_capturas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº Capturas</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidências e Localização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="acao_recomendada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recomendação / Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <FormLabel className="mb-2 block">Fotos</FormLabel>
                <div className="flex gap-4 flex-wrap">
                  {(form.watch('fotos') || []).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Evidência"
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  ))}
                  <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
