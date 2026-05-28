import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMoedas, saveMoeda, deleteMoeda } from '@/services/moedas'

export default function MoedasList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [moedas, setMoedas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMoeda, setEditingMoeda] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    simbolo: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchMoedas = async () => {
    if (!empresa) return
    try {
      setLoading(true)
      const data = await getMoedas(empresa.id)
      setMoedas(data || [])
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Erro ao buscar moedas', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoedas()
  }, [empresa])

  const handleOpenDialog = (moeda: any = null) => {
    if (moeda) {
      setEditingMoeda(moeda)
      setFormData({
        nome: moeda.nome,
        codigo: moeda.codigo,
        simbolo: moeda.simbolo,
      })
    } else {
      setEditingMoeda(null)
      setFormData({
        nome: '',
        codigo: '',
        simbolo: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa) return
    if (!formData.nome || !formData.codigo || !formData.simbolo) {
      toast({
        title: 'Aviso',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)
      await saveMoeda(empresa.id, formData, editingMoeda?.id)
      toast({ title: 'Sucesso', description: 'Moeda salva com sucesso.' })
      setIsDialogOpen(false)
      fetchMoedas()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta moeda?')) return
    try {
      await deleteMoeda(id)
      toast({ title: 'Sucesso', description: 'Moeda excluída com sucesso.' })
      fetchMoedas()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app/configuracoes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Moedas</h1>
            <p className="text-muted-foreground">Gerencie as moedas disponíveis no sistema.</p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Moeda
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código (ISO)</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : moedas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhuma moeda encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                moedas.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.nome}</TableCell>
                    <TableCell>{m.codigo}</TableCell>
                    <TableCell>{m.simbolo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(m)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMoeda ? 'Editar Moeda' : 'Nova Moeda'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome (ex: Dólar Americano)</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Dólar Americano"
              />
            </div>
            <div className="space-y-2">
              <Label>Código (ex: USD)</Label>
              <Input
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="USD"
                maxLength={3}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label>Símbolo (ex: $)</Label>
              <Input
                value={formData.simbolo}
                onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
                placeholder="$"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
