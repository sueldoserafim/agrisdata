import React, { useEffect, useState, useMemo } from 'react'
import { Package, AlertTriangle, Clock, DollarSign, ChevronDown, ChevronRight } from 'lucide-react'
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
import { estoqueService, ProdutoComLotes } from '@/services/estoque'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export default function AlmoxarifadoDashboard() {
  const { user } = useAuth()
  const [produtos, setProdutos] = useState<ProdutoComLotes[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()
        if (profile && mounted) {
          const data = await estoqueService.getProdutosComLotes(profile.empresa_id)
          setProdutos(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const metrics = useMemo(() => {
    let totalItens = 0
    let estoqueCritico = 0
    let itensVencendo = 0
    let valorTotal = 0

    const today = new Date()
    const in30Days = new Date()
    in30Days.setDate(today.getDate() + 30)

    produtos.forEach((p) => {
      const lotes = p.lotes_estoque || []
      const totalQtd = lotes.reduce((sum, l) => sum + (l.quantidade || 0), 0)

      if (totalQtd > 0) totalItens++
      if (totalQtd > 0 && totalQtd <= (p.estoque_minimo || 0)) estoqueCritico++

      valorTotal += totalQtd * (p.preco_unitario || 0)

      const hasVencendo = lotes.some((l) => {
        if (!l.data_validade || (l.quantidade || 0) <= 0) return false
        const validade = new Date(l.data_validade)
        return validade >= today && validade <= in30Days
      })
      if (hasVencendo) itensVencendo++
    })

    return { totalItens, estoqueCritico, itensVencendo, valorTotal }
  }, [produtos])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) return <div className="p-8">Carregando dashboard...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Almoxarifado</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalItens}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.estoqueCritico}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Vencendo (30 dias)</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{metrics.itensVencendo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                metrics.valorTotal,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventário Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => {
                const totalQtd = (p.lotes_estoque || []).reduce(
                  (acc, l) => acc + (l.quantidade || 0),
                  0,
                )
                const isCritico = totalQtd > 0 && totalQtd <= (p.estoque_minimo || 0)
                const status = totalQtd === 0 ? 'Sem Estoque' : isCritico ? 'Crítico' : 'Normal'
                const isExpanded = expanded[p.id]

                return (
                  <React.Fragment key={p.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(p.id)}
                    >
                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell>
                        {totalQtd} {p.unidade_medida}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'Normal'
                              ? 'default'
                              : status === 'Crítico'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-4 border-b">
                            <h4 className="text-sm font-semibold mb-2">Lotes em Estoque</h4>
                            {p.lotes_estoque && p.lotes_estoque.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Lote</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Validade</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {p.lotes_estoque.map((lote) => (
                                    <TableRow key={lote.id}>
                                      <TableCell>{lote.numero_lote || 'N/A'}</TableCell>
                                      <TableCell>{lote.quantidade}</TableCell>
                                      <TableCell>
                                        {lote.data_validade
                                          ? new Date(lote.data_validade).toLocaleDateString('pt-BR')
                                          : 'N/A'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nenhum lote com saldo positivo.
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
