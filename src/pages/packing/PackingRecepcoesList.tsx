import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Printer, ArrowRightCircle } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function PackingRecepcoesList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('packing_recepcoes')
      .select(`
        id, data_recepcao, peso_liquido_kg, quantidade_caixas, status, conformidade_visual,
        colheita:colheita_registros!lote_producao_id(id, lote_producao),
        safra:safras(nome_safra)
      `)
      .eq('empresa_id', empresa.id)
      .order('data_recepcao', { ascending: false })

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

  const changeStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('packing_recepcoes')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Status atualizado.' })
      loadData()
    }
  }

  const printLabel = (lote: string) => {
    toast({ title: 'Etiqueta ZPL Gerada', description: `Enviando para impressora - Lote: ${lote}` })
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      em_recebimento: { label: 'Em Recepção', className: 'bg-zinc-100 text-zinc-800' },
      recebido: { label: 'Recebido', className: 'bg-amber-100 text-amber-800' },
      em_packing: { label: 'Em Packing', className: 'bg-blue-100 text-blue-800' },
      concluido: { label: 'Concluído', className: 'bg-emerald-100 text-emerald-800' },
      expedido: { label: 'Expedido', className: 'bg-purple-100 text-purple-800' },
    }
    const info = map[status] || { label: status, className: '' }
    return (
      <Badge variant="secondary" className={info.className}>
        {info.label}
      </Badge>
    )
  }

  const getConformidadeBadge = (val: string) => {
    if (val === 'aprovado')
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          Aprovado
        </Badge>
      )
    if (val === 'parcial')
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          Parcial
        </Badge>
      )
    if (val === 'reprovado')
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Reprovado
        </Badge>
      )
    return <Badge variant="outline">-</Badge>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recepção de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie os lotes colhidos que chegam no Packing House
          </p>
        </div>
        <Button asChild>
          <Link to="/app/packing/recepcao/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Recepção
          </Link>
        </Button>
      </div>

      <Card className="shadow-subtle border-none">
        <CardHeader>
          <CardTitle>Lotes Recebidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Lote (Campo)</TableHead>
                <TableHead>Safra</TableHead>
                <TableHead>Peso Líquido</TableHead>
                <TableHead>Caixas</TableHead>
                <TableHead>Conformidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma recepção registrada.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.data_recepcao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="font-mono font-medium">
                    {item.colheita?.lote_producao || 'N/A'}
                  </TableCell>
                  <TableCell>{item.safra?.nome_safra}</TableCell>
                  <TableCell>{item.peso_liquido_kg ? `${item.peso_liquido_kg} kg` : '-'}</TableCell>
                  <TableCell>{item.quantidade_caixas || '-'}</TableCell>
                  <TableCell>{getConformidadeBadge(item.conformidade_visual)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ArrowRightCircle className="w-4 h-4 mr-2" /> Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeStatus(item.id, 'em_recebimento')}>
                          Em Recepção
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeStatus(item.id, 'recebido')}>
                          Recebido
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeStatus(item.id, 'em_packing')}>
                          Em Packing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeStatus(item.id, 'concluido')}>
                          Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeStatus(item.id, 'expedido')}>
                          Expedido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Gerar Etiqueta ZPL"
                      onClick={() => printLabel(item.colheita?.lote_producao || item.id)}
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
