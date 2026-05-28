import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { VacariaProducaoLeite, VacariaAnimal } from './types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function VacariaProducaoList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [empresaId, setEmpresaId] = useState('')
  const [producao, setProducao] = useState<VacariaProducaoLeite[]>([])
  const [animais, setAnimais] = useState<VacariaAnimal[]>([])
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    animal_id: '',
    data_ordenha: new Date().toISOString().split('T')[0],
    volume_litros: '',
    ccs: '',
    cbt: '',
    periodo: 'manha',
  })

  useEffect(() => {
    if (user) {
      supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setEmpresaId(data.empresa_id)
            loadData(data.empresa_id)
          }
        })
    }
  }, [user])

  const loadData = async (empId: string) => {
    const [pRes, aRes] = await Promise.all([
      supabase
        .from('vacaria_producao_leite')
        .select('*, animal:vacaria_animais(*)')
        .eq('empresa_id', empId)
        .order('data_ordenha', { ascending: false }),
      supabase.from('vacaria_animais').select('*').eq('empresa_id', empId).eq('status', 'ativo'),
    ])
    if (pRes.data) setProducao(pRes.data)
    if (aRes.data) setAnimais(aRes.data)
  }

  const handleSave = async () => {
    if (!form.animal_id || !form.volume_litros)
      return toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' })
    const { error } = await supabase.from('vacaria_producao_leite').insert({
      empresa_id: empresaId,
      animal_id: form.animal_id,
      data_ordenha: form.data_ordenha,
      volume_litros: Number(form.volume_litros),
      ccs: form.ccs ? Number(form.ccs) : null,
      cbt: form.cbt ? Number(form.cbt) : null,
      periodo: form.periodo,
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Salvo com sucesso' })
      setOpen(false)
      loadData(empresaId)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produção de Leite</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Lançar Produção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Ordenha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Animal</label>
                <Select
                  value={form.animal_id}
                  onValueChange={(v) => setForm({ ...form, animal_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {animais.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.brinco} - {a.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={form.data_ordenha}
                    onChange={(e) => setForm({ ...form, data_ordenha: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Volume (L)</label>
                  <Input
                    type="number"
                    value={form.volume_litros}
                    onChange={(e) => setForm({ ...form, volume_litros: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    CCS{' '}
                    <Tooltip>
                      <TooltipTrigger className="text-muted-foreground">(?)</TooltipTrigger>
                      <TooltipContent>Contagem de Células Somáticas</TooltipContent>
                    </Tooltip>
                  </label>
                  <Input
                    type="number"
                    value={form.ccs}
                    onChange={(e) => setForm({ ...form, ccs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1">
                    CBT{' '}
                    <Tooltip>
                      <TooltipTrigger className="text-muted-foreground">(?)</TooltipTrigger>
                      <TooltipContent>Contagem Bacteriana Total</TooltipContent>
                    </Tooltip>
                  </label>
                  <Input
                    type="number"
                    value={form.cbt}
                    onChange={(e) => setForm({ ...form, cbt: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select
                    value={form.periodo}
                    onValueChange={(v) => setForm({ ...form, periodo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Volume (L)</TableHead>
              <TableHead>CCS</TableHead>
              <TableHead>CBT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {producao.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{format(new Date(p.data_ordenha), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="font-medium">
                  {p.animal?.brinco} - {p.animal?.nome}
                </TableCell>
                <TableCell className="capitalize">{p.periodo}</TableCell>
                <TableCell>{p.volume_litros}</TableCell>
                <TableCell>{p.ccs || '-'}</TableCell>
                <TableCell>{p.cbt || '-'}</TableCell>
              </TableRow>
            ))}
            {producao.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhum registro
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
