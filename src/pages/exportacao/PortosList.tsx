import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, HelpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

type Porto = {
  id: string
  empresa_id: string
  nome_porto: string
  pais: string | null
  cidade: string | null
  tipo: 'embarque' | 'desembarque' | 'ambos'
  codigo_un_locode: string | null
}

export default function PortosList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [portos, setPortos] = useState<Porto[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome_porto: '',
    pais: '',
    cidade: '',
    tipo: 'ambos' as 'embarque' | 'desembarque' | 'ambos',
    codigo_un_locode: '',
  })

  const loadPortos = async () => {
    if (!empresa?.id) return
    setIsLoading(true)
    const { data, error } = await supabase
      .from('portos' as any)
      .select('*')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('nome_porto')

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setPortos(data as Porto[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadPortos()
  }, [empresa?.id])

  const handleOpenDialog = (porto?: Porto) => {
    if (porto) {
      setEditingId(porto.id)
      setFormData({
        nome_porto: porto.nome_porto,
        pais: porto.pais || '',
        cidade: porto.cidade || '',
        tipo: porto.tipo || 'ambos',
        codigo_un_locode: porto.codigo_un_locode || '',
      })
    } else {
      setEditingId(null)
      setFormData({ nome_porto: '', pais: '', cidade: '', tipo: 'ambos', codigo_un_locode: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!empresa?.id) return
    if (!formData.nome_porto.trim()) {
      return toast({
        title: 'Atenção',
        description: 'Nome do porto é obrigatório.',
        variant: 'destructive',
      })
    }

    const payload = {
      empresa_id: empresa.id,
      nome_porto: formData.nome_porto,
      pais: formData.pais || null,
      cidade: formData.cidade || null,
      tipo: formData.tipo,
      codigo_un_locode: formData.codigo_un_locode || null,
    }

    const { error } = editingId
      ? await supabase
          .from('portos' as any)
          .update(payload)
          .eq('id', editingId)
      : await supabase.from('portos' as any).insert([payload])

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Porto salvo com sucesso.' })
      setIsDialogOpen(false)
      loadPortos()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este porto?')) return
    const { error } = await supabase
      .from('portos' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Porto excluído com sucesso.' })
      loadPortos()
    }
  }

  const filteredPortos = portos.filter(
    (p) =>
      p.nome_porto.toLowerCase().includes(search.toLowerCase()) ||
      (p.pais || '').toLowerCase().includes(search.toLowerCase()),
  )

  const tipoLabel = { embarque: 'Embarque', desembarque: 'Desembarque', ambos: 'Ambos' }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portos</h1>
          <p className="text-muted-foreground">Gerencie os portos de embarque e desembarque.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Porto
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white dark:bg-zinc-950 p-2 rounded-md border">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          className="border-0 focus-visible:ring-0 shadow-none"
          placeholder="Buscar por nome ou país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Porto</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>UN/LOCODE</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredPortos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum porto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPortos.map((porto) => (
                <TableRow key={porto.id}>
                  <TableCell className="font-medium">{porto.nome_porto}</TableCell>
                  <TableCell>{porto.pais || '-'}</TableCell>
                  <TableCell>{porto.cidade || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tipoLabel[porto.tipo] || porto.tipo}</Badge>
                  </TableCell>
                  <TableCell>{porto.codigo_un_locode || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(porto)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(porto.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Porto' : 'Novo Porto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Porto *</Label>
              <Input
                value={formData.nome_porto}
                onChange={(e) => setFormData({ ...formData, nome_porto: e.target.value })}
                placeholder="Ex: Porto de Santos"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>País</Label>
                <Input
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  placeholder="Ex: Brasil"
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="Ex: Santos"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Operação</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v: any) => setFormData({ ...formData, tipo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="embarque">Embarque</SelectItem>
                  <SelectItem value="desembarque">Desembarque</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Label>UN/LOCODE</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Código das Nações Unidas para Portos. Ex: BRSZZ</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                value={formData.codigo_un_locode}
                onChange={(e) => setFormData({ ...formData, codigo_un_locode: e.target.value })}
                placeholder="Ex: BRSZZ"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
