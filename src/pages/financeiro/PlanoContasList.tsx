import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Folder, FileText, Plus, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

type PlanoConta = {
  id: string
  codigo: string
  descricao: string
  tipo: string
  natureza: string
  pai_id: string | null
  nivel: number
  ativo: boolean
}

export default function PlanoContasList() {
  const { empresa } = useEmpresa()
  const [contas, setContas] = useState<PlanoConta[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<PlanoConta>>({
    natureza: 'sintetica',
    tipo: 'despesa',
    nivel: 1,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (empresa) loadContas()
  }, [empresa])

  const loadContas = async () => {
    const { data, error } = await supabase
      .from('plano_contas' as any)
      .select('*')
      .eq('empresa_id', empresa?.id)
      .order('codigo', { ascending: true })
    if (data) setContas(data)
  }

  const handleSave = async () => {
    if (!formData.codigo || !formData.descricao || !formData.tipo || !formData.natureza) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    if (formData.pai_id) {
      const parent = contas.find((c) => c.id === formData.pai_id)
      if (parent?.natureza === 'analitica') {
        toast.error('Uma conta analítica não pode ter filhas.')
        return
      }
    }

    let error
    if (editingId) {
      const { error: updateError } = await supabase
        .from('plano_contas' as any)
        .update({
          codigo: formData.codigo,
          descricao: formData.descricao,
          tipo: formData.tipo,
          natureza: formData.natureza,
          pai_id: formData.pai_id,
          nivel: formData.nivel,
        })
        .eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('plano_contas' as any).insert({
        empresa_id: empresa?.id,
        ...formData,
      })
      error = insertError
    }

    if (error) {
      toast.error('Erro ao salvar conta')
    } else {
      toast.success('Conta salva com sucesso')
      setOpen(false)
      loadContas()
      setFormData({ natureza: 'sintetica', tipo: 'despesa', nivel: 1 })
      setEditingId(null)
    }
  }

  const handleEdit = (conta: PlanoConta) => {
    setFormData(conta)
    setEditingId(conta.id)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta conta?')) return
    const { error } = await supabase
      .from('plano_contas' as any)
      .delete()
      .eq('id', id)
    if (error) {
      toast.error('Erro ao excluir. Verifique dependências.')
    } else {
      toast.success('Conta excluída')
      loadContas()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de Contas</h1>
          <p className="text-muted-foreground">Gerencie as categorias contábeis e gerenciais.</p>
        </div>
        <Button
          onClick={() => {
            setFormData({ natureza: 'sintetica', tipo: 'despesa', nivel: 1 })
            setEditingId(null)
            setOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Conta
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">Código</th>
              <th className="p-3 font-medium">Descrição</th>
              <th className="p-3 font-medium">Tipo</th>
              <th className="p-3 font-medium">Natureza</th>
              <th className="p-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contas.map((conta) => (
              <tr key={conta.id} className="hover:bg-muted/50">
                <td className="p-3">
                  <div
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${(conta.nivel - 1) * 1.5}rem` }}
                  >
                    {conta.natureza === 'sintetica' ? (
                      <Folder className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={conta.natureza === 'sintetica' ? 'font-semibold' : ''}>
                      {conta.codigo}
                    </span>
                  </div>
                </td>
                <td className="p-3">{conta.descricao}</td>
                <td className="p-3 capitalize">{conta.tipo}</td>
                <td className="p-3 capitalize">{conta.natureza}</td>
                <td className="p-3 text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(conta)}>
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(conta.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {contas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  Nenhuma conta cadastrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input
                  value={formData.codigo || ''}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: 1.01.001"
                />
              </div>
              <div className="space-y-2">
                <Label>Nível</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.nivel || 1}
                  onChange={(e) => setFormData({ ...formData, nivel: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={formData.descricao || ''}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição da conta"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="custo">Custo</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="passivo">Passivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Natureza</Label>
                <Select
                  value={formData.natureza}
                  onValueChange={(val) => setFormData({ ...formData, natureza: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sintetica">Sintética (Grupo)</SelectItem>
                    <SelectItem value="analitica">Analítica (Lançamento)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conta Pai (Opcional)</Label>
              <Select
                value={formData.pai_id || 'none'}
                onValueChange={(val) =>
                  setFormData({ ...formData, pai_id: val === 'none' ? null : val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo pai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (Raiz)</SelectItem>
                  {contas
                    .filter((c) => c.natureza === 'sintetica')
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.codigo} - {c.descricao}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
