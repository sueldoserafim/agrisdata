import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Check, ChevronsUpDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  transplantio_id: z.string().min(1, 'Selecione um transplantio'),
  talhao_id: z.string().min(1, 'Selecione um talhão'),
  data_replantio: z.string().min(1, 'Informe a data'),
  quantidade_replantada: z.coerce.number().int().min(1, 'A quantidade deve ser maior que zero'),
  motivo: z.string().min(1, 'Selecione o motivo'),
  observacoes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function ReplantioForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const preSelectedTransplantio = searchParams.get('transplantio')

  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [transplantios, setTransplantios] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])

  const [openTransplantio, setOpenTransplantio] = useState(false)
  const [openTalhao, setOpenTalhao] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transplantio_id: preSelectedTransplantio || '',
      talhao_id: '',
      data_replantio: new Date().toISOString().split('T')[0],
      quantidade_replantada: 0,
      motivo: '',
      observacoes: '',
    },
  })

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      if (id) {
        loadReplantio()
      }
    }
  }, [empresa, id])

  const tLabel = (t: any) =>
    `Lote ${t.lotes_mudas?.nome_lote} (${new Date(t.data_transplantio).toLocaleDateString('pt-BR')})`

  const loadDependencies = async () => {
    const { data: tData } = await supabase
      .from('transplantios')
      .select('id, data_transplantio, talhao_id, lotes_mudas(nome_lote)')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('data_transplantio', { ascending: false })

    if (tData) {
      setTransplantios(tData.map((t) => ({ ...t, label: tLabel(t) })))

      // Auto fill talhao if preSelected is available
      if (preSelectedTransplantio && !id) {
        const found = tData.find((x) => x.id === preSelectedTransplantio)
        if (found?.talhao_id) {
          form.setValue('talhao_id', found.talhao_id)
        }
      }
    }

    const { data: talData } = await supabase
      .from('talhoes')
      .select('id, nome')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('nome')

    if (talData) setTalhoes(talData)
  }

  const loadReplantio = async () => {
    const { data } = await supabase.from('replantios').select('*').eq('id', id).single()

    if (data) {
      form.reset({
        transplantio_id: data.transplantio_id,
        talhao_id: data.talhao_id,
        data_replantio: data.data_replantio,
        quantidade_replantada: data.quantidade_replantada,
        motivo: data.motivo,
        observacoes: data.observacoes || '',
      })
    }
  }

  const watchTransplantio = form.watch('transplantio_id')
  useEffect(() => {
    if (watchTransplantio && !id && transplantios.length > 0) {
      const selected = transplantios.find((t) => t.id === watchTransplantio)
      if (selected?.talhao_id) {
        form.setValue('talhao_id', selected.talhao_id)
      }
    }
  }, [watchTransplantio, transplantios, id, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      if (id) {
        const { error } = await supabase
          .from('replantios')
          .update(values)
          .eq('id', id)
          .eq('empresa_id', empresa!.id)
        if (error) throw error
        toast({ title: 'Replantio atualizado com sucesso!' })
      } else {
        const { error } = await supabase.from('replantios').insert({
          ...values,
          empresa_id: empresa!.id,
        })
        if (error) throw error
        toast({ title: 'Replantio registrado com sucesso!' })
      }
      navigate('/app/replantios')
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

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Replantio' : 'Novo Replantio'}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="transplantio_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transplantio de Origem</FormLabel>
                    <Popover open={openTransplantio} onOpenChange={setOpenTransplantio}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!!id}
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? transplantios.find((t) => t.id === field.value)?.label
                              : 'Selecione o transplantio (pesquisável)'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar transplantio por lote..." />
                          <CommandList>
                            <CommandEmpty>Nenhum transplantio encontrado.</CommandEmpty>
                            <CommandGroup>
                              {transplantios.map((t) => (
                                <CommandItem
                                  value={t.label}
                                  key={t.id}
                                  onSelect={() => {
                                    form.setValue('transplantio_id', t.id)
                                    setOpenTransplantio(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      t.id === field.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {t.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="talhao_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2.5">
                      <FormLabel className="mb-1">Talhão Destino</FormLabel>
                      <Popover open={openTalhao} onOpenChange={setOpenTalhao}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? talhoes.find((t) => t.id === field.value)?.nome
                                : 'Selecione o talhão'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar talhão..." />
                            <CommandList>
                              <CommandEmpty>Nenhum talhão encontrado.</CommandEmpty>
                              <CommandGroup>
                                {talhoes.map((t) => (
                                  <CommandItem
                                    value={t.nome}
                                    key={t.id}
                                    onSelect={() => {
                                      form.setValue('talhao_id', t.id)
                                      setOpenTalhao(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        t.id === field.value ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                    {t.nome}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_replantio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Replantio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantidade_replantada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Mudas</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Falha / Perda</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="falha_germinacao">Falha na Germinação</SelectItem>
                          <SelectItem value="pragas">Pragas</SelectItem>
                          <SelectItem value="doencas">Doenças</SelectItem>
                          <SelectItem value="clima">Clima</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes adicionais sobre o replantio..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Replantio
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
