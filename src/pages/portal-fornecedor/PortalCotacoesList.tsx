import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
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
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function PortalCotacoesList() {
  const { session } = useAuth()
  const [cotacoes, setCotacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      loadCotacoes()
    }
  }, [session])

  async function loadCotacoes() {
    setLoading(true)
    try {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('fornecedor_id')
        .eq('id', session!.user.id)
        .single()

      if (!userData?.fornecedor_id) return

      const { data, error } = await supabase
        .from('compras_cotacao_fornecedores' as any)
        .select(`
          id,
          preco_unitario,
          prazo_entrega_dias,
          vencedor,
          cotacao:compras_cotacoes (
            id,
            status,
            prazo_respostas,
            created_at,
            requisicao:compras_requisicao (numero_requisicao)
          )
        `)
        .eq('fornecedor_id', userData.fornecedor_id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCotacoes(data || [])
    } catch (error) {
      console.error('Error loading cotacoes', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Minhas Cotações</h2>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Requisição</TableHead>
                  <TableHead>Prazo Final</TableHead>
                  <TableHead>Status Cotação</TableHead>
                  <TableHead>Seu Preço</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : cotacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma cotação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  cotacoes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(new Date(item.cotacao.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{item.cotacao.requisicao?.numero_requisicao || '-'}</TableCell>
                      <TableCell>
                        {format(new Date(item.cotacao.prazo_respostas), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.cotacao.status === 'aberta' ? 'default' : 'secondary'}>
                          {item.cotacao.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.preco_unitario ? (
                          `R$ ${item.preco_unitario}`
                        ) : (
                          <span className="text-muted-foreground">Não respondido</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.vencedor ? (
                          <Badge variant="default" className="bg-green-600">
                            Ganha
                          </Badge>
                        ) : item.cotacao.status === 'finalizada' ? (
                          <Badge variant="destructive">Perdida</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/portal-fornecedor/cotacoes/${item.id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Responder / Ver
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
