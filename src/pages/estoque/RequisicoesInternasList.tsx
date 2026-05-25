import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Check, X } from 'lucide-react'
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
import { reqInternasService, RequisicaoInterna } from '@/services/requisicoes-internas'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function RequisicoesInternasList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [requisicoes, setRequisicoes] = useState<RequisicaoInterna[]>([])
  const [loading, setLoading] = useState(true)
  const [isManager, setIsManager] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id, perfil')
          .eq('id', user.id)
          .single()
        if (profile && mounted) {
          setIsManager(['admin', 'admin_saas', 'gerente'].includes(profile.perfil || ''))
          const data = await reqInternasService.getAll(profile.empresa_id)
          setRequisicoes(data)
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

  const handleAprovar = async (id: string) => {
    try {
      if (!user) return
      await reqInternasService.updateStatus(id, 'aprovado', user.id)
      toast({ title: 'Sucesso', description: 'Requisição aprovada com sucesso.' })
      setRequisicoes((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'aprovado' } : r)))
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao aprovar.',
      })
    }
  }

  const handleRecusar = async (id: string) => {
    try {
      if (!user) return
      await reqInternasService.updateStatus(id, 'recusado', user.id)
      toast({ title: 'Sucesso', description: 'Requisição recusada.' })
      setRequisicoes((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'recusado' } : r)))
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao recusar.',
      })
    }
  }

  if (loading) return <div className="p-8">Carregando requisições...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Requisições Internas</h1>
        <Button asChild>
          <Link to="/app/estoque/requisicoes-internas/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova Requisição
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Requisições</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Status</TableHead>
                {isManager && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisicoes.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{new Date(req.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{req.produto?.nome}</TableCell>
                  <TableCell>
                    {req.quantidade} {req.produto?.unidade_medida}
                  </TableCell>
                  <TableCell>{req.solicitante?.nome || 'Usuário'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === 'aprovado'
                          ? 'default'
                          : req.status === 'recusado'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={req.status === 'aprovado' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </Badge>
                  </TableCell>
                  {isManager && (
                    <TableCell className="text-right space-x-2">
                      {req.status === 'pendente' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleAprovar(req.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRecusar(req.id)}
                          >
                            <X className="h-4 w-4 mr-1" /> Recusar
                          </Button>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {requisicoes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isManager ? 6 : 5}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Nenhuma requisição encontrada.
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
