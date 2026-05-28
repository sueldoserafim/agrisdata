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
import { Badge } from '@/components/ui/badge'

export default function FrotaManutencoes() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: mn } = await supabase
      .from('frota_manutencoes')
      .select('*, veiculo:frota_veiculos(modelo, placa)')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (mn) setData(mn)

    const { data: v } = await supabase
      .from('frota_veiculos')
      .select('id, modelo, placa')
      .eq('empresa_id', empresa.id)
    if (v) setVeiculos(v)
  }

  useEffect(() => {
    fetchDados()
  }, [empresa])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!empresa) return
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const custo = Number(fd.get('custo')) || 0
    if (custo < 0) {
      toast.error('O custo não pode ser negativo')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.from('frota_manutencoes').insert({
        empresa_id: empresa.id,
        veiculo_id: fd.get('veiculo_id'),
        tipo: fd.get('tipo'),
        data_prevista: fd.get('data_prevista') || null,
        data_realizada: fd.get('data_realizada') || null,
        os_numero: fd.get('os_numero'),
        custo,
      })
      if (error) throw error
      toast.success('Manutenção salva!')
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
          <h1 className="text-3xl font-bold tracking-tight">Manutenções</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Agendar/Registrar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ordem de Serviço (Oficina)</DialogTitle>
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
                          {v.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select name="tipo" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventiva">Preventiva</SelectItem>
                      <SelectItem value="corretiva">Corretiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Prevista</Label>
                  <Input type="date" name="data_prevista" />
                </div>
                <div className="space-y-2">
                  <Label>Data Realizada</Label>
                  <Input type="date" name="data_realizada" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OS Número</Label>
                  <Input name="os_numero" placeholder="OS-001" />
                </div>
                <div className="space-y-2">
                  <Label>Custo (R$)</Label>
                  <Input type="number" step="0.01" name="custo" defaultValue={0} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Salvar
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
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead>Realização</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.veiculo?.modelo}</TableCell>
                  <TableCell className="capitalize">{item.tipo}</TableCell>
                  <TableCell>
                    {item.data_prevista ? new Date(item.data_prevista).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {item.data_realizada ? new Date(item.data_realizada).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    R$ {item.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.data_realizada ? 'default' : 'secondary'}>
                      {item.data_realizada ? 'Concluída' : 'Pendente'}
                    </Badge>
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
