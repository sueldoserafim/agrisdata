import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Truck } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function SessaoCarregamentoList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [sessoes, setSessoes] = useState<any[]>([])
  const [romaneiosDisponiveis, setRomaneiosDisponiveis] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ romaneio_id: '', veiculo_placa: '', motorista_nome: '' })

  const loadData = async () => {
    if (!empresa?.id) return
    const { data } = await supabase
      .from('sessoes_carregamento')
      .select('*, romaneio:romaneios_venda(numero_romaneio)')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    setSessoes(data || [])

    const { data: romData } = await supabase
      .from('romaneios_venda')
      .select('*')
      .eq('empresa_id', empresa.id)
      .in('status', ['em_aberto', 'parcial'])
    setRomaneiosDisponiveis(romData || [])
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const handleStart = async () => {
    if (!form.romaneio_id) return
    const { data, error } = await supabase
      .from('sessoes_carregamento')
      .insert({
        empresa_id: empresa?.id,
        romaneio_id: form.romaneio_id,
        veiculo_placa: form.veiculo_placa,
        motorista_nome: form.motorista_nome,
      })
      .select()
      .single()

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Sessão de carregamento iniciada.' })
      navigate(`/app/packing/expedicao/${data.id}`)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expedição (Sessões de Carregamento)</h1>
          <p className="text-muted-foreground">Controle de docas e leitura de carga</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Iniciar Carregamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessão de Carregamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Romaneio de Venda</Label>
                <Select onValueChange={(v) => setForm({ ...form, romaneio_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um romaneio" />
                  </SelectTrigger>
                  <SelectContent>
                    {romaneiosDisponiveis.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.numero_romaneio} ({r.total_pallets} pallets)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Placa do Veículo</Label>
                <Input
                  value={form.veiculo_placa}
                  onChange={(e) => setForm({ ...form, veiculo_placa: e.target.value })}
                  placeholder="AAA-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Nome do Motorista</Label>
                <Input
                  value={form.motorista_nome}
                  onChange={(e) => setForm({ ...form, motorista_nome: e.target.value })}
                />
              </div>
              <Button onClick={handleStart} className="w-full" disabled={!form.romaneio_id}>
                Criar e Iniciar Bipagem
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Romaneio</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessoes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.data_carregamento).toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{s.romaneio?.numero_romaneio}</TableCell>
                  <TableCell>{s.veiculo_placa}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === 'em_andamento'
                          ? 'secondary'
                          : s.status === 'concluido'
                            ? 'default'
                            : 'destructive'
                      }
                      className="capitalize"
                    >
                      {s.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" asChild>
                      <Link to={`/app/packing/expedicao/${s.id}`}>
                        <Truck className="w-4 h-4 mr-2" /> Acessar Docas
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sessoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma sessão encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
