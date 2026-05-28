import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEmpresa } from '@/hooks/use-empresa'
import { getTalhao, createTalhao, updateTalhao, getFazendas } from '@/services/talhoes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, ArrowLeft, Save } from 'lucide-react'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  fazenda_id: z.string().min(1, 'Fazenda é obrigatória'),
  area_ha: z.coerce.number().min(0).optional().or(z.literal('')),
  area_plantavel_ha: z.coerce.number().min(0).optional().or(z.literal('')),
  codigo_talhao: z.string().optional(),
  tipo_solo: z.string().optional(),
  declividade: z.coerce.number().min(0).optional().or(z.literal('')),
  altitude: z.coerce.number().min(0).optional().or(z.literal('')),
  tem_irrigacao: z.boolean().default(false),
  tipo_irrigacao: z.string().optional(),
  latitude: z.coerce.number().optional().or(z.literal('')),
  longitude: z.coerce.number().optional().or(z.literal('')),
  numero_globalgap: z.string().optional(),
  referencia_car: z.string().optional(),
  status_atual: z.string().default('disponível'),
  observacoes: z.string().optional(),
})

export default function TalhaoForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [fazendas, setFazendas] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      fazenda_id: '',
      area_ha: '',
      area_plantavel_ha: '',
      codigo_talhao: '',
      tipo_solo: '',
      declividade: '',
      altitude: '',
      tem_irrigacao: false,
      tipo_irrigacao: '',
      latitude: '',
      longitude: '',
      numero_globalgap: '',
      referencia_car: '',
      status_atual: 'disponível',
      observacoes: '',
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (!empresa?.id) return
      try {
        const fazendasData = await getFazendas(empresa.id)
        setFazendas(fazendasData || [])

        if (isEditing) {
          const data = await getTalhao(id)
          if (data) {
            form.reset({
              nome: data.nome || '',
              fazenda_id: data.fazenda_id || '',
              area_ha: data.area_ha ?? '',
              area_plantavel_ha: data.area_plantavel_ha ?? '',
              codigo_talhao: data.codigo_talhao || '',
              tipo_solo: data.tipo_solo || '',
              declividade: data.declividade ?? '',
              altitude: data.altitude ?? '',
              tem_irrigacao: data.tem_irrigacao || false,
              tipo_irrigacao: data.tipo_irrigacao || '',
              latitude: data.latitude ?? '',
              longitude: data.longitude ?? '',
              numero_globalgap: data.numero_globalgap || '',
              referencia_car: data.referencia_car || '',
              status_atual: data.status_atual || 'disponível',
              observacoes: data.observacoes || '',
            })
          }
        }
      } catch (error: any) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        })
      } finally {
        setInitialLoading(false)
      }
    }

    loadData()
  }, [empresa?.id, id, isEditing, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    try {
      setLoading(true)

      const payload = {
        ...values,
        empresa_id: empresa.id,
        area_ha: values.area_ha === '' ? null : values.area_ha,
        area_plantavel_ha: values.area_plantavel_ha === '' ? null : values.area_plantavel_ha,
        declividade: values.declividade === '' ? null : values.declividade,
        altitude: values.altitude === '' ? null : values.altitude,
        latitude: values.latitude === '' ? null : values.latitude,
        longitude: values.longitude === '' ? null : values.longitude,
      }

      if (isEditing) {
        await updateTalhao(id, payload)
        toast({ title: 'Talhão atualizado com sucesso!' })
      } else {
        await createTalhao(payload)
        toast({ title: 'Talhão criado com sucesso!' })
      }
      navigate('/app/talhoes')
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/app/talhoes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Editar Talhão' : 'Novo Talhão'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados abaixo para {isEditing ? 'atualizar o' : 'cadastrar um novo'} talhão
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Informações Principais</CardTitle>
              <CardDescription>Dados básicos de identificação do talhão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Talhão *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Talhão 01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codigo_talhao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: T-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fazenda_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fazenda *</FormLabel>
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
                  name="status_atual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Atual</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="disponível">Disponível</SelectItem>
                          <SelectItem value="em_preparo">Em Preparo</SelectItem>
                          <SelectItem value="em_plantio">Em Plantio</SelectItem>
                          <SelectItem value="em_produção">Em Produção</SelectItem>
                          <SelectItem value="em_colheita">Em Colheita</SelectItem>
                          <SelectItem value="pousio">Pousio / Descanso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Dimensões e Geografia</CardTitle>
              <CardDescription>Área, coordenadas e relevo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="area_ha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Total (ha)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 50.5" {...field} />
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
                        <Input type="number" step="0.01" placeholder="Ex: 48.0" {...field} />
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
                          step="0.000001"
                          placeholder="Ex: -23.5505"
                          {...field}
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
                          step="0.000001"
                          placeholder="Ex: -46.6333"
                          {...field}
                        />
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
                        <Input type="number" placeholder="Ex: 850" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="declividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Declividade (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Ex: 5" {...field} />
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
                      <FormControl>
                        <Input placeholder="Ex: Latossolo Vermelho" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Dados Técnicos e Certificações</CardTitle>
              <CardDescription>Irrigação, CAR, GlobalGAP e observações adicionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="tem_irrigacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tem Irrigação?</FormLabel>
                        <CardDescription>Ativar se o talhão possui sistema</CardDescription>
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
                      <FormItem>
                        <FormLabel>Tipo de Irrigação</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gotejamento">Gotejamento</SelectItem>
                            <SelectItem value="aspersao">Aspersão</SelectItem>
                            <SelectItem value="pivo_central">Pivô Central</SelectItem>
                            <SelectItem value="microaspersao">Microaspersão</SelectItem>
                            <SelectItem value="inundacao">Inundação</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="numero_globalgap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº GlobalGAP</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: GGN 1234567890123" {...field} />
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
                      <FormLabel>Referência CAR</FormLabel>
                      <FormControl>
                        <Input placeholder="Código do CAR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-4">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Anotações adicionais sobre o talhão..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
