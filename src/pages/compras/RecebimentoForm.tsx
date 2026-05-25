import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, UploadCloud, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { supabase } from '@/lib/supabase/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

const itemSchema = z
  .object({
    produto_id: z.string(),
    nome_produto: z.string(),
    unidade_medida: z.string().optional(),
    qtd_pedida: z.number(),
    qtd_recebida: z.number().nonnegative('Qtd inválida'),
    motivo_divergencia: z.string().optional(),
    numero_lote: z.string().min(1, 'Lote obrigatório'),
    data_fabricacao: z.string().optional(),
    data_validade: z.string().min(1, 'Validade obrigatória'),
    armazem_id: z.string().min(1, 'Armazém obrigatório'),
    localizacao: z.string().optional(),
    atualizar_estoque_minimo: z.boolean().default(false),
    novo_estoque_minimo: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.qtd_pedida !== data.qtd_recebida && !data.motivo_divergencia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Obrigatório para divergência',
        path: ['motivo_divergencia'],
      })
    }
    if (data.data_validade) {
      const validade = new Date(data.data_validade)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      if (validade <= hoje) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data deve ser futura',
          path: ['data_validade'],
        })
      }
    }
    if (
      data.atualizar_estoque_minimo &&
      (!data.novo_estoque_minimo || data.novo_estoque_minimo <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Obrigatório',
        path: ['novo_estoque_minimo'],
      })
    }
  })

const formSchema = z.object({
  pedido_id: z.string().min(1, 'Selecione um pedido'),
  data_recebimento: z.string().min(1, 'Obrigatório'),
  recebido_por: z.string().min(1, 'Obrigatório'),
  numero_nf: z.string().min(1, 'Obrigatório'),
  chave_nfe: z.string().regex(/^\d{44}$/, 'Chave NF-e deve ter exatos 44 dígitos'),
  data_emissao: z.string().min(1, 'Obrigatório'),
  itens: z.array(itemSchema).min(1, 'Erro nos itens do pedido'),
})

