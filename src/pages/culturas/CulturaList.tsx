import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { getCulturas, deleteCultura } from '@/services/culturas'
import { Skeleton } from '@/components/ui/skeleton'

export default function CulturaList() {
  const [culturas, setCulturas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const loadCulturas = async () => {
    if (!empresa?.id) return
    try {
      const data = await getCulturas(empresa.id)
      setCulturas(data)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCulturas()
  }, [empresa?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta cultura?') || !empresa?.id) return
    try {
      await deleteCultura(id, empresa.id)
      toast({ title: 'Sucesso', description: 'Cultura excluída com sucesso' })
      loadCulturas()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Sprout className="size-8 text-primary" />
            Culturas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie o catálogo de culturas e parâmetros agronômicos.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/culturas/new">
            <Plus className="size-4 mr-2" />
            Nova Cultura
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Culturas</CardTitle>
          <CardDescription>Culturas cadastradas para a sua empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ciclo (dias)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {culturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhuma cultura cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    culturas.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.nome}</TableCell>
                        <TableCell className="capitalize">{c.tipo}</TableCell>
                        <TableCell>{c.ciclo_dias}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/app/culturas/${c.id}`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
