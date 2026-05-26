import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
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
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  nome_lote: z.string().min(1, 'Nome do lote é obrigatório'),
  estufa_id: z.string().uuid('Selecione uma estufa'),
  cultura_id: z.string().uuid('Selecione uma cultura'),
  cultivar_id: z.string().uuid().optional().or(z.literal('')),
  quantidade_mudas: z.coerce.number().min(1, 'Quantidade deve ser maior que 0'),
  data_semeadura: z.string().optional(),
  data_prevista_transplantio: z.string().optional(),
  custo_total: z.coerce.number().min(0).optional(),
  status: z.enum(['germinando', 'em_desenvolvimento', 'pronto', 'transplantado', 'descartado']),
  observacoes: z.string().optional(),
})

export default function LoteMudaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [estufas, setEstufas] = useState<any[]>([])
  const [culturas, setCulturas] = useState<any[]>([])
  const [cultivares, setCultivares] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_lote: '',
      estufa_id: '',
      cultura_id: '',
      cultivar_id: '',
      quantidade_mudas: 0,
      custo_total: 0,
      status: 'germinando',
      data_semeadura: new Date().toISOString().split('T')[0],
      observacoes: '',
    },
  })

  const watchCulturaId = form.watch('cultura_id')

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      if (id) loadData()
    }
  }, [empresa, id])

  useEffect(() => {
    if (watchCulturaId && empresa) {
      supabase
        .from('cultivares')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .eq('cultura_id', watchCulturaId)
        .then(({ data }) => setCultivares(data || []))
    } else {
      setCultivares([])
    }
  }, [watchCulturaId, empresa])

  const loadDependencies = async () => {
    const [resEstufas, resCulturas] = await Promise.all([
      supabase
        .from('estufas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .eq('ativo', true)
        .is('deleted_at', null),
      supabase
        .from('culturas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
    ])
    if (resEstufas.data) setEstufas(resEstufas.data)
    if (resCulturas.data) setCulturas(resCulturas.data)
  }

  const loadData = async () => {
    const { data, error } = await supabase.from('lotes_mudas').select('*').eq('id', id).single()
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else if (data) {
      form.reset({
        nome_lote: data.nome_lote,
        estufa_id: data.estufa_id || '',
        cultura_id: data.cultura_id || '',
        cultivar_id: data.cultivar_id || '',
        quantidade_mudas: data.quantidade_mudas,
        custo_total: data.custo_total,
        status: data.status as any,
        data_semeadura: data.data_semeadura || '',
        data_prevista_transplantio: data.data_prevista_transplantio || '',
        observacoes: data.observacoes || '',
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const payload = {
      empresa_id: empresa!.id,
      ...values,
      cultivar_id: values.cultivar_id || null,
      data_semeadura: values.data_semeadura || null,
      data_prevista_transplantio: values.data_prevista_transplantio || null,
    }

    let error
    if (id) {
      const res = await supabase.from('lotes_mudas').update(payload).eq('id', id)
      error = res.error
    } else {
      const res = await supabase.from('lotes_mudas').insert(payload)
      error = res.error
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Lote salvo com sucesso' })
      navigate('/app/lotes-mudas')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/lotes-mudas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Lote de Mudas' : 'Novo Lote de Mudas'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identificação e Alocação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_lote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificação do Lote</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: LOTE-TOMATE-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estufa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estufa/Viveiro</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a estufa..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estufas.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.nome}
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
                name="cultura_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultura</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {culturas.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
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
                name="cultivar_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultivar/Variedade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchCulturaId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cultivares.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
                          </SelectItem>
                        ))}
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
              <CardTitle>Planejamento e Custos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantidade_mudas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd. de Sementes/Mudas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custo_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Total (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Atual</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="germinando">Germinando</SelectItem>
                        <SelectItem value="em_desenvolvimento">Em Desenvolvimento</SelectItem>
                        <SelectItem value="pronto">Pronto p/ Campo</SelectItem>
                        <SelectItem value="transplantado">Transplantado</SelectItem>
                        <SelectItem value="descartado">Descartado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_semeadura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Semeadura</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_prevista_transplantio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prev. Transplantio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-3">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes do lote..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Lote
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
