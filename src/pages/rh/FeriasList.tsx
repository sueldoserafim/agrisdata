import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function FeriasList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [form, setForm] = useState({ funcId: '', tipo: 'ferias', ini: '', fim: '' })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!empresa?.id) return
    loadData()
  }, [empresa])

  const loadData = async () => {
    const { data: f } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('empresa_id', empresa!.id)
    if (f) setFuncionarios(f)
    const { data: p } = await supabase
      .from('rh_ferias_afastamentos')
      .select('*, func:funcionario_id(nome)')
      .eq('empresa_id', empresa!.id)
      .order('created_at', { ascending: false })
    if (p) setPedidos(p)
  }

  const handleSave = async () => {
    const { error } = await supabase.from('rh_ferias_afastamentos').insert({
      empresa_id: empresa!.id,
      funcionario_id: form.funcId,
      tipo: form.tipo,
      data_inicio: form.ini,
      data_fim: form.fim,
    })
    if (error) return toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    toast({ title: 'Solicitação salva!' })
    setOpen(false)
    loadData()
  }

  const handleApprove = async (id: string, status: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    await supabase
      .from('rh_ferias_afastamentos')
      .update({ status, aprovador_id: session?.user?.id })
      .eq('id', id)
    loadData()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Férias & Afastamentos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova Solicitação</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Afastamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={form.funcId} onValueChange={(v) => setForm({ ...form, funcId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="medico">Atestado Médico</SelectItem>
                  <SelectItem value="falta">Falta</SelectItem>
                  <SelectItem value="licenca">Licença</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={form.ini}
                  onChange={(e) => setForm({ ...form, ini: e.target.value })}
                />
                <Input
                  type="date"
                  value={form.fim}
                  onChange={(e) => setForm({ ...form, fim: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.func?.nome}</TableCell>
                  <TableCell className="capitalize">{p.tipo}</TableCell>
                  <TableCell>
                    {p.data_inicio} a {p.data_fim}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === 'aprovado'
                          ? 'default'
                          : p.status === 'rejeitado'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.status === 'solicitado' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(p.id, 'aprovado')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApprove(p.id, 'rejeitado')}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
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
