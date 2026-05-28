import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { VacariaEventoReprodutivo, VacariaAnimal } from './types'
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
import { Badge } from '@/components/ui/badge'

export default function VacariaReproducaoList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [empresaId, setEmpresaId] = useState('')
  const [eventos, setEventos] = useState<VacariaEventoReprodutivo[]>([])
  const [animais, setAnimais] = useState<VacariaAnimal[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    animal_id: '',
    tipo: 'inseminacao',
    data_evento: new Date().toISOString().split('T')[0],
    resultado_toque: 'prenhe',
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
    const [eRes, aRes] = await Promise.all([
      supabase
        .from('vacaria_eventos_reprodutivos')
        .select('*, animal:vacaria_animais(*)')
        .eq('empresa_id', empId)
        .order('data_evento', { ascending: false }),
      supabase.from('vacaria_animais').select('*').eq('empresa_id', empId).eq('status', 'ativo'),
    ])
    if (eRes.data) setEventos(eRes.data)
    if (aRes.data) setAnimais(aRes.data)
  }

  const handleSave = async () => {
    if (!form.animal_id) return toast({ title: 'Preencha o animal', variant: 'destructive' })
    const { error } = await supabase.from('vacaria_eventos_reprodutivos').insert({
      empresa_id: empresaId,
      animal_id: form.animal_id,
      tipo: form.tipo,
      data_evento: form.data_evento,
      resultado_toque: form.tipo === 'toque' ? form.resultado_toque : null,
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
        <h1 className="text-3xl font-bold">Controle Reprodutivo</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registro Reprodutivo</DialogTitle>
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
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cobricao">Cobrição</SelectItem>
                      <SelectItem value="inseminacao">Inseminação</SelectItem>
                      <SelectItem value="toque">Toque</SelectItem>
                      <SelectItem value="parto">Parto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={form.data_evento}
                    onChange={(e) => setForm({ ...form, data_evento: e.target.value })}
                  />
                </div>
                {form.tipo === 'toque' && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Resultado</label>
                    <Select
                      value={form.resultado_toque}
                      onValueChange={(v) => setForm({ ...form, resultado_toque: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prenhe">Prenhe</SelectItem>
                        <SelectItem value="vazia">Vazia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
              <TableHead>Tipo</TableHead>
              <TableHead>Resultado/Previsão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{format(new Date(e.data_evento), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="font-medium">
                  {e.animal?.brinco} - {e.animal?.nome}
                </TableCell>
                <TableCell className="capitalize">{e.tipo}</TableCell>
                <TableCell>
                  {e.tipo === 'toque' && (
                    <Badge variant={e.resultado_toque === 'prenhe' ? 'default' : 'secondary'}>
                      {e.resultado_toque}
                    </Badge>
                  )}
                  {(e.tipo === 'inseminacao' || e.tipo === 'cobricao') && e.previsao_parto && (
                    <span className="text-sm">
                      Parto prev: {format(new Date(e.previsao_parto), 'dd/MM/yy')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {eventos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
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
