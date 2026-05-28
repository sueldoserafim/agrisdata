import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { VacariaSaudeAnimal, VacariaAnimal } from './types'
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

export default function VacariaSaudeList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [empresaId, setEmpresaId] = useState('')
  const [registros, setRegistros] = useState<VacariaSaudeAnimal[]>([])
  const [animais, setAnimais] = useState<VacariaAnimal[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    animal_id: '',
    tipo: 'vacina',
    data_registro: new Date().toISOString().split('T')[0],
    descricao: '',
    peso_kg: '',
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
    const [rRes, aRes] = await Promise.all([
      supabase
        .from('vacaria_saude_animal')
        .select('*, animal:vacaria_animais(*)')
        .eq('empresa_id', empId)
        .order('data_registro', { ascending: false }),
      supabase.from('vacaria_animais').select('*').eq('empresa_id', empId).eq('status', 'ativo'),
    ])
    if (rRes.data) setRegistros(rRes.data)
    if (aRes.data) setAnimais(aRes.data)
  }

  const handleSave = async () => {
    if (!form.animal_id) return toast({ title: 'Preencha o animal', variant: 'destructive' })
    const { error } = await supabase.from('vacaria_saude_animal').insert({
      empresa_id: empresaId,
      animal_id: form.animal_id,
      tipo: form.tipo,
      data_registro: form.data_registro,
      descricao: form.descricao,
      peso_kg: form.tipo === 'pesagem' ? Number(form.peso_kg) : null,
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
        <h1 className="text-3xl font-bold">Saúde e Manejo</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lançamento de Saúde</DialogTitle>
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
                      <SelectItem value="vacina">Vacina</SelectItem>
                      <SelectItem value="tratamento">Tratamento</SelectItem>
                      <SelectItem value="exame">Exame</SelectItem>
                      <SelectItem value="pesagem">Pesagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={form.data_registro}
                    onChange={(e) => setForm({ ...form, data_registro: e.target.value })}
                  />
                </div>
                {form.tipo === 'pesagem' ? (
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Peso (kg)</label>
                    <Input
                      type="number"
                      value={form.peso_kg}
                      onChange={(e) => setForm({ ...form, peso_kg: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Descrição/Medicamento</label>
                    <Input
                      value={form.descricao}
                      onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    />
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
              <TableHead>Descrição/Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{format(new Date(r.data_registro), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="font-medium">
                  {r.animal?.brinco} - {r.animal?.nome}
                </TableCell>
                <TableCell className="capitalize">{r.tipo}</TableCell>
                <TableCell>{r.tipo === 'pesagem' ? `${r.peso_kg} kg` : r.descricao}</TableCell>
              </TableRow>
            ))}
            {registros.length === 0 && (
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
