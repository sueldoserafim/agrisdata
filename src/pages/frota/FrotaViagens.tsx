import { useEffect, useState } from 'react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function FrotaViagens() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: vg } = await supabase
      .from('frota_viagens')
      .select('*, veiculo:frota_veiculos(modelo, placa), motorista:funcionarios(nome)')
      .eq('empresa_id', empresa.id)
      .order('data_inicio', { ascending: false })
    if (vg) setData(vg)

    const { data: v } = await supabase
      .from('frota_veiculos')
      .select('id, modelo, placa')
      .eq('empresa_id', empresa.id)
    if (v) setVeiculos(v)

    const { data: f } = await supabase
      .from('funcionarios')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
    if (f) setFuncionarios(f)
  }

  useEffect(() => {
    fetchDados()
  }, [empresa])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!empresa) return
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      const { error } = await supabase.from('frota_viagens').insert({
        empresa_id: empresa.id,
        veiculo_id: fd.get('veiculo_id'),
        motorista_id: fd.get('motorista_id'),
        origem: fd.get('origem'),
        destino: fd.get('destino'),
        km_inicial: fd.get('km_inicial'),
        data_inicio: new Date().toISOString(),
      })
      if (error) throw error
      toast.success('Viagem registrada com sucesso!')
      setOpen(false)
      fetchDados()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diário de Viagens</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Registrar Saída</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Viagem</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select name="veiculo_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculos.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.modelo} ({v.placa})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Motorista</Label>
                  <Select name="motorista_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origem</Label>
                  <Input name="origem" required />
                </div>
                <div className="space-y-2">
                  <Label>Destino</Label>
                  <Input name="destino" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>KM Inicial</Label>
                <Input type="number" step="0.1" name="km_inicial" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Iniciar Viagem
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Início</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Trajeto</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.data_inicio).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{item.veiculo?.modelo}</TableCell>
                  <TableCell>{item.motorista?.nome}</TableCell>
                  <TableCell>
                    {item.origem} → {item.destino}
                  </TableCell>
                  <TableCell>{item.data_fim ? 'Concluída' : 'Em Andamento'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
