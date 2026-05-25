import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useEmpresa } from '@/hooks/use-empresa'
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
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const schema = z.object({
  data_requisicao: z.string().min(1, 'Data é obrigatória'),
  safra_id: z.string().optional(),
  prioridade: z.enum(['baixa', 'média', 'alta', 'urgente']),
  justificativa: z.string().optional(),
  observacoes: z.string().optional(),
  itens: z
    .array(
      z.object({
        produto_id: z.string().min(1, 'Produto obrigatório'),
        quantidade: z.coerce.number().positive('Qtd > 0'),
        preco_estimado_unit: z.coerce.number().min(0, 'Preço >= 0'),
        unidade_medida: z.string().optional(),
      }),
    )
    .min(1, 'Adicione ao menos um item'),
})

type FormValues = z.infer<typeof schema>

export default function RequisicaoForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { empresa } = useEmpresa()
  const [safras, setSafras] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      data_requisicao: new Date().toISOString().split('T')[0],
      prioridade: 'média',
      itens: [{ produto_id: '', quantidade: 1, preco_estimado_unit: 0, unidade_medida: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'itens' })
  const watchedItens = form.watch('itens')
  const totalEstimado = watchedItens.reduce(
    (acc, i) => acc + i.quantidade * i.preco_estimado_unit,
    0,
  )

  useEffect(() => {
    if (!empresa) return
    supabase
      .from('safras')
      .select('id, talhao:talhoes(nome), cultivar:cultivares(nome)')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setSafras(data || []))
    supabase
      .from('produtos')
      .select('id, nome, unidade_medida')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setProdutos(data || []))
  }, [empresa])

  const onProdutoChange = (index: number, produtoId: string) => {
    form.setValue(`itens.${index}.produto_id`, produtoId)
    const prod = produtos.find((p) => p.id === produtoId)
    if (prod) form.setValue(`itens.${index}.unidade_medida`, prod.unidade_medida || '')
  }

  const onSubmit = async (data: FormValues) => {
    if (!empresa || !user) return
    setLoading(true)
    try {
      const isAutoAprovada = totalEstimado <= 500
      const status = isAutoAprovada ? 'aprovada' : 'pendente'
      const numero = `REQ-${Date.now().toString().slice(-6)}`

      const { data: req, error } = await supabase
        .from('compras_requisicao')
        .insert({
          empresa_id: empresa.id,
          solicitante_id: user.id,
          numero_requisicao: numero,
          data_requisicao: data.data_requisicao,
          safra_id: data.safra_id || null,
          prioridade: data.prioridade,
          justificativa: data.justificativa,
          observacoes: data.observacoes,
          valor_total_estimado: totalEstimado,
          status,
        })
        .select()
        .single()

      if (error) throw error

      const itens = data.itens.map((i) => ({
        empresa_id: empresa.id,
        requisicao_id: req.id,
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: i.preco_estimado_unit,
        status: 'pendente',
      }))

      const { error: errItens } = await supabase.from('compras_pedido').insert(itens)
      if (errItens) throw errItens

      toast({
        title: 'Sucesso',
        description: isAutoAprovada
          ? 'Solicitação aprovada automaticamente!'
          : 'Solicitação enviada para aprovação gerencial.',
      })
      navigate('/app/compras/requisicoes')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nova Solicitação de Compra</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Principais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_requisicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="média">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Safra (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a safra vinculada" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.talhao?.nome} - {s.cultivar?.nome}
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
                name="justificativa"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Justificativa</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Motivo da necessidade de compra..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Itens da Solicitação</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    produto_id: '',
                    quantidade: 1,
                    preco_estimado_unit: 0,
                    unidade_medida: '',
                  })
                }
              >
                <Plus className="mr-2 size-4" /> Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Produto</TableHead>
                      <TableHead className="w-[100px]">Qtd</TableHead>
                      <TableHead className="w-[100px]">Unidade</TableHead>
                      <TableHead className="w-[150px]">Preço Est. (R$)</TableHead>
                      <TableHead className="w-[150px]">Total (R$)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const itemTotal =
                        (watchedItens[index]?.quantidade || 0) *
                        (watchedItens[index]?.preco_estimado_unit || 0)
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`itens.${index}.produto_id`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={(v) => onProdutoChange(index, v)}
                                    defaultValue={f.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Produto..." />
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
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`itens.${index}.quantidade`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...f} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`itens.${index}.unidade_medida`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input readOnly disabled {...f} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`itens.${index}.preco_estimado_unit`}
                              render={({ field: f }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...f} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="align-middle font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(itemTotal)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="bg-muted p-4 rounded-lg text-lg font-semibold border">
                  Total Estimado:{' '}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    totalEstimado,
                  )}
                </div>
              </div>
              {totalEstimado > 500 && (
                <p className="text-sm text-amber-600 mt-2 text-right">
                  * Compras acima de R$ 500,00 exigem aprovação gerencial.
                </p>
              )}
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações Gerais</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Salvar Solicitação
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
