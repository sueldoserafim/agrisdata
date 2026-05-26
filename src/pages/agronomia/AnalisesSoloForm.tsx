import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const numOrNull = z.preprocess(
  (val) => (val === '' || val == null ? null : Number(val)),
  z.number().nullable().optional(),
)
const formSchema = z.object({
  talhao_id: z.string().min(1, 'Obrigatório'),
  data_coleta: z.string().min(1, 'Obrigatório'),
  laboratorio: z.string().min(1, 'Obrigatório'),
  metodologia: z.string().optional(),
  ph: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)),
    z.number().min(3, 'Mínimo 3').max(9, 'Máximo 9'),
  ),
  materia_organica: numOrNull,
  fosforo: numOrNull,
  potassio: numOrNull,
  calcio: numOrNull,
  magnesio: numOrNull,
  enxofre: numOrNull,
  boro: numOrNull,
  zinco: numOrNull,
  ferro: numOrNull,
  manganes: numOrNull,
  cobre: numOrNull,
  ctc: numOrNull,
  saturacao_bases: numOrNull,
  argila: numOrNull,
  areia: numOrNull,
  silte: numOrNull,
  calcario_recomendado: numOrNull,
  gesso_recomendado: numOrNull,
  laudo_pdf_url: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export default function AnalisesSoloForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ph: null as any },
  })

  useEffect(() => {
    const init = async () => {
      const { data: t } = await supabase
        .from('talhoes')
        .select('id, nome')
        .eq('empresa_id', empresa?.id)
      setTalhoes(t || [])
      if (id) {
        const { data } = await supabase.from('analises_solo').select('*').eq('id', id).single()
        if (data) {
          form.reset({
            ...data,
            data_coleta: data.data_coleta ? data.data_coleta.split('T')[0] : '',
          } as any)
        }
      }
    }
    if (empresa?.id) init()
  }, [id, empresa?.id, form])

  const argila = form.watch('argila')
  const areia = form.watch('areia')
  useEffect(() => {
    if (typeof argila === 'number' && typeof areia === 'number') {
      form.setValue('silte', 100 - argila - areia, { shouldValidate: true })
    } else {
      form.setValue('silte', null, { shouldValidate: true })
    }
  }, [argila, areia, form])

  const dataColeta = form.watch('data_coleta')
  const isExpirado =
    dataColeta &&
    new Date(dataColeta) < new Date(new Date().setFullYear(new Date().getFullYear() - 2))

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const payload = { ...values, empresa_id: empresa?.id }
      if (id) await supabase.from('analises_solo').update(payload).eq('id', id)
      else await supabase.from('analises_solo').insert(payload)
      toast({ title: 'Salvo com sucesso' })
      navigate('/app/agronomia/analises-solo')
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (
    name: keyof FormValues,
    label: string,
    type = 'number',
    readOnly = false,
  ) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              step="any"
              readOnly={readOnly}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold">
        {id ? 'Editar Análise de Solo' : 'Nova Análise de Solo'}
      </h1>

      {isExpirado && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Esta análise possui mais de 2 anos e pode não ser válida para recomendações atuais.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identificação e Arquivo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="talhao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Talhão</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o talhão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {talhoes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {renderInput('data_coleta', 'Data de Coleta', 'date')}
              {renderInput('laboratorio', 'Laboratório', 'text')}
              {renderInput('metodologia', 'Metodologia', 'text')}
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>PDF do Laudo Oficial</FormLabel>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept=".pdf"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(true)
                      const p = `${empresa?.id}/${Math.random().toString(36).substring(2)}.pdf`
                      const { error } = await supabase.storage.from('laudos_solo').upload(p, file)
                      if (!error)
                        form.setValue(
                          'laudo_pdf_url',
                          supabase.storage.from('laudos_solo').getPublicUrl(p).data.publicUrl,
                        )
                      setUploading(false)
                    }}
                  />
                  {uploading && <Loader2 className="animate-spin text-muted-foreground" />}
                  {form.watch('laudo_pdf_url') && (
                    <a
                      href={form.watch('laudo_pdf_url')!}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap"
                      rel="noreferrer"
                    >
                      Ver Anexo
                    </a>
                  )}
                </div>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Macronutrientes</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                ['ph', 'pH (água)'],
                ['materia_organica', 'MO (%)'],
                ['fosforo', 'P (mg/dm³)'],
                ['potassio', 'K (cmolc/dm³)'],
                ['calcio', 'Ca (cmolc/dm³)'],
                ['magnesio', 'Mg (cmolc/dm³)'],
                ['enxofre', 'S (mg/dm³)'],
              ].map(([n, l]) => renderInput(n as keyof FormValues, l))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Micronutrientes e Índices</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                ['boro', 'Boro (mg/dm³)'],
                ['zinco', 'Zinco (mg/dm³)'],
                ['ferro', 'Ferro (mg/dm³)'],
                ['manganes', 'Manganês (mg/dm³)'],
                ['cobre', 'Cobre (mg/dm³)'],
              ].map(([n, l]) => renderInput(n as keyof FormValues, l))}
              <div className="col-span-1 md:col-span-3 lg:col-span-5 border-b my-2" />
              {[
                ['ctc', 'CTC (cmolc/dm³)'],
                ['saturacao_bases', 'V (%)'],
                ['argila', 'Argila (%)'],
                ['areia', 'Areia (%)'],
              ].map(([n, l]) => renderInput(n as keyof FormValues, l))}
              {renderInput('silte', 'Silte (%)', 'number', true)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recomendações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('calcario_recomendado', 'Calcário (t/ha)')}
              {renderInput('gesso_recomendado', 'Gesso (t/ha)')}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-12">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Análise'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
