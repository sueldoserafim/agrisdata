import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Leaf, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const itemSchema = z.object({
  item_tipo: z.enum(['insumo', 'mao_de_obra', 'energia', 'agua']),
  produto_id: z.string().optional(),
  descricao: z.string().optional(),
  quantidade: z.coerce.number().min(0.01),
  unidade: z.string().min(1, 'Obrigatório'),
  custo_unitario: z.coerce.number().min(0),
})

const formSchema = z.object({
  lote_muda_id: z.string().uuid('Selecione o lote origem'),
  safra_id: z.string().uuid('Selecione a safra destino'),
  talhao_id: z.string().uuid('Selecione o talhão destino'),
  data_transplantio: z.string().min(1, 'Data obrigatória'),
  quantidade_transplantada: z.coerce.number().min(1, 'Mínimo de 1 muda'),
  quantidade_replantio: z.coerce.number().min(0).default(0),
  area_plantada_ha: z.coerce.number().min(0.01).optional(),
  itens: z.array(itemSchema).default([]),
})

export default function TransplantioWizard() {
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [lotes, setLotes] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLote, setSelectedLote] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_transplantio: new Date().toISOString().split('T')[0],
      quantidade_transplantada: 0,
      quantidade_replantio: 0,
      itens: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'itens',
  })

  const watchLote = form.watch('lote_muda_id')

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      loadProdutos()
    }
  }, [empresa])

  useEffect(() => {
    if (watchLote && lotes.length > 0) {
      const lote = lotes.find((l) => l.id === watchLote)
      setSelectedLote(lote)
      if (lote && form.getValues('quantidade_transplantada') === 0) {
        form.setValue('quantidade_transplantada', lote.quantidade_viva)
      }
    } else {
      setSelectedLote(null)
    }
  }, [watchLote, lotes])

  const loadDependencies = async () => {
    const [resLotes, resSafras, resTalhoes] = await Promise.all([
      supabase
        .from('lotes_mudas')
        .select('*, culturas(nome)')
        .eq('empresa_id', empresa!.id)
        .eq('status', 'pronto')
        .is('deleted_at', null),
      supabase
        .from('safras')
        .select('id, nome_safra, codigo_safra')
        .eq('empresa_id', empresa!.id)
        .in('status', ['planejada', 'em_andamento'])
        .is('deleted_at', null),
      supabase
        .from('talhoes')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
    ])

    if (resLotes.data) setLotes(resLotes.data)
    if (resSafras.data) setSafras(resSafras.data)
    if (resTalhoes.data) setTalhoes(resTalhoes.data)
  }

  const loadProdutos = async () => {
    const { data } = await supabase
      .from('produtos')
      .select('id, nome, unidade_medida')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
    if (data) setProdutos(data)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedLote) return
    const totalMudadasUsadas = values.quantidade_transplantada + values.quantidade_replantio
    if (totalMudadasUsadas > selectedLote.quantidade_viva) {
      toast({
        title: 'Quantidade Excedida',
        description: 'A soma de transplantio e replantio é maior que o saldo vivo do lote.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('usuarios')
      .select('perfil')
      .eq('id', userData?.user?.id)
      .single()

    const isAdminOrManager = profile?.perfil === 'admin' || profile?.perfil === 'gerente'
    const { itens, ...transplantioValues } = values

    const { data: tData, error: tError } = await supabase
      .from('transplantios')
      .insert({
        empresa_id: empresa!.id,
        ...transplantioValues,
        data_transplantio: new Date(values.data_transplantio).toISOString(),
        responsavel_id: userData?.user?.id || null,
        confirmado: isAdminOrManager,
      })
      .select('id')
      .single()

    if (tError) {
      toast({
        title: 'Erro ao registrar transplantio',
        description: tError.message,
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    if (itens.length > 0) {
      const itensPayload = itens.map((i) => ({
        empresa_id: empresa!.id,
        transplantio_id: tData.id,
        item_tipo: i.item_tipo,
        produto_id: i.item_tipo === 'insumo' ? i.produto_id : null,
        descricao: i.item_tipo !== 'insumo' ? i.descricao : null,
        quantidade: i.quantidade,
        unidade: i.unidade,
        custo_unitario: i.custo_unitario,
      }))

      await supabase.from('transplantio_itens').insert(itensPayload)
    }

    toast({
      title: 'Transplantio Concluído',
      description: 'O lote e os custos operacionais foram registrados com sucesso.',
    })
    navigate('/app/transplantios')
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/transplantios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Transplantio</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Lote de Origem</CardTitle>
              <CardDescription>
                Apenas lotes com status "Pronto p/ Campo" são listados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="lote_muda_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote de Mudas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o lote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lotes.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.nome_lote} - {l.culturas?.nome} (Saldo: {l.quantidade_viva})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedLote && (
                <div className="bg-muted p-4 rounded-md text-sm grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold">Cultura:</span> {selectedLote.culturas?.nome}
                  </div>
                  <div>
                    <span className="font-semibold">Semeado em:</span>{' '}
                    {selectedLote.data_semeadura
                      ? new Date(selectedLote.data_semeadura).toLocaleDateString('pt-BR')
                      : '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Mudas Disponíveis:</span>{' '}
                    {selectedLote.quantidade_viva}
                  </div>
                  <div>
                    <span className="font-semibold">Custo/Muda:</span> R${' '}
                    {selectedLote.custo_por_muda}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Destino (Campo)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra || s.codigo_safra}
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
                name="talhao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Talhão Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Dados Operacionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_transplantio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Operação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_plantada_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Plantada (ha)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade_transplantada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mudas Plantadas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Quantidade de mudas transferidas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade_replantio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mudas p/ Replantio</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Mudas usadas para cobrir falhas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Custos Operacionais (Opcional)</CardTitle>
              <CardDescription>
                Adicione os insumos, mão de obra, água ou energia utilizados na operação do
                transplantio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border p-4 rounded-lg bg-card shadow-sm relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name={`itens.${index}.item_tipo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val)
                            if (val !== 'insumo') {
                              form.setValue(`itens.${index}.produto_id`, undefined)
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="insumo">Insumo</SelectItem>
                            <SelectItem value="mao_de_obra">Mão de Obra</SelectItem>
                            <SelectItem value="energia">Energia</SelectItem>
                            <SelectItem value="agua">Água</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`itens.${index}.produto_id`}
                    render={({ field }) => (
                      <FormItem
                        className={
                          form.watch(`itens.${index}.item_tipo`) !== 'insumo'
                            ? 'hidden'
                            : 'col-span-2'
                        }
                      >
                        <FormLabel>Insumo / Produto</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val)
                            const prod = produtos.find((p) => p.id === val)
                            if (prod) {
                              form.setValue(`itens.${index}.unidade`, prod.unidade_medida || 'un')
                            }
                          }}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {produtos.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nome}
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
                    name={`itens.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem
                        className={
                          form.watch(`itens.${index}.item_tipo`) === 'insumo'
                            ? 'hidden'
                            : 'col-span-2'
                        }
                      >
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Tratorista, Energia" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`itens.${index}.quantidade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`itens.${index}.unidade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: kg, h" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`itens.${index}.custo_unitario`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custo Un. (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    item_tipo: 'insumo',
                    quantidade: 0,
                    unidade: 'un',
                    custo_unitario: 0,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Custo
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading || !selectedLote}>
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <Leaf className="w-4 h-4 mr-2" />
                  Confirmar Transplantio
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
