import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle2, DollarSign, Sprout, Target, RotateCcw } from 'lucide-react'

export default function TransplantioDetail() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const [transplantio, setTransplantio] = useState<any>(null)
  const [itens, setItens] = useState<any[]>([])
  const [replantios, setReplantios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa && id) loadData()
  }, [empresa, id])

  const loadData = async () => {
    setLoading(true)
    const { data: tData } = await supabase
      .from('transplantios')
      .select(
        `
        *,
        lotes_mudas (nome_lote, culturas(nome)),
        safras (nome_safra, codigo_safra),
        talhoes (nome)
      `,
      )
      .eq('id', id)
      .eq('empresa_id', empresa!.id)
      .single()

    if (tData) {
      setTransplantio(tData)
      const { data: iData } = await supabase
        .from('transplantio_itens')
        .select('*, produtos(nome)')
        .eq('transplantio_id', id)
      setItens(iData || [])

      const { data: rData } = await supabase
        .from('replantios')
        .select('*')
        .eq('transplantio_id', id)
        .is('deleted_at', null)
        .order('data_replantio', { ascending: false })
      setReplantios(rData || [])
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (!transplantio)
    return <div className="p-8 text-center text-red-500">Transplantio não encontrado</div>

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)

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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/transplantios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Detalhes do Transplantio
            {transplantio.confirmado && <CheckCircle2 className="h-6 w-6 text-green-500" />}
          </h1>
          <p className="text-muted-foreground mt-1">
            Realizado em {new Date(transplantio.data_transplantio).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sprout className="h-4 w-4" /> Origem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{transplantio.lotes_mudas?.nome_lote}</div>
            <p className="text-sm text-muted-foreground">
              {transplantio.lotes_mudas?.culturas?.nome}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" /> Destino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {transplantio.safras?.nome_safra || transplantio.safras?.codigo_safra}
            </div>
            <p className="text-sm text-muted-foreground">Talhão: {transplantio.talhoes?.nome}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Custo Base (Mudas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(transplantio.custo_transferido)}
            </div>
            <p className="text-sm text-muted-foreground">
              Mudas: {transplantio.quantidade_transplantada} | Replantio:{' '}
              {transplantio.quantidade_replantio}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custos Operacionais</CardTitle>
          <CardDescription>
            Insumos, Mão de Obra e outros custos específicos da operação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {itens.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum custo operacional registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição / Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Custo Unitário</TableHead>
                  <TableHead className="text-right">Custo Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {item.item_tipo.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.produtos?.nome || item.descricao}</TableCell>
                    <TableCell className="text-right">
                      {item.quantidade} {item.unidade}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.custo_unitario)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.custo_total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico de Replantios</CardTitle>
            <CardDescription>
              Mudas adicionadas após o transplantio inicial devido a perdas.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/app/replantios/novo?transplantio=${id}`}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Novo Replantio
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {replantios.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum replantio registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replantios.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.data_replantio).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{motivoLabel(r.motivo)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={r.observacoes}>
                      {r.observacoes || '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-amber-600">
                      +{r.quantidade_replantada}
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
