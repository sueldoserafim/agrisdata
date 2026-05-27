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
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

type Navio = {
  id: string
  empresa_id: string
  nome_navio: string
  bandeira: string | null
  imo_number: string | null
  armador: string | null
  ano_construcao: number | null
  capacidade_teus: number | null
  ativo: boolean
}

export default function NaviosList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [navios, setNavios] = useState<Navio[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome_navio: '',
    bandeira: '',
    imo_number: '',
    armador: '',
    ano_construcao: '',
    capacidade_teus: '',
    ativo: true,
  })

  const loadNavios = async () => {
    if (!empresa?.id) return
    setIsLoading(true)
    const { data, error } = await supabase
      .from('navios' as any)
      .select('*')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('nome_navio')

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setNavios(data as Navio[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadNavios()
  }, [empresa?.id])

  const handleOpenDialog = (navio?: Navio) => {
    if (navio) {
      setEditingId(navio.id)
      setFormData({
        nome_navio: navio.nome_navio,
        bandeira: navio.bandeira || '',
        imo_number: navio.imo_number || '',
        armador: navio.armador || '',
        ano_construcao: navio.ano_construcao ? String(navio.ano_construcao) : '',
        capacidade_teus: navio.capacidade_teus ? String(navio.capacidade_teus) : '',
        ativo: navio.ativo,
      })
    } else {
      setEditingId(null)
      setFormData({
        nome_navio: '',
        bandeira: '',
        imo_number: '',
        armador: '',
        ano_construcao: '',
        capacidade_teus: '',
        ativo: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!empresa?.id) return
    if (!formData.nome_navio.trim()) {
      return toast({
        title: 'Atenção',
        description: 'Nome do navio é obrigatório.',
        variant: 'destructive',
      })
    }
    const payload = {
      empresa_id: empresa.id,
      nome_navio: formData.nome_navio,
      bandeira: formData.bandeira || null,
      imo_number: formData.imo_number || null,
      armador: formData.armador || null,
      ano_construcao: formData.ano_construcao ? parseInt(formData.ano_construcao) : null,
      capacidade_teus: formData.capacidade_teus ? parseInt(formData.capacidade_teus) : null,
      ativo: formData.ativo,
    }

    const { error } = editingId
      ? await supabase
          .from('navios' as any)
          .update(payload)
          .eq('id', editingId)
      : await supabase.from('navios' as any).insert([payload])

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Navio salvo com sucesso.' })
      setIsDialogOpen(false)
      loadNavios()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este navio?')) return
    const { error } = await supabase
      .from('navios' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Navio excluído com sucesso.' })
      loadNavios()
    }
  }

  const filteredNavios = navios.filter((n) =>
    n.nome_navio.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navios</h1>
          <p className="text-muted-foreground">Gerencie a frota de navios para exportação.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Navio
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white dark:bg-zinc-950 p-2 rounded-md border">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          className="border-0 focus-visible:ring-0 shadow-none"
          placeholder="Buscar por nome do navio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Bandeira</TableHead>
              <TableHead>IMO</TableHead>
              <TableHead>Armador</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Capacidade (TEUs)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredNavios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum navio encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredNavios.map((navio) => (
                <TableRow key={navio.id}>
                  <TableCell className="font-medium">{navio.nome_navio}</TableCell>
                  <TableCell>{navio.bandeira || '-'}</TableCell>
                  <TableCell>{navio.imo_number || '-'}</TableCell>
                  <TableCell>{navio.armador || '-'}</TableCell>
                  <TableCell>{navio.ano_construcao || '-'}</TableCell>
                  <TableCell>{navio.capacidade_teus || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={navio.ativo ? 'default' : 'secondary'}>
                      {navio.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(navio)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(navio.id)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Navio' : 'Novo Navio'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Nome do Navio *</Label>
              <Input
                value={formData.nome_navio}
                onChange={(e) => setFormData({ ...formData, nome_navio: e.target.value })}
                placeholder="Ex: MSC Anna"
              />
            </div>
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Input
                value={formData.bandeira}
                onChange={(e) => setFormData({ ...formData, bandeira: e.target.value })}
                placeholder="Ex: Panamá"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Label>IMO Number</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número de Identificação Internacional do navio.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                value={formData.imo_number}
                onChange={(e) => setFormData({ ...formData, imo_number: e.target.value })}
                placeholder="Ex: 9777204"
              />
            </div>
            <div className="space-y-2">
              <Label>Armador</Label>
              <Input
                value={formData.armador}
                onChange={(e) => setFormData({ ...formData, armador: e.target.value })}
                placeholder="Ex: MSC"
              />
            </div>
            <div className="space-y-2">
              <Label>Ano Construção</Label>
              <Input
                type="number"
                value={formData.ano_construcao}
                onChange={(e) => setFormData({ ...formData, ano_construcao: e.target.value })}
                placeholder="Ex: 2016"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidade (TEUs)</Label>
              <Input
                type="number"
                value={formData.capacidade_teus}
                onChange={(e) => setFormData({ ...formData, capacidade_teus: e.target.value })}
                placeholder="Ex: 19200"
              />
            </div>
            <div className="col-span-2 flex items-center space-x-2 pt-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(c) => setFormData({ ...formData, ativo: c })}
              />
              <Label>Ativo</Label>
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
