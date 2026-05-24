import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getEmpresa } from '@/services/admin/empresas'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function AdminEmpresasDetail() {
  const { id } = useParams()
  const [empresa, setEmpresa] = useState<any>(null)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [faturas, setFaturas] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      getEmpresa(id).then(setEmpresa)

      supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', id)
        .then(({ data }) => setUsuarios(data || []))

      supabase
        .from('saas_faturas')
        .select('*')
        .eq('empresa_id', id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setFaturas(data || []))

      supabase
        .from('suporte_tickets')
        .select('*')
        .eq('empresa_id', id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setTickets(data || []))
    }
  }, [id])

  if (!empresa) return <div className="p-6">Carregando...</div>

  const modulosDisponiveis = [
    { id: 'caderno_campo', label: 'Caderno de Campo' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'estoque', label: 'Estoque' },
    { id: 'maquinario', label: 'Maquinário' },
    { id: 'relatorios', label: 'Relatórios Avançados' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/empresas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {empresa.nome}
            <Badge variant={empresa.ativo ? 'default' : 'secondary'}>
              {empresa.ativo ? 'Ativa' : 'Inativa'}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm">CNPJ: {empresa.cnpj || 'Não informado'}</p>
        </div>
        <div className="ml-auto">
          <Button asChild variant="outline">
            <Link to={`/admin/empresas/${id}/edit`}>Editar Empresa</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários ({usuarios.length})</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="suporte">Suporte ({tickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4">
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">Email</span>{' '}
                {empresa.email || '—'}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">Telefone</span>{' '}
                {empresa.telefone || '—'}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">Slug</span>{' '}
                {empresa.slug}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">Plano</span>{' '}
                <Badge variant="outline">{empresa.planos?.nome || 'Nenhum'}</Badge>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">
                  Limite de Usuários
                </span>{' '}
                {empresa.limite_usuarios || 5}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-sm">Criada em</span>{' '}
                {new Date(empresa.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Lista de usuários associados a esta empresa.</CardDescription>
              </div>
              <Button size="sm">Adicionar Usuário</Button>
            </CardHeader>
            <CardContent>
              {usuarios.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum usuário encontrado.</p>
              ) : (
                <div className="space-y-2">
                  {usuarios.map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium">{u.nome || u.email}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {u.perfil}
                        </Badge>
                        <Badge variant={u.ativo ? 'default' : 'secondary'}>
                          {u.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modulos">
          <Card>
            <CardHeader>
              <CardTitle>Módulos Habilitados</CardTitle>
              <CardDescription>Gerencie o acesso às funcionalidades da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulosDisponiveis.map((mod) => {
                  const isEnabled = empresa.modulos_habilitados?.includes(mod.id)
                  return (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span className="font-medium">{mod.label}</span>
                      {isEnabled ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <XCircle className="text-muted-foreground" />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link to={`/admin/empresas/${id}/edit`}>Alterar Módulos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturamento">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              {faturas.length === 0 ? (
                <p className="text-muted-foreground text-sm">Sem histórico.</p>
              ) : (
                <div className="space-y-2">
                  {faturas.map((f) => (
                    <div
                      key={f.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Ref: {f.mes_referencia}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento:{' '}
                          {f.data_vencimento
                            ? new Date(f.data_vencimento).toLocaleDateString()
                            : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">R$ {f.valor_total}</span>
                        <Badge variant={f.status === 'pago' ? 'default' : 'secondary'}>
                          {f.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suporte">
          <Card>
            <CardHeader>
              <CardTitle>Tickets de Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum ticket aberto.</p>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <Link
                          to={`/admin/suporte/${t.id}`}
                          className="font-medium hover:underline text-primary"
                        >
                          {t.titulo}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString()} - Módulo:{' '}
                          {t.modulo || 'Geral'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{t.prioridade}</Badge>
                        <Badge variant={t.status === 'aberto' ? 'destructive' : 'secondary'}>
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
