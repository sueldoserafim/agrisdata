import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, CheckCircle, Trash2, Trophy } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export default function CotacaoDetail() {
  const { id } = useParams<{ id: string }>()
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [cotacao, setCotacao] = useState<any>(null)
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [availableFornecedores, setAvailableFornecedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVendorData, setNewVendorData] = useState({
    fornecedor_id: '',
    preco_unitario: '',
    prazo_entrega_dias: '',
    condicao_pagamento: '',
    validade_cotacao: '',
  })

  useEffect(() => {
    if (empresa?.id && id) {
      loadData()
    }
  }, [empresa?.id, id])

  async function loadData() {
    try {
      setLoading(true)
      const dataCotacao = await comprasService.getCotacao(id!)
      setCotacao(dataCotacao)

      const dataFornecedores = await comprasService.getFornecedoresCotacao(id!)

      const withScores = calculateScores(dataFornecedores || [])
      setFornecedores(withScores)

      const { data: allFornecedores } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null)

      setAvailableFornecedores(allFornecedores || [])
    } catch (err: any) {
      toast({ title: 'Erro ao carregar', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  function calculateScores(vendors: any[]) {
    const validVendors = vendors.filter(
      (v) => Number(v.preco_unitario) > 0 && Number(v.prazo_entrega_dias) > 0,
    )
    if (validVendors.length === 0) return vendors

    const minPrice = Math.min(...validVendors.map((v) => Number(v.preco_unitario)))
    const minDeadline = Math.min(...validVendors.map((v) => Number(v.prazo_entrega_dias)))

    return vendors
      .map((v) => {
        if (Number(v.preco_unitario) > 0 && Number(v.prazo_entrega_dias) > 0) {
          const priceScore = (minPrice / Number(v.preco_unitario)) * 50
          const deadlineScore = (minDeadline / Number(v.prazo_entrega_dias)) * 30
          const historyScore = 20
          const totalScore = priceScore + deadlineScore + historyScore
          return {
            ...v,
            score_final: totalScore.toFixed(2),
            priceScore,
            deadlineScore,
            historyScore,
          }
        }
        return { ...v, score_final: 0 }
      })
      .sort((a, b) => Number(b.score_final) - Number(a.score_final))
  }

  async function handleAddVendor() {
    if (
      !newVendorData.fornecedor_id ||
      !newVendorData.preco_unitario ||
      !newVendorData.prazo_entrega_dias
    ) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
      return
    }

    try {
      await comprasService.saveFornecedorCotacao({
        empresa_id: empresa!.id,
        cotacao_id: id,
        fornecedor_id: newVendorData.fornecedor_id,
        preco_unitario: Number(newVendorData.preco_unitario),
        prazo_entrega_dias: Number(newVendorData.prazo_entrega_dias),
        condicao_pagamento: newVendorData.condicao_pagamento,
        validade_cotacao: newVendorData.validade_cotacao || null,
      })
      toast({ title: 'Fornecedor adicionado' })
      setIsDialogOpen(false)
      setNewVendorData({
        fornecedor_id: '',
        preco_unitario: '',
        prazo_entrega_dias: '',
        condicao_pagamento: '',
        validade_cotacao: '',
      })
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  async function handleRemoveVendor(vendorId: string) {
    if (!confirm('Deseja remover este fornecedor?')) return
    try {
      await comprasService.deleteFornecedorCotacao(vendorId)
      toast({ title: 'Fornecedor removido' })
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  async function handleSelectWinner(vendor: any) {
    if (!confirm(`Confirmar ${vendor.fornecedor.nome} como vencedor e gerar Pedido de Compra?`))
      return
    try {
      const dataEntrega = new Date()
      dataEntrega.setDate(dataEntrega.getDate() + Number(vendor.prazo_entrega_dias))

      await comprasService.finalizarCotacao(id!, vendor.id, cotacao.requisicao_id, {
        empresa_id: empresa!.id,
        fornecedor_id: vendor.fornecedor_id,
        preco_unitario: vendor.preco_unitario,
        data_entrega_prevista: dataEntrega.toISOString().split('T')[0],
      })
      toast({ title: 'Pedido gerado com sucesso!' })
      navigate('/app/compras/pedidos')
    } catch (err: any) {
      toast({ title: 'Erro ao gerar pedido', description: err.message, variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>
  if (!cotacao) return <div className="p-8">Cotação não encontrada</div>

  const isFinalizada = cotacao.status === 'finalizada'

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras/cotacoes')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Cotação - Req. {cotacao.requisicao?.numero_requisicao}
              {isFinalizada ? (
                <Badge className="bg-green-600">Finalizada</Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Aberta
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Prazo para respostas: {format(new Date(cotacao.prazo_respostas), 'dd/MM/yyyy')} |
              Justificativa: {cotacao.requisicao?.justificativa}
            </p>
          </div>
        </div>

        {!isFinalizada && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Oferta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Oferta de Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Fornecedor</Label>
                  <Select
                    value={newVendorData.fornecedor_id}
                    onValueChange={(v) => setNewVendorData({ ...newVendorData, fornecedor_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFornecedores.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Preço Unitário (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newVendorData.preco_unitario}
                      onChange={(e) =>
                        setNewVendorData({ ...newVendorData, preco_unitario: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Prazo Entrega (dias)</Label>
                    <Input
                      type="number"
                      value={newVendorData.prazo_entrega_dias}
                      onChange={(e) =>
                        setNewVendorData({ ...newVendorData, prazo_entrega_dias: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Condição de Pagamento</Label>
                  <Input
                    placeholder="Ex: 30 dias"
                    value={newVendorData.condicao_pagamento}
                    onChange={(e) =>
                      setNewVendorData({ ...newVendorData, condicao_pagamento: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Validade da Cotação</Label>
                  <Input
                    type="date"
                    value={newVendorData.validade_cotacao}
                    onChange={(e) =>
                      setNewVendorData({ ...newVendorData, validade_cotacao: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddVendor}>Salvar Oferta</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Preço Unit.</TableHead>
              <TableHead className="text-center">Prazo (Dias)</TableHead>
              <TableHead>Cond. Pgto</TableHead>
              <TableHead className="text-center">Score (0-100)</TableHead>
              <TableHead className="text-center">Detalhe Score</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma oferta registrada.
                </TableCell>
              </TableRow>
            ) : (
              fornecedores.map((vendor, index) => {
                const isBest = index === 0 && vendor.score_final > 0 && !isFinalizada
                return (
                  <TableRow key={vendor.id} className={vendor.vencedor ? 'bg-green-50/50' : ''}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {vendor.vencedor && <Trophy className="w-4 h-4 text-yellow-500" />}
                      {vendor.fornecedor?.nome}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {Number(vendor.preco_unitario).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">{vendor.prazo_entrega_dias}</TableCell>
                    <TableCell>{vendor.condicao_pagamento || '-'}</TableCell>
                    <TableCell className="text-center font-bold text-lg">
                      <span className={isBest ? 'text-green-600' : ''}>{vendor.score_final}</span>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      P: {vendor.priceScore?.toFixed(1)} | D: {vendor.deadlineScore?.toFixed(1)} |
                      H: {vendor.historyScore}
                    </TableCell>
                    <TableCell className="text-right">
                      {isFinalizada ? (
                        vendor.vencedor && <Badge className="bg-green-600">Vencedor</Badge>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                            onClick={() => handleSelectWinner(vendor)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Vencedor
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVendor(vendor.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
