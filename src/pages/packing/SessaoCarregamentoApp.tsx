import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, X, Box, Search, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function SessaoCarregamentoApp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [sessao, setSessao] = useState<any>(null)
  const [pallets, setPallets] = useState<any[]>([])
  const [scanned, setScanned] = useState<string[]>([])
  const [inputCode, setInputCode] = useState('')

  const loadData = async () => {
    const { data: sessaoData } = await supabase
      .from('sessoes_carregamento')
      .select(`*, romaneio:romaneios_venda(numero_romaneio)`)
      .eq('id', id)
      .single()
    if (sessaoData) {
      setSessao(sessaoData)
      const { data: palletsData } = await supabase
        .from('pallets')
        .select('*')
        .eq('romaneio_id', sessaoData.romaneio_id)
      setPallets(palletsData || [])
    }
  }

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode) return
    const pallet = pallets.find((p) => p.codigo_pallet === inputCode || p.codigo === inputCode)
    if (!pallet) {
      toast({
        title: 'Atenção',
        description: 'Pallet não pertence a este romaneio.',
        variant: 'destructive',
      })
    } else if (scanned.includes(pallet.id)) {
      toast({ title: 'Aviso', description: 'Pallet já bipado.' })
    } else {
      setScanned([...scanned, pallet.id])
      toast({ title: 'Sucesso', description: 'Pallet adicionado ao carregamento!' })
    }
    setInputCode('')
  }

  const finalizarCarregamento = async () => {
    if (scanned.length < pallets.length) {
      if (
        !confirm(
          'Ainda há pallets não carregados. Deseja finalizar mesmo assim (Romaneio parcial)?',
        )
      )
        return
    }
    await supabase.from('sessoes_carregamento').update({ status: 'concluido' }).eq('id', id)
    toast({ title: 'Sucesso', description: 'Carregamento finalizado!' })
    navigate('/app/packing/expedicao')
  }

  if (!sessao) return <div className="p-8">Carregando sessão...</div>

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Docas - Carregamento</h1>
          <p className="text-muted-foreground">
            Romaneio: {sessao.romaneio?.numero_romaneio} | Veículo: {sessao.veiculo_placa}
          </p>
        </div>
        <Button
          onClick={finalizarCarregamento}
          disabled={sessao.status === 'concluido'}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Finalizar Carga ({scanned.length}/{pallets.length})
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleScan} className="flex gap-4">
            <Input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Bipe ou digite o código do Pallet (ex: PALLET-2026-0001)"
              autoFocus
              className="text-lg uppercase"
              disabled={sessao.status === 'concluido'}
            />
            <Button type="submit" size="lg" disabled={sessao.status === 'concluido'}>
              <Search className="w-5 h-5 mr-2" /> Localizar
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {pallets.map((p) => {
          const isScanned = scanned.includes(p.id) || p.status === 'carregado'
          return (
            <Card key={p.id} className={isScanned ? 'border-emerald-500 bg-emerald-50/50' : ''}>
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${isScanned ? 'bg-emerald-100 text-emerald-600' : 'bg-secondary text-muted-foreground'}`}
                  >
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{p.codigo_pallet || p.codigo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {p.peso_liquido_kg} kg | {p.quantidade_caixas} cx
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {!isScanned && sessao.status !== 'concluido' && (
                    <DivergenciaModal
                      pallet={p}
                      sessaoId={sessao.id}
                      empresaId={sessao.empresa_id}
                    />
                  )}
                  {isScanned ? (
                    <Badge className="bg-emerald-500">
                      <Check className="w-4 h-4 mr-1" /> Carregado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      <X className="w-4 h-4 mr-1" /> Pendente
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function DivergenciaModal({ pallet, sessaoId, empresaId }: any) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [motivo, setMotivo] = useState('')

  const handleSalvar = async () => {
    if (!motivo)
      return toast({ title: 'Atenção', description: 'Informe o motivo', variant: 'destructive' })
    await supabase.from('divergencias_carregamento').insert({
      empresa_id: empresaId,
      sessao_id: sessaoId,
      pallet_id: pallet.id,
      tipo_divergencia: 'qualidade',
      motivo: motivo,
    })
    toast({ title: 'Registrado', description: 'Divergência registrada para o pallet.' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <AlertTriangle className="w-4 h-4 mr-2" /> Divergência
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Divergência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Motivo da Divergência (Qualidade, Danificado, etc)</Label>
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Caixas amassadas"
            />
          </div>
          <Button onClick={handleSalvar} className="w-full" variant="destructive">
            Salvar Divergência
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
