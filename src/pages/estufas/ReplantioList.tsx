import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'

export default function ReplantioList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [replantios, setReplantios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa) loadReplantios()
  }, [empresa])

  const loadReplantios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('replantios')
      .select(`
        *,
        talhoes (nome),
        transplantios (
          data_transplantio,
          lotes_mudas (nome_lote)
        )
      `)
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('data_replantio', { ascending: false })

    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setReplantios(data || [])
    }
    setLoading(false)
  }

  const motivoLabel = (motivo: string) => {
    const map: any = {
      falha_germinacao: 'Falha na Germinação',
      pragas: 'Pragas',
      doencas: 'Doenças',
      clima: 'Clima',
      outro: 'Outro',
    }
    return map[motivo] || motivo
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Replantios</h1>
          <p className="text-muted-foreground mt-1">
            Histórico de replantios e perdas pós-transplantio
          </p>
        </div>
        <Button onClick={() => navigate('/app/replantios/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Replantio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Replantios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Carregando...</div>
          ) : replantios.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum replantio registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Talhão</TableHead>
                  <TableHead>Transplantio Origem</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replantios.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.data_replantio).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{r.talhoes?.nome}</TableCell>
                    <TableCell>
                      <div className="text-sm">Lote: {r.transplantios?.lotes_mudas?.nome_lote}</div>
                      <div className="text-xs text-muted-foreground">
                        Data:{' '}
                        {new Date(r.transplantios?.data_transplantio).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-amber-600">
                      +{r.quantidade_replantada}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{motivoLabel(r.motivo)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/app/replantios/${r.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
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
