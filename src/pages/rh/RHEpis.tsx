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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ModuleHelp } from '@/components/ModuleHelp'

export default function RHEpis() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [epis, setEpis] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: ent } = await supabase
      .from('rh_epi_entregas')
      .select('*, funcionario:funcionarios(nome), epi:rh_epis(nome, validade_dias)')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (ent) setData(ent)

    const { data: e } = await supabase.from('rh_epis').select('*').eq('empresa_id', empresa.id)
    if (e) setEpis(e)

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

    const epiId = fd.get('epi_id') as string
    const dataE = fd.get('data_entrega') as string
    const epiObj = epis.find((x) => x.id === epiId)

    if (!epiObj) return
    const dataVenc = new Date(dataE)
    dataVenc.setDate(dataVenc.getDate() + epiObj.validade_dias)

    try {
      const { error } = await supabase.from('rh_epi_entregas').insert({
        empresa_id: empresa.id,
        funcionario_id: fd.get('funcionario_id'),
        epi_id: epiId,
        data_entrega: dataE,
        data_vencimento: dataVenc.toISOString().split('T')[0],
      })
      if (error) throw error
      toast.success('Entrega de EPI registrada!')
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
          <h1 className="text-3xl font-bold tracking-tight">Controle de EPIs</h1>
          <p className="text-muted-foreground">
            Registre a entrega de equipamentos de proteção individual.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ModuleHelp
            title="Controle de EPIs"
            description="Garantia de segurança ocupacional."
            rules={[
              'A data de vencimento é calculada automaticamente baseada na validade (em dias) do EPI.',
              'Um alerta será gerado 10 dias antes do vencimento do EPI entregue.',
            ]}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Registrar Entrega</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Entrega de EPI</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Funcionário</Label>
                  <Select name="funcionario_id" required>
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
                <div className="space-y-2">
                  <Label>EPI</Label>
                  <Select name="epi_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {epis.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.nome} ({e.validade_dias} dias)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Entrega</Label>
                  <Input
                    type="date"
                    name="data_entrega"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Salvar
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
                <TableHead>Data Entrega</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Equipamento (EPI)</TableHead>
                <TableHead>Vencimento Previsto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.data_entrega).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.funcionario?.nome}</TableCell>
                  <TableCell>{item.epi?.nome}</TableCell>
                  <TableCell
                    className={
                      new Date(item.data_vencimento) < new Date() ? 'text-red-500 font-bold' : ''
                    }
                  >
                    {new Date(item.data_vencimento).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhuma entrega registrada.
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
