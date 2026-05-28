import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { sustentabilidadeService } from '@/services/sustentabilidade'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, CloudRain } from 'lucide-react'
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
import { toast } from '@/components/ui/use-toast'

export default function EmissoesCarbono() {
  const { empresa } = useEmpresa()
  const [emissoes, setEmissoes] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    fonte_emissao: 'combustivel',
    quantidade: '',
    unidade: 'L',
    fator_conversao_ipcc: '2.68',
    data_registro: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (empresa?.id) load()
  }, [empresa?.id])

  const load = async () => {
    const { data } = await sustentabilidadeService.getEmissoes(empresa!.id)
    if (data) setEmissoes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const qtd = parseFloat(formData.quantidade)
    const fator = parseFloat(formData.fator_conversao_ipcc)
    const co2e = qtd * fator

    const { error } = await sustentabilidadeService.createEmissao({
      empresa_id: empresa!.id,
      fonte_emissao: formData.fonte_emissao,
      quantidade: qtd,
      unidade: formData.unidade,
      fator_conversao_ipcc: fator,
      co2e_total: co2e,
      data_registro: formData.data_registro,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro adicionado.' })
      setOpen(false)
      load()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CloudRain className="h-8 w-8" /> Emissões de Carbono
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Registrar Emissão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Registro de Emissão (IPCC)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  required
                  value={formData.data_registro}
                  onChange={(e) => setFormData({ ...formData, data_registro: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fonte Emissora</Label>
                <Select
                  value={formData.fonte_emissao}
                  onValueChange={(v) => setFormData({ ...formData, fonte_emissao: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combustivel">Combustível Fóssil (Diesel)</SelectItem>
                    <SelectItem value="fertilizante">Fertilizantes Nitrogenados</SelectItem>
                    <SelectItem value="eletricidade">Energia Elétrica (Grid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Input
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fator de Conversão IPCC (kg CO2e/un)</Label>
                <Input
                  type="number"
                  step="0.001"
                  required
                  value={formData.fator_conversao_ipcc}
                  onChange={(e) =>
                    setFormData({ ...formData, fator_conversao_ipcc: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
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
                <TableHead>Data</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Consumo</TableHead>
                <TableHead>Fator IPCC</TableHead>
                <TableHead className="text-right">Total CO2e (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emissoes.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.data_registro}</TableCell>
                  <TableCell className="capitalize">{e.fonte_emissao.replace('_', ' ')}</TableCell>
                  <TableCell>
                    {e.quantidade} {e.unidade}
                  </TableCell>
                  <TableCell>{e.fator_conversao_ipcc}</TableCell>
                  <TableCell className="text-right font-bold">
                    {Number(e.co2e_total).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {emissoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum registro.
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
