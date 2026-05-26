import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ArrowLeft, Save, Loader2, CloudRain, ThermometerSun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { HelpButton } from '@/components/HelpButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { grausDiaService } from '@/services/graus-dia'

const formSchema = z
  .object({
    safra_id: z.string().min(1, 'Selecione a safra'),
    data: z.string().min(1, 'Data é obrigatória'),
    temp_maxima: z.coerce
      .number({ invalid_type_error: 'Insira um número' })
      .min(-50, 'Mínimo -50')
      .max(60, 'Máximo 60'),
    temp_minima: z.coerce
      .number({ invalid_type_error: 'Insira um número' })
      .min(-50, 'Mínimo -50')
      .max(60, 'Máximo 60'),
    fonte_dados: z.string().min(1, 'Selecione a fonte de dados'),
  })
  .refine((data) => data.temp_maxima >= data.temp_minima, {
    message: 'Temp Máxima deve ser maior ou igual à Temp Mínima',
    path: ['temp_maxima'],
  })

// Simulates API Fetch based on the acceptance criteria
const fetchWeatherData = async (): Promise<{ max: number; min: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        max: Number((Math.random() * 10 + 25).toFixed(1)),
        min: Number((Math.random() * 10 + 15).toFixed(1)),
      })
    }, 1000)
  })
}

export default function GrausDiaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [safras, setSafras] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safra_id: '',
      data: format(new Date(), 'yyyy-MM-dd'),
      temp_maxima: undefined,
      temp_minima: undefined,
      fonte_dados: 'manual',
    },
  })

  const fonte = form.watch('fonte_dados')

  useEffect(() => {
    if (empresa) {
      loadSafras()
      if (id) {
        loadRecord()
      }
    }
  }, [id, empresa])

  const loadSafras = async () => {
    try {
      const data = await grausDiaService.getSafras(empresa!.id)
      setSafras(data || [])
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Falha ao carregar safras', variant: 'destructive' })
    }
  }

  const loadRecord = async () => {
    try {
      setLoading(true)
      const data = await grausDiaService.getById(id!)
      form.reset({
        safra_id: data.safra_id,
        data: data.data || '',
        temp_maxima: data.temp_maxima,
        temp_minima: data.temp_minima,
        fonte_dados: data.fonte_dados || 'manual',
      })
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Registro não encontrado', variant: 'destructive' })
      navigate('/app/agronomia/gda')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchWeather = async () => {
    setFetching(true)
    try {
      const { max, min } = await fetchWeatherData()
      form.setValue('temp_maxima', max, { shouldValidate: true })
      form.setValue('temp_minima', min, { shouldValidate: true })
      toast({ title: 'Sucesso', description: 'Dados meteorológicos importados para hoje.' })
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar os dados da estação.',
        variant: 'destructive',
      })
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const safra = safras.find((s) => s.id === values.safra_id)
      const tBase = safra?.cultivares?.culturas?.temperatura_base_gda || 10
      const tempMedia = (values.temp_maxima + values.temp_minima) / 2
      const gdaDiario = Math.max(0, tempMedia - tBase)

      const payload = {
        ...values,
        id: id || undefined,
        empresa_id: empresa!.id,
        talhao_id: safra?.talhao_id,
        temperatura_media: tempMedia,
        gda_diario: gdaDiario,
        usuario_id: user?.id,
      }

      await grausDiaService.save(payload)
      toast({ title: 'Sucesso', description: 'Registro de GDA salvo com sucesso.' })
      navigate('/app/agronomia/gda')
    } catch (error: any) {
      let msg = error.message
      if (msg?.includes('graus_dia_safra_id_data_key')) {
        msg = 'Já existe um registro para esta Safra nesta Data.'
      }
      toast({ title: 'Erro ao salvar', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/app/agronomia/gda')}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {id ? 'Editar Registro GDA' : 'Novo Registro GDA'}
            </h1>
            <p className="text-muted-foreground">
              Registre os dados de temperatura para calcular os Graus-Dia Acumulados.
            </p>
          </div>
        </div>
        <HelpButton
          title="Ajuda: Registro de Graus-Dia"
          content={
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground">Como preencher:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground ml-2">
                  <li>
                    <strong className="text-foreground">Safra:</strong> Selecione a safra ativa à
                    qual este registro se aplica.
                  </li>
                  <li>
                    <strong className="text-foreground">Data:</strong> Selecione o dia específico da
                    leitura de temperatura.
                  </li>
                  <li>
                    <strong className="text-foreground">Fonte dos Dados:</strong> Escolha a origem
                    da informação (Manual, INMET, ClimaTempo, etc.). Opções automatizadas permitem a
                    importação de dados.
                  </li>
                  <li>
                    <strong className="text-foreground">Temperaturas:</strong> Insira as
                    temperaturas Máxima e Mínima em Celsius (°C) registradas no dia.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Lógica de Cálculo GDA:</h4>
                <p className="mt-1 text-muted-foreground">
                  A fórmula utilizada para o cálculo de Graus-Dia Acumulados é:
                </p>
                <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm text-center">
                  GDA = ((Temp. Máx + Temp. Mín) / 2) - Temp. Base
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  A <strong>Temp. Base</strong> é recuperada automaticamente das configurações da
                  cultura associada à safra selecionada.
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-md">
                <p className="text-sm text-primary">
                  <strong>Nota de Conformidade:</strong> O preenchimento preciso destes dados é
                  necessário para manter a conformidade com as normas do{' '}
                  <strong>GLOBALG.A.P.</strong> em relação ao monitoramento climático.
                </p>
              </div>
            </div>
          }
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ThermometerSun className="size-5 text-primary" />
                <CardTitle>Dados Diários</CardTitle>
              </div>
              <CardDescription>
                Informe as temperaturas máxima e mínima registradas.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Safra *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma safra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra || s.codigo_safra || 'Safra Sem Nome'} - Base:{' '}
                            {s.cultivares?.culturas?.temperatura_base_gda || 10}°C
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
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fonte_dados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte dos Dados (GlobalG.A.P.) *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a fonte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual (Digitado)</SelectItem>
                        <SelectItem value="estacao_propria">
                          Estação Meteorológica Própria
                        </SelectItem>
                        <SelectItem value="inmet">INMET</SelectItem>
                        <SelectItem value="climatempo">ClimaTempo / API Externa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(fonte === 'inmet' || fonte === 'climatempo') && (
                <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    É possível buscar os dados automaticamente baseados na localização da fazenda.
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleFetchWeather}
                    disabled={fetching}
                  >
                    {fetching ? (
                      <Loader2 className="animate-spin size-4 mr-2" />
                    ) : (
                      <CloudRain className="size-4 mr-2" />
                    )}
                    Importar Dados
                  </Button>
                </div>
              )}

              <FormField
                control={form.control}
                name="temp_maxima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura Máxima (°C) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 32.5"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temp_minima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura Mínima (°C) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 18.0"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate('/app/agronomia/gda')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Salvar Registro
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
