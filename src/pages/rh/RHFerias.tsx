import { useEffect, useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { ModuleHelp } from '@/components/ModuleHelp'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export default function RHFerias() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: af, error } = await supabase
      .from('rh_ferias_afastamentos')
      .select('*, funcionario:funcionarios(nome)')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (!error && af) setData(af)

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
      const { error } = await supabase.from('rh_ferias_afastamentos').insert({
        empresa_id: empresa.id,
        funcionario_id: fd.get('funcionario_id'),
        tipo: fd.get('tipo'),
        data_inicio: fd.get('data_inicio'),
        data_fim: fd.get('data_fim'),
      })
      if (error) throw error
      toast.success('Solicitação criada com sucesso!')
      setOpen(false)
      fetchDados()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAprovar = async (id: string, status: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('rh_ferias_afastamentos')
        .update({ status, aprovador_id: user?.id })
        .eq('id', id)
      if (error) throw error
      toast.success('Status atualizado!')
      fetchDados()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Férias & Afastamentos</h1>
          <p className="text-muted-foreground">Gerencie as solicitações de ausência.</p>
        </div>
        <div className="flex items-center gap-4">
          <ModuleHelp
            title="Férias & Afastamentos"
            description="Regras de negócio do módulo."
            rules={[
              "Solicitações ficam no status 'solicitado' até a aprovação de um gerente.",
              'Afastamentos médicos requerem atestado.',
              'O período deve ter data de início e fim válidas.',
            ]}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Nova Solicitação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Solicitação</DialogTitle>
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
                  <div className="flex items-center gap-2">
                    <Label>Tipo</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>O tipo influencia no cálculo da folha de pagamento.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select name="tipo" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="medico">Atestado Médico</SelectItem>
                      <SelectItem value="falta">Falta Injustificada</SelectItem>
                      <SelectItem value="licenca">Licença</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Input type="date" name="data_inicio" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Fim</Label>
                    <Input type="date" name="data_fim" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Salvar Solicitação
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
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.funcionario?.nome}</TableCell>
                  <TableCell className="capitalize">{item.tipo}</TableCell>
                  <TableCell>
                    {new Date(item.data_inicio).toLocaleDateString()} a{' '}
                    {new Date(item.data_fim).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'aprovado'
                          ? 'default'
                          : item.status === 'rejeitado'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === 'solicitado' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAprovar(item.id, 'aprovado')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAprovar(item.id, 'rejeitado')}
                          className="text-red-500"
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma solicitação encontrada.
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
