import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  nome_cientifico: z.string().optional().nullable(),
  tipo: z.string().optional().nullable(),
  codigo_ncm: z.string().optional().nullable(),
  ciclo_dias: z.coerce.number().optional().nullable(),
  unidade_medida: z.string().optional().nullable(),
  produtividade_media_t_ha: z.coerce.number().optional().nullable(),
  temperatura_base_gda: z.coerce.number().optional().nullable(),
  temp_minima_ideal: z.coerce.number().optional().nullable(),
  temp_maxima_ideal: z.coerce.number().optional().nullable(),
  necessidade_hidrica_mm_dia: z.coerce.number().optional().nullable(),
  brix_minimo_ideal: z.coerce.number().optional().nullable(),
  brix_maximo_ideal: z.coerce.number().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export default function CulturaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = !!id
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      nome_cientifico: '',
      tipo: '',
      codigo_ncm: '',
      ciclo_dias: null,
      unidade_medida: 't',
      produtividade_media_t_ha: null,
      temperatura_base_gda: null,
      temp_minima_ideal: null,
      temp_maxima_ideal: null,
      necessidade_hidrica_mm_dia: null,
      brix_minimo_ideal: null,
      brix_maximo_ideal: null,
    },
  })

  useEffect(() => {
    async function fetchCultura() {
      if (!id) return
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from('culturas').select('*').eq('id', id).single()

        if (error) throw error

        if (data) {
          form.reset({
            nome: data.nome || '',
            nome_cientifico: data.nome_cientifico || '',
            tipo: data.tipo || '',
            codigo_ncm: data.codigo_ncm || '',
            ciclo_dias: data.ciclo_dias,
            unidade_medida: data.unidade_medida || 't',
            produtividade_media_t_ha: data.produtividade_media_t_ha,
            temperatura_base_gda: data.temperatura_base_gda,
            temp_minima_ideal: data.temp_minima_ideal,
            temp_maxima_ideal: data.temp_maxima_ideal,
            necessidade_hidrica_mm_dia: data.necessidade_hidrica_mm_dia,
            brix_minimo_ideal: data.brix_minimo_ideal,
            brix_maximo_ideal: data.brix_maximo_ideal,
          })
        }
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar dados',
          description: error.message,
          variant: 'destructive',
        })
        navigate('/app/culturas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCultura()
  }, [id, form, navigate, toast])

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true)
      let empresaId = ''

      if (!isEditing) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()

        if (!profile) throw new Error('Perfil do usuário não encontrado')
        empresaId = profile.empresa_id
      }

      const dataToSave = {
        ...values,
        ...(isEditing ? {} : { empresa_id: empresaId }),
      }

      if (isEditing) {
        const { error } = await supabase.from('culturas').update(dataToSave).eq('id', id)

        if (error) throw error
        toast({ title: 'Cultura atualizada com sucesso' })
      } else {
        const { error } = await supabase.from('culturas').insert(dataToSave)

        if (error) throw error
        toast({ title: 'Cultura cadastrada com sucesso' })
      }

      navigate('/app/culturas')
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full pb-16">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/app/culturas')}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isEditing ? 'Editar Cultura' : 'Nova Cultura'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados abaixo para cadastrar uma nova cultura
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Principais */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-lg">Informações Principais</CardTitle>
              <CardDescription>Dados básicos de identificação da cultura</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 pt-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Cultura *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Milho" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nome_cientifico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Científico</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Zea mays" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cereal" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codigo_ncm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código NCM</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1005.90.10" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Especificações Técnicas */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-lg">Especificações Técnicas</CardTitle>
              <CardDescription>Ciclo e produtividade esperada</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 pt-6">
              <FormField
                control={form.control}
                name="ciclo_dias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 120"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unidade_medida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: t, kg, sc" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="produtividade_media_t_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Produtividade Média ({form.watch('unidade_medida') || 't'}/ha)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 6.5"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Parâmetros e Clima */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-lg">Parâmetros e Clima</CardTitle>
              <CardDescription>Indicadores climáticos e técnicos</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 pt-6">
              <FormField
                control={form.control}
                name="temperatura_base_gda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temp. Base GDA (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 10"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temp_minima_ideal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temp. Mínima Ideal (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 15"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temp_maxima_ideal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temp. Máxima Ideal (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 30"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="necessidade_hidrica_mm_dia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nec. Hídrica (mm/dia)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 5.5"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brix_minimo_ideal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brix Mínimo Ideal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 10"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brix_maximo_ideal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brix Máximo Ideal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 14"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
