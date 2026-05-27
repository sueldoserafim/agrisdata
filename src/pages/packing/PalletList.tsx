import { useEffect, useState } from 'react'
import { Plus, Printer } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PalletList() {
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState<string>('_all')
  const [filterProduto, setFilterProduto] = useState<string>('_all')
  const [filterCalibre, setFilterCalibre] = useState<string>('')

  const [recepcoes, setRecepcoes] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [form, setForm] = useState({
    recepcao_id: '',
    produto_id: '',
    peso_liquido_kg: '',
    quantidade_caixas: '',
    calibre: '',
    temperatura_camara: '',
  })

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    let query = supabase
      .from('pallets')
      .select(
        `id, codigo_pallet, peso_liquido_kg, quantidade_caixas, status, created_at, calibre, produto_id, produto:produtos(nome)`,
      )
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })

    if (filterStatus !== '_all') query = query.eq('status', filterStatus)
    if (filterProduto !== '_all') query = query.eq('produto_id', filterProduto)
    if (filterCalibre) query = query.ilike('calibre', `%${filterCalibre}%`)

    const { data, error } = await query

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setItems(data || [])

    // Fetch dropdowns
    const [{ data: rData }, { data: pData }] = await Promise.all([
      supabase
        .from('packing_recepcoes')
        .select('id, data_recepcao, colheita:colheita_registros(lote_producao)')
        .eq('empresa_id', empresa.id),
      supabase.from('produtos').select('id, nome').eq('empresa_id', empresa.id),
    ])
    setRecepcoes(rData || [])
    setProdutos(pData || [])

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id, filterStatus, filterProduto, filterCalibre])

  const handleCreate = async () => {
    if (!empresa?.id) return
    const { data, error } = await supabase
      .from('pallets')
      .insert({
        empresa_id: empresa.id,
        recepcao_id: form.recepcao_id || null,
        produto_id: form.produto_id || null,
        peso_liquido_kg: Number(form.peso_liquido_kg) || 0,
        quantidade_caixas: Number(form.quantidade_caixas) || 0,
        calibre: form.calibre,
        temperatura_camara: Number(form.temperatura_camara) || null,
        status: 'em_camara',
      })
      .select()
      .single()

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Pallet criado com sucesso.' })
      setOpenModal(false)
      loadData()
    }
  }

  const printLabel = async (pallet: any) => {
    toast({
      title: 'Gerando Etiqueta',
      description: `Enviando ZPL do Pallet: ${pallet.codigo_pallet} para impressora...`,
    })

    if (empresa?.id && user?.id) {
      await supabase.from('etiquetas_impressas').insert({
        empresa_id: empresa.id,
        pallet_id: pallet.id,
        numero_etiqueta: pallet.codigo_pallet,
        impresso_por: user.id,
      })
      await supabase.from('pallets').update({ etiqueta_impressa: true }).eq('id', pallet.id)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Pallets</h1>
          <p className="text-muted-foreground">Controle de pallets formados no packing house.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos Status</SelectItem>
              <SelectItem value="em_camara">Em Câmara</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="carregado">Carregado</SelectItem>
              <SelectItem value="descartado">Descartado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterProduto} onValueChange={setFilterProduto}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos Produtos</SelectItem>
              {produtos.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Calibre..."
            value={filterCalibre}
            onChange={(e) => setFilterCalibre(e.target.value)}
            className="w-[140px]"
          />
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Novo Pallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Pallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Recepção (Lote)</Label>
                  <Select
                    value={form.recepcao_id}
                    onValueChange={(v) => setForm({ ...form, recepcao_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {recepcoes.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.colheita?.lote_producao} -{' '}
                          {new Date(r.data_recepcao).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select
                    value={form.produto_id}
                    onValueChange={(v) => setForm({ ...form, produto_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Peso Líquido (kg)</Label>
                    <Input
                      type="number"
                      value={form.peso_liquido_kg}
                      onChange={(e) => setForm({ ...form, peso_liquido_kg: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Qtd Caixas</Label>
                    <Input
                      type="number"
                      value={form.quantidade_caixas}
                      onChange={(e) => setForm({ ...form, quantidade_caixas: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calibre</Label>
                    <Input
                      value={form.calibre}
                      onChange={(e) => setForm({ ...form, calibre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temp. Câmara (°C)</Label>
                    <Input
                      type="number"
                      value={form.temperatura_camara}
                      onChange={(e) => setForm({ ...form, temperatura_camara: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreate}>
                  Salvar Pallet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Pallets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Data Formação</TableHead>
                <TableHead>Peso Líq (kg)</TableHead>
                <TableHead>Caixas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhum pallet registrado.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-semibold">{item.codigo_pallet}</TableCell>
                  <TableCell>{item.produto?.nome || 'N/A'}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{item.peso_liquido_kg}</TableCell>
                  <TableCell>{item.quantidade_caixas}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Imprimir Etiqueta ZPL"
                      onClick={() => printLabel(item)}
                    >
                      <Printer className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
