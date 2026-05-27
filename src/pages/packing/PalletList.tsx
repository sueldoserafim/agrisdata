import { useEffect, useState } from 'react'
import { Plus, Printer } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function PalletList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('pallets')
      .select(`
        id, codigo, peso_kg, status, conformidade_percentual, destino, created_at,
        safra:safras(nome_safra)
      `)
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const printLabel = (codigo: string) => {
    toast({
      title: 'Etiqueta ZPL Gerada',
      description: `Enviando para impressora - Pallet: ${codigo}`,
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Pallets</h1>
          <p className="text-muted-foreground">
            Controle de pallets formados no packing house e seus destinos logísticos
          </p>
        </div>
        <Button
          onClick={() =>
            toast({
              title: 'Em breve',
              description: 'A criação manual de pallets estará disponível em breve.',
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pallet
        </Button>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Pallets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Safra</TableHead>
                <TableHead>Data Formação</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Conformidade</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum pallet registrado.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-semibold">{item.codigo}</TableCell>
                  <TableCell>{item.safra?.nome_safra}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{item.peso_kg}</TableCell>
                  <TableCell>{item.conformidade_percentual}%</TableCell>
                  <TableCell className="capitalize">{item.destino?.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 'embarcado' ? 'default' : 'secondary'}
                      className={
                        item.status === 'embarcado' ? 'bg-emerald-100 text-emerald-800' : ''
                      }
                    >
                      {item.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Gerar Etiqueta ZPL"
                      onClick={() => printLabel(item.codigo)}
                    >
                      <Printer className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
