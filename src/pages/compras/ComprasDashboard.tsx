import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, CheckCircle2, XCircle, ShoppingBag, Truck, BarChart3, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { comprasService } from '@/services/compras'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function ComprasDashboard() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [requisicoes, setRequisicoes] = useState<any[]>([])
  const [pedidos, setPedidos] = useState<any[]>([])
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [devolucoes, setDevolucoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    try {
      const reqs = await comprasService.getRequisicoes(empresa.id)
      const peds = await comprasService.getPedidos(empresa.id)
      const devs = await comprasService.getDevolucoes(empresa.id)
      const { data: forns } = await supabase
        .from('fornecedores')
        .select('id, nome')
        .eq('empresa_id', empresa.id)

      setRequisicoes(reqs)
      setPedidos(peds)
      setDevolucoes(devs || [])
      setFornecedores(forns || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleStatusReq = async (id: string, status: string) => {
    try {
      await comprasService.updateRequisicaoStatus(id, status)
      toast({ title: `Requisição ${status}` })
      loadData()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const aprovarCotacao = async (pedidoId: string, fornecedor_id: string, preco: number) => {
    try {
      await comprasService.updatePedido(pedidoId, {
        fornecedor_id,
        preco_unitario: preco,
        status: 'ativo',
      })
      toast({ title: 'Pedido gerado com sucesso' })
      loadData()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const pendentesAprovacao = requisicoes.filter((r) => r.status === 'pendente')
  const cotacoes = pedidos.filter(
    (p) => p.requisicao.status === 'aprovada' && p.status === 'pendente',
  )
  const pedidosAtivos = pedidos.filter((p) => p.status === 'ativo' || p.status === 'pendente')

  const totalEstimado = requisicoes.reduce(
    (acc, req) => acc + Number(req.valor_total_estimado || 0),
    0,
  )
  const totalPedidos = pedidosAtivos.reduce(
    (acc, ped) => acc + (ped.total_pedido || ped.quantidade * ped.preco_unitario || 0),
    0,
  )
  const economiaGerada = totalEstimado > 0 ? totalEstimado - totalPedidos : 0

  // Desempenho
  const chartData = fornecedores
    .map((f) => {
      const peds = pedidos.filter((p) => p.fornecedor_id === f.id && p.status === 'recebido')
      const conforme = peds.filter(
        (p) => p.avaliacao_recebimento === 'conforme' || !p.avaliacao_recebimento,
      ).length
      const divergente = peds.filter((p) => p.avaliacao_recebimento === 'divergente').length
      const total = conforme + divergente
      const efficiency = total > 0 ? Math.round((conforme / total) * 100) : 0
      return { fornecedor: f.nome, conforme, divergente, total, efficiency }
    })
    .filter((d) => d.total > 0)
    .sort((a, b) => b.efficiency - a.efficiency)

  const chartConfig = {
    conforme: { label: 'Conforme', color: 'hsl(var(--chart-2))' },
    divergente: { label: 'Divergente', color: 'hsl(var(--destructive))' },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Módulo de Compras</h1>
        <Button asChild>
          <Link to="/app/compras/requisicoes/new">
            <Plus className="size-4 mr-2" /> Nova Requisição
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Economia Gerada</p>
          <p
            className={`text-2xl font-bold ${economiaGerada > 0 ? 'text-green-600' : economiaGerada < 0 ? 'text-red-600' : ''}`}
          >
            R$ {economiaGerada.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Aprovações Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendentesAprovacao.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Pedidos Ativos</p>
          <p className="text-2xl font-bold text-blue-600">{pedidosAtivos.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Devoluções Recentes</p>
          <p className="text-2xl font-bold text-destructive">{devolucoes.length}</p>
        </div>
      </div>

      <Tabs defaultValue="ativos" className="w-full">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap w-full justify-start h-auto p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="ativos" className="py-2">
            <Truck className="w-4 h-4 mr-2" /> Pedidos ({pedidosAtivos.length})
          </TabsTrigger>
          <TabsTrigger value="aprovacoes" className="py-2">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Aprovações ({pendentesAprovacao.length})
          </TabsTrigger>
          <TabsTrigger value="cotacoes" className="py-2">
            <ShoppingBag className="w-4 h-4 mr-2" /> Cotações ({cotacoes.length})
          </TabsTrigger>
          <TabsTrigger value="devolucoes" className="py-2">
            <RotateCcw className="w-4 h-4 mr-2" /> Devoluções ({devolucoes.length})
          </TabsTrigger>
          <TabsTrigger value="desempenho" className="py-2">
            <BarChart3 className="w-4 h-4 mr-2" /> Desempenho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Req.</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosAtivos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenhum pedido ativo aguardando recebimento
                    </TableCell>
                  </TableRow>
                )}
                {pedidosAtivos.map((ped) => (
                  <TableRow key={ped.id}>
                    <TableCell>{ped.requisicao?.numero_requisicao}</TableCell>
                    <TableCell>{ped.fornecedor?.nome || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{ped.produto?.nome}</TableCell>
                    <TableCell>
                      {ped.quantidade} {ped.produto?.unidade_medida}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/app/compras/pedidos/${ped.id}`}>Ver</Link>
                        </Button>
                        {ped.status === 'ativo' && (
                          <Button size="sm" asChild>
                            <Link to={`/app/compras/pedidos/${ped.id}/receber`}>
                              <Truck className="size-4 mr-2" /> Receber NF-e
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="aprovacoes">
          <div className="border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendentesAprovacao.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhuma requisição pendente
                    </TableCell>
                  </TableRow>
                )}
                {pendentesAprovacao.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.numero_requisicao}</TableCell>
                    <TableCell>{new Date(req.data_requisicao).toLocaleDateString()}</TableCell>
                    <TableCell>{req.solicitante?.nome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleStatusReq(req.id, 'aprovada')}
                        >
                          <CheckCircle2 className="size-4 mr-1" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusReq(req.id, 'rejeitada')}
                        >
                          <XCircle className="size-4 mr-1" /> Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cotacoes">
          <div className="border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Req.</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotacoes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhum item aguardando cotação
                    </TableCell>
                  </TableRow>
                )}
                {cotacoes.map((ped) => (
                  <TableRow key={ped.id}>
                    <TableCell>{ped.requisicao?.numero_requisicao}</TableCell>
                    <TableCell className="font-medium">{ped.produto?.nome}</TableCell>
                    <TableCell>
                      {ped.quantidade} {ped.produto?.unidade_medida}
                    </TableCell>
                    <TableCell className="text-right">
                      <CotacaoDialog
                        pedido={ped}
                        fornecedores={fornecedores}
                        onConfirm={(fId, p) => aprovarCotacao(ped.id, fId, p)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="devolucoes">
          <div className="border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NF / Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devolucoes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhuma devolução registrada
                    </TableCell>
                  </TableRow>
                )}
                {devolucoes.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>{dev.pedido?.numero_nota_fiscal || '-'}</TableCell>
                    <TableCell>{dev.fornecedor?.nome}</TableCell>
                    <TableCell className="font-medium">{dev.produto?.nome}</TableCell>
                    <TableCell className="text-destructive font-semibold">
                      {dev.quantidade} {dev.produto?.unidade_medida}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={dev.motivo}>
                      {dev.motivo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        {dev.status === 'pendente' ? 'Pendente' : 'Concluído'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="desempenho">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg bg-card p-6 flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="font-semibold text-lg mb-6 self-start w-full">
                Recebimentos: Conforme vs Divergente
              </h3>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="w-full h-72">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="fornecedor" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="conforme"
                      fill="var(--color-conforme)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                    <Bar
                      dataKey="divergente"
                      fill="var(--color-divergente)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground">Dados insuficientes para gerar o gráfico.</p>
              )}
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Recebimentos</TableHead>
                    <TableHead className="text-right">Divergências</TableHead>
                    <TableHead className="text-right">Score (Eficiência)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhum dado de recebimento encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {chartData.map((d) => (
                    <TableRow key={d.fornecedor}>
                      <TableCell className="font-medium">{d.fornecedor}</TableCell>
                      <TableCell className="text-right">{d.total}</TableCell>
                      <TableCell className="text-right text-destructive">{d.divergente}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            d.efficiency >= 90
                              ? 'default'
                              : d.efficiency >= 70
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {d.efficiency}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CotacaoDialog({ pedido, fornecedores, onConfirm }: any) {
  const [forn, setForn] = useState('')
  const [preco, setPreco] = useState('')
  const [open, setOpen] = useState(false)

  const handle = () => {
    if (!forn || !preco) return
    onConfirm(forn, parseFloat(preco))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <ShoppingBag className="size-4 mr-2" /> Gerar Pedido
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprovar Cotação - {pedido.produto?.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fornecedor Selecionado</Label>
            <Select onValueChange={setForn} value={forn}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((f: any) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preço Unitário Negociado (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handle} disabled={!forn || !preco}>
            Confirmar e Gerar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
