import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, HelpCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { pluviometriaService } from '@/services/pluviometria'

const formSchema = z.object({
  talhao_id: z.string().min(1, 'Talhão é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  precipitacao_mm: z.coerce.number().min(0, 'Valor deve ser positivo'),
})

type FormValues = z.infer<typeof formSchema>

export default function PluviometriaForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { toast } = useToast()

  const [talhoes, setTalhoes] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      talhao_id: '',
      data: format(new Date(), 'yyyy-MM-dd'),
      precipitacao_mm: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: talhoesData, error } = await supabase
          .from('talhoes')
          .select('id, nome')
          .is('deleted_at', null)
          .order('nome')

        if (error) throw error
        if (talhoesData) setTalhoes(talhoesData)

        if (isEditing && id) {
          const record = await pluviometriaService.getById(id)
          form.reset({
            talhao_id: record.talhao_id,
            data: record.data || format(new Date(), 'yyyy-MM-dd'),
            precipitacao_mm: record.precipitacao_mm || 0,
          })
        }
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar dados',
          description: error.message,
          variant: 'destructive',
        })
      }
    }

    fetchData()
  }, [id, isEditing, form, toast])

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      if (isEditing && id) {
        await pluviometriaService.update(id, values)
        toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso.' })
      } else {
        await pluviometriaService.create(values)
        toast({ title: 'Sucesso', description: 'Registro criado com sucesso.' })
      }
      navigate('/app/agronomia/pluviometria')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/agronomia/pluviometria">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {isEditing ? 'Editar Registro' : 'Novo Registro de Pluviometria'}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Informações da Leitura</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Como registrar a Pluviometria</DialogTitle>
                <DialogDescription className="text-base pt-2 text-slate-600">
                  Insira o valor lido no pluviômetro do talhão selecionado. Para conformidade
                  GLOBALG.A.P., certifique-se de registrar a leitura no mesmo horário todos os dias.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="talhao_id"
                  render={({ field }) => (
                    <FormItem className="col-span-full xl:col-span-1">
                      <FormLabel>
                        Talhão <span className="text-red-500">*</span>
                      </FormLabel>
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

                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Data da Leitura <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="precipitacao_mm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Precipitação (mm) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Ex: 15.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link to="/app/agronomia/pluviometria">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Salvando...' : 'Salvar Registro'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
