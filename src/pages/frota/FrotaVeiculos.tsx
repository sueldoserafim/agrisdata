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
import { toast } from 'sonner'

export default function FrotaVeiculos() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: veiculos } = await supabase
      .from('frota_veiculos')
      .select('*')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (veiculos) setData(veiculos)
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
      const { error } = await supabase.from('frota_veiculos').insert({
        empresa_id: empresa.id,
        modelo: fd.get('modelo'),
        placa: fd.get('placa'),
        km_atual: fd.get('km_atual'),
        vencimento_seguro: fd.get('vencimento_seguro') || null,
        vencimento_documento: fd.get('vencimento_documento') || null,
      })
      if (error) throw error
      toast.success('Veículo salvo com sucesso!')
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
          <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Veículo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Veículo</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input name="modelo" required placeholder="Ex: Hilux 4x4 Diesel" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Placa</Label>
                  <Input name="placa" required placeholder="ABC-1234" className="uppercase" />
                </div>
                <div className="space-y-2">
                  <Label>KM Atual</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    name="km_atual"
                    defaultValue={0}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vencimento Seguro</Label>
                  <Input type="date" name="vencimento_seguro" />
                </div>
                <div className="space-y-2">
                  <Label>Vencimento Doc.</Label>
                  <Input type="date" name="vencimento_documento" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Salvar Veículo
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
                <TableHead>Modelo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>KM Atual</TableHead>
                <TableHead>Venc. Seguro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.modelo}</TableCell>
                  <TableCell className="uppercase">{item.placa}</TableCell>
                  <TableCell>{Number(item.km_atual).toLocaleString('pt-BR')} km</TableCell>
                  <TableCell>
                    {item.vencimento_seguro
                      ? new Date(item.vencimento_seguro).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum veículo cadastrado.
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
