import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Leaf,
  CalendarDays,
  Droplets,
  Ruler,
  AlertCircle,
} from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import {
  getTalhao,
  createTalhao,
  updateTalhao,
  getFazendas,
  getTalhaoHistory,
  getSoilAnalysis,
} from '@/services/talhoes'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

const formSchema = z
  .object({
    fazenda_id: z.string().min(1, 'Fazenda é obrigatória'),
    codigo_talhao: z.string().min(1, 'Código é obrigatório').max(50),
    nome: z.string().min(1, 'Nome é obrigatório'),
    area_ha: z.coerce.number().positive('Área total deve ser maior que 0'),
    area_plantavel_ha: z.coerce.number().positive('Área plantável deve ser maior que 0'),
    tipo_solo: z.string().optional().nullable(),
    declividade: z.string().optional().nullable(),
    altitude: z.coerce.number().optional().nullable(),
    tem_irrigacao: z.boolean().default(false),
    tipo_irrigacao: z.string().optional().nullable(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
    numero_globalgap: z.string().optional().nullable(),
    referencia_car: z.string().optional().nullable(),
    status_atual: z
      .enum(['disponível', 'em_plantio', 'em_produção', 'em_repouso', 'bloqueado'])
      .default('disponível'),
    observacoes: z.string().optional().nullable(),
  })
  .refine((data) => data.area_plantavel_ha <= data.area_ha, {
    message: 'Área plantável não pode exceder área total',
    path: ['area_plantavel_ha'],
  })
  .refine((data) => !data.tem_irrigacao || (data.tem_irrigacao && data.tipo_irrigacao), {
    message: 'Especifique o tipo de irrigação',
    path: ['tipo_irrigacao'],
  })

export default function TalhaoForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [fazendas, setFazendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [soilAnalysisDate, setSoilAnalysisDate] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fazenda_id: '',
      codigo_talhao: '',
      nome: '',
      area_ha: 0,
      area_plantavel_ha: 0,
      tem_irrigacao: false,
      status_atual: 'disponível',
    },
  })

  useEffect(() => {
    if (!empresa?.id) return
    const fetchData = async () => {
      try {
        const fazendasData = await getFazendas(empresa.id)
        setFazendas(fazendasData)

        if (isEditing) {
          const [data, histData, soilData] = await Promise.all([
            getTalhao(id),
            getTalhaoHistory(id),
            getSoilAnalysis(id),
          ])

          form.reset({
            fazenda_id: data.fazenda_id || '',
            codigo_talhao: data.codigo_talhao || '',
            nome: data.nome || '',
            area_ha: data.area_ha || 0,
            area_plantavel_ha: data.area_plantavel_ha || 0,
            tipo_solo: data.tipo_solo || '',
            declividade: data.declividade || '',
            altitude: data.altitude || 0,
            tem_irrigacao: data.tem_irrigacao || false,
            tipo_irrigacao: data.tipo_irrigacao || '',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            numero_globalgap: data.numero_globalgap || '',
            referencia_car: data.referencia_car || '',
            status_atual: data.status_atual || 'disponível',
            observacoes: data.observacoes || '',
          })
          setHistory(histData || [])
          if (soilData) setSoilAnalysisDate(soilData.data_coleta)
        }
      } catch (err: any) {
        toast({ title: 'Erro', description: err.message, variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [empresa?.id, id, isEditing, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    setSaving(true)
    try {
      const payload = { ...values, empresa_id: empresa.id }
      if (isEditing) {
        await updateTalhao(id, payload)
        toast({ title: 'Sucesso', description: 'Talhão atualizado com sucesso!' })
      } else {
        await createTalhao(payload)
        toast({ title: 'Sucesso', description: 'Talhão criado com sucesso!' })
      }
      navigate('/app/talhoes')
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const getSoilAnalysisBadge = () => {
    if (!soilAnalysisDate)
      return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Sem Análise' }
    const lastDate = new Date(soilAnalysisDate)
    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime())
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
    if (diffYears < 1.5)
      return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Análise em dia' }
    if (diffYears <= 2.0)
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Análise a vencer' }
    return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Análise desatualizada' }
  }

  const soilBadge = getSoilAnalysisBadge()
  const currentSafra = history.find((h) => h.status === 'planejada' || h.status === 'em_andamento')

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/app/talhoes')}
          className="rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Talhão' : 'Novo Talhão'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Atualize as informações do talhão'
              : 'Preencha os dados para criar um novo talhão'}
          </p>
        </div>
        {isEditing && (
          <div className="ml-auto flex gap-3 flex-wrap justify-end">
            <Badge variant="outline" className={soilBadge.color}>
              {soilBadge.text}
            </Badge>
            {currentSafra ? (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
              >
                <Leaf className="size-3" /> Safra Atual: {currentSafra.cultivares?.nome}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-800 border-slate-200 flex items-center gap-1"
              >
                <Leaf className="size-3" /> Nenhuma safra ativa
              </Badge>
            )}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="gerais" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="gerais">Dados Gerais</TabsTrigger>
              <TabsTrigger value="historico" disabled={!isEditing}>
                Histórico & Safras
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gerais" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5 text-primary" /> Localização e Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="fazenda_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fazenda</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a fazenda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fazendas.map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.nome}
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
                    name="codigo_talhao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código do Talhão</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: T-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome/Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Talhão Norte" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="size-5 text-primary" /> Dimensões e Solo
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="area_ha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Total (ha)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area_plantavel_ha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Plantável (ha)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="altitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altitude (m)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_solo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Solo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="arenoso">Arenoso</SelectItem>
                            <SelectItem value="argiloso">Argiloso</SelectItem>
                            <SelectItem value="silte">Silte</SelectItem>
                            <SelectItem value="franco">Franco</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="declividade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Declividade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="plano 0-3%">Plano (0-3%)</SelectItem>
                            <SelectItem value="suave 3-8%">Suave (3-8%)</SelectItem>
                            <SelectItem value="moderado 8-20%">Moderado (8-20%)</SelectItem>
                            <SelectItem value="forte >20%">Forte {'>'}20%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="size-5 text-primary" /> Irrigação
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="tem_irrigacao"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Possui Irrigação?</FormLabel>
                          <CardDescription>
                            Ative se o talhão possui sistema de irrigação instalado.
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('tem_irrigacao') && (
                    <FormField
                      control={form.control}
                      name="tipo_irrigacao"
                      render={({ field }) => (
                        <FormItem className="pt-2">
                          <FormLabel>Tipo de Irrigação</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gotejamento">Gotejamento</SelectItem>
                              <SelectItem value="aspersão">Aspersão</SelectItem>
                              <SelectItem value="inundação">Inundação</SelectItem>
                              <SelectItem value="pivô">Pivô Central</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="size-5 text-primary" /> Status e Regulatório
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="status_atual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Atual</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Status..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponível">Disponível</SelectItem>
                            <SelectItem value="em_plantio">Em Plantio</SelectItem>
                            <SelectItem value="em_produção">Em Produção</SelectItem>
                            <SelectItem value="em_repouso">Em Repouso</SelectItem>
                            <SelectItem value="bloqueado">Bloqueado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero_globalgap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº GLOBALG.A.P.</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referencia_car"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referência no CAR</FormLabel>
                        <FormControl>
                          <Input placeholder="Opcional" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0000001"
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
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0000001"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-3">
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Notas adicionais sobre o talhão..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 mt-8">
                <Button variant="outline" type="button" onClick={() => navigate('/app/talhoes')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Salvar Talhão
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="size-5 text-primary" /> Histórico de Cultivos
                  </CardTitle>
                  <CardDescription>Cronologia de plantios e safras neste talhão.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {history.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        Nenhum registro de safra encontrado para este talhão.
                      </div>
                    ) : (
                      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {history.map((h) => (
                          <div
                            key={h.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              <Leaf className="size-4" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">
                                  {h.cultivares?.nome || 'Cultivar desconhecida'}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {h.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  <span className="font-medium text-foreground">Cultura:</span>{' '}
                                  {h.cultivares?.culturas?.nome || '-'}
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">Plantio:</span>{' '}
                                  {h.data_plantio
                                    ? format(new Date(h.data_plantio), 'dd/MM/yyyy')
                                    : '-'}
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">Colheita:</span>{' '}
                                  {h.data_colheita_real
                                    ? format(new Date(h.data_colheita_real), 'dd/MM/yyyy')
                                    : '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
