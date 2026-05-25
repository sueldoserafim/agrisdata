import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, ArrowLeft, Info, HelpCircle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { createCultura, updateCultura, getCulturaById } from '@/services/culturas'
import { supabase } from '@/lib/supabase/client'

const optNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
  z.number().nullable().optional(),
)

const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip?: string }) => (
  <div className="flex items-center gap-1.5">
    <span>{label}</span>
    {tooltip && (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger type="button" tabIndex={-1}>
            <Info className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs font-normal">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
)

export default function CulturaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [fenologiaObrigatoria, setFenologiaObrigatoria] = useState(false)

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('empresas')
        .select('configuracoes')
        .eq('id', empresa.id)
        .single()
        .then(({ data }) => {
          if (
            data?.configuracoes &&
            typeof data.configuracoes === 'object' &&
            'fenologia_obrigatoria' in data.configuracoes
          ) {
            setFenologiaObrigatoria(!!(data.configuracoes as any).fenologia_obrigatoria)
          }
        })
    }
  }, [empresa?.id])

  const formSchema = useMemo(() => {
    return z
      .object({
        nome: z.string().min(3, 'Mínimo de 3 caracteres').max(100),
        nome_cientifico: z.string().optional().nullable(),
        tipo: z.string().min(1, 'Obrigatório'),
        codigo_ncm: z.string().optional().nullable(),
        unidade_medida: z.string().optional().nullable(),
        ciclo_dias: z.preprocess(
          (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
          z.number().int().positive('Deve ser > 0').nullable().optional(),
        ),
        temperatura_base_gda: z.preprocess(
          (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
          z.number().min(-10).max(50).nullable().optional(),
        ),
        temp_minima_ideal: optNumber,
        temp_maxima_ideal: optNumber,
        necessidade_hidrica_mm_dia: optNumber,
        brix_minimo_ideal: optNumber,
        brix_maximo_ideal: optNumber,
        produtividade_media_t_ha: optNumber,
        fenologia: z
          .array(
            z.object({
              estagio: z.string().min(1, 'Obrigatório'),
              dias_desde_plantio: z.preprocess(
                (val) => (val === '' ? undefined : Number(val)),
                z.number().int().positive('> 0'),
              ),
              descricao: z.string().optional().nullable(),
            }),
          )
          .optional()
          .default([]),
      })
      .refine(
        (data) => {
          if (fenologiaObrigatoria && data.fenologia.length === 0) {
            return false
          }
          return true
        },
        {
          message: 'É obrigatório adicionar pelo menos um estágio fenológico.',
          path: ['fenologia'],
        },
      )
  }, [fenologiaObrigatoria])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fenologia: [] },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'fenologia' })

  useEffect(() => {
    if (id && id !== 'new' && empresa?.id) {
      getCulturaById(id, empresa.id)
        .then(({ cultura, fenologia }) => {
          form.reset({ ...cultura, fenologia: fenologia || [] })
        })
        .catch((err) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }))
    }
  }, [id, empresa?.id, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    setLoading(true)
    try {
      const { fenologia, ...culturaData } = values
      if (id === 'new') await createCultura(culturaData, fenologia || [], empresa.id)
      else await updateCultura(id!, culturaData, fenologia || [], empresa.id)
      toast({ title: 'Sucesso', description: 'Cultura salva com sucesso.' })
      navigate('/app/culturas')
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (
    name: any,
    label: string,
    type = 'text',
    tooltip?: string,
    step?: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <LabelWithTooltip label={label} tooltip={tooltip} />
          </FormLabel>
          <FormControl>
            <Input type={type} step={step} {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderSelect = (
    name: any,
    label: string,
    options: { value: string; label: string }[],
    tooltip?: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <LabelWithTooltip label={label} tooltip={tooltip} />
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? ''}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const fenoError = form.formState.errors.fenologia as any
  const fenoErrorMessage = fenoError?.message || fenoError?.root?.message

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/culturas">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id === 'new' ? 'Nova Cultura' : 'Editar Cultura'}
          </h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <HelpCircle className="size-4" />
              Ajuda
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Guia de Preenchimento</SheetTitle>
              <SheetDescription>
                Instruções detalhadas sobre como preencher os dados técnicos e agronômicos da
                cultura.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground">Identificação</h4>
                <p className="text-muted-foreground mt-1">
                  Insira o nome comum, nome científico e o código NCM para fins fiscais e
                  comerciais.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Parâmetros Agronômicos</h4>
                <p className="text-muted-foreground mt-1">
                  Defina os dias de ciclo, a necessidade hídrica diária (mm/dia) e a temperatura
                  base GDA.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Qualidade</h4>
                <p className="text-muted-foreground mt-1">
                  Configure os níveis ideais de Brix (Mínimo e Máximo) para monitorar a doçura dos
                  frutos/produtos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Fenologia</h4>
                <p className="text-muted-foreground mt-1">
                  Mapeie os estágios de desenvolvimento, indicando como os dias após o plantio
                  afetam a evolução da cultura.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('nome', 'Nome da Cultura')}
              {renderInput('nome_cientifico', 'Nome Científico')}
              {renderSelect('tipo', 'Categoria', [
                { value: 'fruta', label: 'Fruta' },
                { value: 'vegetal', label: 'Vegetal' },
                { value: 'grão', label: 'Grão' },
                { value: 'outro', label: 'Outro' },
              ])}
              {renderInput('codigo_ncm', 'Código NCM')}
              {renderSelect('unidade_medida', 'Unidade de Medida', [
                { value: 'kg', label: 'Quilograma (kg)' },
                { value: 'ton', label: 'Tonelada (t)' },
                { value: 'caixa', label: 'Caixa' },
                { value: 'unidade', label: 'Unidade' },
              ])}
              {renderInput('ciclo_dias', 'Ciclo Médio (dias)', 'number')}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros Agronômicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderInput(
                  'temperatura_base_gda',
                  'Temperatura Base GDA (°C)',
                  'number',
                  'Usada para cálculo térmico',
                  'any',
                )}
                <div className="grid grid-cols-2 gap-4">
                  {renderInput(
                    'temp_minima_ideal',
                    'Temp. Mínima Ideal (°C)',
                    'number',
                    undefined,
                    'any',
                  )}
                  {renderInput(
                    'temp_maxima_ideal',
                    'Temp. Máxima Ideal (°C)',
                    'number',
                    undefined,
                    'any',
                  )}
                </div>
                {renderInput(
                  'necessidade_hidrica_mm_dia',
                  'Necessidade Hídrica (mm/dia)',
                  'number',
                  'Evapotranspiração estimada da cultura',
                  'any',
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parâmetros de Qualidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {renderInput(
                    'brix_minimo_ideal',
                    'Brix Mínimo Ideal',
                    'number',
                    undefined,
                    'any',
                  )}
                  {renderInput(
                    'brix_maximo_ideal',
                    'Brix Máximo Ideal',
                    'number',
                    undefined,
                    'any',
                  )}
                </div>
                {renderInput(
                  'produtividade_media_t_ha',
                  'Produtividade Média (t/ha)',
                  'number',
                  undefined,
                  'any',
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Fenologia (Estágios)</CardTitle>
                {fenologiaObrigatoria && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Obrigatório
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fenoErrorMessage && (
                <p className="text-[0.8rem] font-medium text-destructive">{fenoErrorMessage}</p>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-end bg-muted/30 p-4 rounded-xl relative border"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <div className="col-span-12 md:col-span-3">
                    {renderSelect(
                      `fenologia.${index}.estagio`,
                      'Estágio',
                      ['V1', 'V2', 'V3', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'].map(
                        (v) => ({ value: v, label: v }),
                      ),
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    {renderInput(
                      `fenologia.${index}.dias_desde_plantio`,
                      'Dias após plantio',
                      'number',
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    {renderInput(`fenologia.${index}.descricao`, 'Descrição')}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  append({ estagio: '', dias_desde_plantio: undefined as any, descricao: '' })
                }
              >
                <Plus className="size-4 mr-2" /> Adicionar Estágio Fenológico
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-12">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="size-4 mr-2" /> Salvar Cultura
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
