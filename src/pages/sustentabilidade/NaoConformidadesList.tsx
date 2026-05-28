import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { sustentabilidadeService } from '@/services/sustentabilidade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

export default function NaoConformidadesList() {
  const { empresa } = useEmpresa()
  const [ncs, setNcs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    gravidade: 'menor',
    prazo_correcao: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (empresa?.id) load()
  }, [empresa?.id])

  const load = async () => {
    const { data } = await sustentabilidadeService.getNaoConformidades(empresa!.id)
    if (data) setNcs(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await sustentabilidadeService.createNaoConformidade({
      empresa_id: empresa!.id,
      ...formData,
      bloqueia_certificado: formData.gravidade === 'critica',
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'NC registrada.' })
      setOpen(false)
      load()
    }
  }

  const closeNC = async (id: string) => {
    await sustentabilidadeService.updateNaoConformidade(id, {
      status: 'fechada',
      data_fechamento: new Date().toISOString().split('T')[0],
    })
    load()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Não Conformidades</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Registrar NC
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Não Conformidade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gravidade</Label>
                <Select
                  value={formData.gravidade}
                  onValueChange={(v) => setFormData({ ...formData, gravidade: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menor">Menor</SelectItem>
                    <SelectItem value="maior">Maior</SelectItem>
                    <SelectItem value="critica">Crítica (Bloqueante)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prazo de Correção</Label>
                <Input
                  type="date"
                  required
                  value={formData.prazo_correcao}
                  onChange={(e) => setFormData({ ...formData, prazo_correcao: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Gravidade</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ncs.map((nc) => (
                <TableRow key={nc.id}>
                  <TableCell className="font-medium">{nc.descricao}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        nc.gravidade === 'critica'
                          ? 'destructive'
                          : nc.gravidade === 'maior'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {nc.gravidade}
                    </Badge>
                  </TableCell>
                  <TableCell>{nc.prazo_correcao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{nc.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {nc.status !== 'fechada' && (
                      <Button size="sm" variant="outline" onClick={() => closeNC(nc.id)}>
                        Fechar NC
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {ncs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma NC registrada.
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
