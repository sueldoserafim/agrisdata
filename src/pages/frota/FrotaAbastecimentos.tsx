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
import { ModuleHelp } from '@/components/ModuleHelp'

export default function FrotaAbastecimentos() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: abs } = await supabase
      .from('frota_abastecimentos')
      .select('*, veiculo:frota_veiculos(modelo, placa)')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (abs) setData(abs)

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

    try {
      const { error } = await supabase.from('frota_abastecimentos').insert({
        empresa_id: empresa.id,
        veiculo_id: fd.get('veiculo_id'),
        litros: Number(fd.get('litros')),
        valor_total: Number(fd.get('valor_total')),
        km_registro: Number(fd.get('km_registro')),
      })
      if (error) throw error
      toast.success('Abastecimento registrado com sucesso!')
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
          <h1 className="text-3xl font-bold tracking-tight">Abastecimentos</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModuleHelp
            title="Consumo de Combustível"
            description="Lançamento de abastecimentos."
            rules={[
              'Os valores financeiros devem ser estritamente maiores que 0.',
              'O sistema calcula a média de Km/L. Caso note um desvio fora do padrão (> 20%), um alerta será disparado automaticamente.',
            ]}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Lançar Abastecimento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Abastecimento</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4 mt-4">
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
                  <Label>KM no Hodômetro</Label>
                  <Input type="number" step="0.1" name="km_registro" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Litros</Label>
                    <Input type="number" step="0.01" min="0.01" name="litros" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Total (R$)</Label>
                    <Input type="number" step="0.01" min="0.01" name="valor_total" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Salvar Registro
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Hodômetro (KM)</TableHead>
                <TableHead>Litros</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {item.veiculo?.modelo} - {item.veiculo?.placa}
                  </TableCell>
                  <TableCell>{Number(item.km_registro).toLocaleString('pt-BR')} km</TableCell>
                  <TableCell>{item.litros} L</TableCell>
                  <TableCell>
                    R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
