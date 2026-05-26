import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash, Warehouse, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EstufasList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [estufas, setEstufas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (empresa) loadEstufas()
  }, [empresa])

  const loadEstufas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('estufas')
      .select('*, fazendas(nome)')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('nome')

    if (error) {
      toast({
        title: 'Erro ao carregar estufas',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setEstufas(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta estufa?')) return

    const { error } = await supabase
      .from('estufas')
      .update({ deleted_at: new Date().toISOString(), ativo: false })
      .eq('id', id)

    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Estufa excluída com sucesso' })
      loadEstufas()
    }
  }

  const filtered = estufas.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.tipo?.toLowerCase().includes(search.toLowerCase()),
  )

  const getTypeLabel = (tipo: string) => {
    const tipos: any = {
      viveiro: 'Viveiro',
      propagador: 'Propagador',
      ambiente_controlado: 'Ambiente Controlado',
      sombrite: 'Sombrite',
    }
    return tipos[tipo] || tipo
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estufas & Viveiros</h1>
          <p className="text-muted-foreground mt-1">Gerencie os ambientes de produção de mudas</p>
        </div>
        <Button onClick={() => navigate('/app/estufas/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Estufa
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Estufas Cadastradas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estufa..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhuma estufa encontrada.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Fazenda</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área (m²)</TableHead>
                  <TableHead>Capacidade Lotes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((estufa) => (
                  <TableRow key={estufa.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        {estufa.nome}
                      </div>
                    </TableCell>
                    <TableCell>{estufa.fazendas?.nome || '-'}</TableCell>
                    <TableCell>{getTypeLabel(estufa.tipo)}</TableCell>
                    <TableCell>{estufa.area_m2}</TableCell>
                    <TableCell>{estufa.capacidade_lotes}</TableCell>
                    <TableCell>
                      {estufa.ativo ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/app/estufas/${estufa.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(estufa.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
