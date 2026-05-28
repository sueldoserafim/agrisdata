import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Copy, Trash2, Plus, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import PortaisExternosForm from './PortaisExternosForm'

export default function PortaisExternosList() {
  const { empresa } = useEmpresa()
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadTokens = async () => {
    if (!empresa) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portal_tokens')
        .select('*')
        .eq('empresa_id', empresa.id)
        .eq('ativo', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTokens(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar tokens: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTokens()
  }, [empresa])

  const copyToClipboard = (tokenStr: string, tipo: string) => {
    const url = `${window.location.origin}/portal/${tipo}/${tokenStr}`
    navigator.clipboard.writeText(url)
    toast.success('Link do portal copiado para a área de transferência')
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Deseja realmente revogar este acesso?')) return
    try {
      const { error } = await supabase
        .from('portal_tokens')
        .update({ ativo: false, deleted_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      toast.success('Acesso revogado com sucesso')
      loadTokens()
    } catch (error: any) {
      toast.error('Erro ao revogar acesso: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portais Externos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie links de acesso seguro para clientes, produtores e despachantes.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Gerar Novo Acesso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" /> Links Ativos
          </CardTitle>
          <CardDescription>
            Qualquer pessoa com o link válido poderá acessar os dados permitidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acessos Permitidos</TableHead>
                  <TableHead>Expiração</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
                  </TableRow>
                ) : tokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum link ativo. Clique em "Gerar Novo Acesso" para criar um.
                    </TableCell>
                  </TableRow>
                ) : (
                  tokens.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{t.entidade_tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {t.acessos_permitidos.map((acc: string) => (
                            <Badge key={acc} variant="secondary" className="text-xs font-normal">
                              {acc}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(t.data_expiracao), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {t.ultimo_acesso 
                          ? format(new Date(t.ultimo_acesso), 'dd/MM HH:mm', { locale: ptBR })
                          : <span className="text-muted-foreground text-sm">Nunca</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(t.token, t.entidade_tipo)} title="Copiar Link">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <a href={`/portal/${t.entidade_tipo}/${t.token}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" title="Abrir">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRevoke(t.id)} title="Revogar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <PortaisExternosForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false)
            loadTokens()
          }} 
        />
      )}
    </div>
  )
}
