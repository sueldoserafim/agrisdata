import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function Vendedores() {
  const [vendedores, setVendedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  useEffect(() => {
    if (empresa) {
      fetchVendedores()
    }
  }, [empresa])

  const fetchVendedores = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .eq('empresa_id', empresa?.id)
        .order('nome')

      if (error) throw error
      setVendedores(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao buscar vendedores',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este vendedor?')) return

    try {
      const { error } = await supabase.from('vendedores').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Vendedor excluído com sucesso' })
      fetchVendedores()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir vendedor',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
        <Button asChild>
          <Link to="/app/vendedores/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Vendedor
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de Vendedores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : vendedores.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum vendedor cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.map((vendedor) => (
                  <TableRow key={vendedor.id}>
                    <TableCell className="font-medium">{vendedor.nome}</TableCell>
                    <TableCell>{vendedor.email || '-'}</TableCell>
                    <TableCell>{vendedor.telefone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/app/vendedores/${vendedor.id}`}>
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(vendedor.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
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