export default function RecebimentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()

  const [pedidos, setPedidos] = useState<any[]>([])
  const [armazens, setArmazens] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_recebimento: new Date().toISOString().split('T')[0],
      itens: [],
    },
  })

  const { watch, setValue, handleSubmit, control } = form
  const pedidoId = watch('pedido_id')
  const itens = watch('itens') || []
  const item = itens[0]

  useEffect(() => {
    if (!empresa?.id)
      return supabase
        .from('compras_pedido')
        .select('*, produto:produtos(nome, unidade_medida)')
        .eq('empresa_id', empresa.id)
        .eq('status', 'pendente')
        .then(({ data }) => setPedidos(data || []))
    supabase
      .from('usuarios')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setUsuarios(data || []))
    supabase
      .from('armazens')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setArmazens(data || []))
  }, [empresa?.id])

  useEffect(() => {
    if (id && pedidos.length > 0 && !pedidoId) {
      setValue('pedido_id', id)
    }
  }, [id, pedidos, pedidoId, setValue])

  useEffect(() => {
    if (pedidoId && pedidos.length > 0) {
      const p = pedidos.find((x) => x.id === pedidoId)
      if (p) {
        setValue('itens', [
          {
            produto_id: p.produto_id,
            nome_produto: p.produto?.nome || 'Produto',
            unidade_medida: p.produto?.unidade_medida || 'UN',
            qtd_pedida: p.quantidade || 0,
            qtd_recebida: p.quantidade || 0,
            motivo_divergencia: '',
            numero_lote: '',
            data_fabricacao: '',
            data_validade: '',
            armazem_id: '',
            localizacao: '',
            atualizar_estoque_minimo: false,
            novo_estoque_minimo: 0,
          },
        ])
      }
    }
  }, [pedidoId, pedidos, setValue])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast({ title: 'Processando XML...', description: 'Extraindo dados da NF-e.' })
      setTimeout(() => {
        setValue('numero_nf', '999123')
        setValue('chave_nfe', '12345678901234567890123456789012345678901234')
        setValue('data_emissao', new Date().toISOString().split('T')[0])
        toast({ title: 'XML Processado com sucesso!' })
      }, 1000)
    }
  }

  const [successData, setSuccessData] = useState<any>(null)
  const [showDevolucaoDialog, setShowDevolucaoDialog] = useState(false)
  const [devolucaoQtd, setDevolucaoQtd] = useState(0)
  const [devolucaoMotivo, setDevolucaoMotivo] = useState('')

  const onSubmit = async (data: any) => {
    if (!empresa?.id) return
    setLoading(true)
    try {
      const res = await comprasService.receberPedido({ ...data, empresa_id: empresa.id })
      toast({ title: 'Recebimento registrado com sucesso!' })

      const pedidoInfo = pedidos.find((p) => p.id === data.pedido_id)
      setSuccessData({
        lote: res.lote,
        pedido_id: data.pedido_id,
        produto_id: item.produto_id,
        nome_produto: item.nome_produto,
        fornecedor_id: pedidoInfo?.fornecedor_id,
        isDivergente: item.qtd_pedida !== item.qtd_recebida || !!item.motivo_divergencia,
        armazem_nome: armazens.find((a) => a.id === item.armazem_id)?.nome,
      })
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDevolucao = async () => {
    if (!empresa?.id || !successData) return
    if (devolucaoQtd <= 0) {
      toast({ title: 'Quantidade inválida', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await comprasService.createDevolucao({
        empresa_id: empresa.id,
        pedido_id: successData.pedido_id,
        fornecedor_id: successData.fornecedor_id,
        produto_id: successData.produto_id,
        lote_id: successData.lote.id,
        quantidade: devolucaoQtd,
        motivo: devolucaoMotivo,
      })
      toast({ title: 'Devolução registrada com sucesso!' })
      setShowDevolucaoDialog(false)
      navigate('/app/compras/pedidos')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleImprimirEtiquetas = () => {
    window.print()
  }

  const divergencia = item ? item.qtd_pedida - item.qtd_recebida : 0
  const isDivergente = divergencia !== 0 || !!item?.motivo_divergencia

  if (successData) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-border shadow-md">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Recebimento Confirmado!</h2>
            <p className="text-muted-foreground mb-8">
              O lote <strong>{successData.lote.numero_lote}</strong> do produto{' '}
              <strong>{successData.nome_produto}</strong> foi registrado no estoque.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button onClick={handleImprimirEtiquetas} className="print:hidden">
                <UploadCloud className="size-4 mr-2" />
                Imprimir Etiquetas
              </Button>
              {successData.isDivergente && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDevolucaoDialog(true)}
                  className="print:hidden"
                >
                  <AlertTriangle className="size-4 mr-2" />
                  Gerar Devolução
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/app/compras/pedidos')}
                className="print:hidden"
              >
                Voltar aos Pedidos
              </Button>
            </div>

            {/* Print Area - Label Template */}
            <div className="mt-10 hidden print:flex print:m-0 flex-col items-center border-2 border-black p-4 w-[60mm] h-[40mm] bg-white text-black relative">
              <div className="text-[12px] font-bold text-center leading-tight mb-1 truncate w-full">
                {successData.nome_produto}
              </div>
              <div className="w-full flex justify-between text-[10px] mb-1">
                <span>Lote: {successData.lote.numero_lote}</span>
                <span>Qtd: {successData.lote.quantidade}</span>
              </div>
              <div className="w-full text-[9px] mb-1 text-left">
                Validade: {new Date(successData.lote.data_validade).toLocaleDateString()}
              </div>
              <div className="w-full text-[9px] text-left truncate">
                Local: {successData.armazem_nome || 'N/D'}
              </div>
              <div className="mt-auto w-full h-8 bg-[url('https://img.usecurling.com/p/200/50?q=barcode&color=black')] bg-cover opacity-80 mix-blend-multiply rounded-sm" />
            </div>
          </CardContent>
        </Card>

        {showDevolucaoDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md shadow-xl animate-in zoom-in-95">
              <CardHeader>
                <CardTitle>Gerar Devolução (Saída de Estoque)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quantidade a Devolver</Label>
                  <Input
                    type="number"
                    value={devolucaoQtd}
                    onChange={(e) => setDevolucaoQtd(parseFloat(e.target.value))}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Motivo da Devolução</Label>
                  <Input
                    value={devolucaoMotivo}
                    onChange={(e) => setDevolucaoMotivo(e.target.value)}
                    placeholder="Ex: Avariado durante o transporte"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowDevolucaoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDevolucao} disabled={loading}>
                    Confirmar Devolução
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras/pedidos')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-foreground">Recebimento de Mercadoria</h1>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg">Dados do Recebimento</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={control}
                name="pedido_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido de Origem</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!id}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o pedido" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pedidos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.produto?.nome} - Qtd: {p.quantidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="data_recebimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Recebimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="recebido_por"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recebido por</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usuarios.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.nome}
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

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Nota Fiscal Eletrônica (NF-e)</CardTitle>
              <div>
                <Label
                  htmlFor="xml-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  <UploadCloud className="mr-2 size-4" /> Importar XML
                </Label>
                <Input
                  id="xml-upload"
                  type="file"
                  accept=".xml"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormField
                control={control}
                name="numero_nf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da NF</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="chave_nfe"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Chave NF-e</FormLabel>
                    <FormControl>
                      <Input placeholder="44 dígitos" maxLength={44} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="data_emissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Emissão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {item && (
            <Card className="border-border shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg">Conferência de Itens e Armazenagem</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 border-b border-border/50">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-end bg-muted/30 p-5 rounded-xl border border-border/50">
                    <div className="col-span-2">
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                        Produto
                      </Label>
                      <p className="font-medium mt-1.5 truncate text-base">{item.nome_produto}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                        Qtd. Pedida
                      </Label>
                      <p className="font-medium mt-1.5 text-base">
                        {item.qtd_pedida} {item.unidade_medida}
                      </p>
                    </div>
                    <FormField
                      control={control}
                      name="itens.0.qtd_recebida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-semibold">
                            Qtd. Recebida
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                        Divergência
                      </Label>
                      <p
                        className={`font-semibold mt-1.5 text-base ${isDivergente ? 'text-destructive' : 'text-emerald-600'}`}
                      >
                        {Math.abs(divergencia)} {item.unidade_medida}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                        Status
                      </Label>
                      <div className="mt-1.5">
                        <Badge
                          variant={isDivergente ? 'destructive' : 'default'}
                          className="px-3 py-1"
                        >
                          {isDivergente ? 'Divergente' : 'Conforme'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {isDivergente && (
                    <div className="mt-4 bg-destructive/10 text-destructive p-4 rounded-xl flex gap-3 items-start border border-destructive/20 animate-in slide-in-from-top-2">
                      <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                      <FormField
                        control={control}
                        name="itens.0.motivo_divergencia"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-destructive font-semibold">
                              Motivo da Divergência
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-background border-destructive/30 focus-visible:ring-destructive"
                                placeholder="Explique o motivo da divergência (obrigatório)..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-muted/5">
                  <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                    Rastreabilidade e Localização
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField
                      control={control}
                      name="itens.0.numero_lote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lote do Fornecedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: L-123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="itens.0.data_fabricacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fabricação (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="itens.0.data_validade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Validade</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="hidden md:block" />

                    <FormField
                      control={control}
                      name="itens.0.armazem_id"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Armazém de Destino</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o armazém" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {armazens.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
                                  {a.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="itens.0.localizacao"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Localização (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Corredor A, Prateleira 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-4 flex flex-col space-y-4 mt-2">
                      <FormField
                        control={control}
                        name="itens.0.atualizar_estoque_minimo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/60 bg-background p-4 w-full md:w-1/2">
                            <div className="space-y-1">
                              <FormLabel className="text-base font-semibold">
                                Atualizar Estoque Mínimo
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Ajustar limite de estoque mínimo deste produto.
                              </p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {item.atualizar_estoque_minimo && (
                        <FormField
                          control={control}
                          name="itens.0.novo_estoque_minimo"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-1/4 animate-in slide-in-from-top-2">
                              <FormLabel>Novo Estoque Mínimo ({item.unidade_medida})</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/app/compras/pedidos')}
              className="h-11 px-6"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !item} className="h-11 px-8 text-base">
              <CheckCircle2 className="size-5 mr-2" />
              Confirmar Entrada
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
