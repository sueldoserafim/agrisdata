import { useState, useEffect } from 'react'
import { Plus, Trash, ExternalLink, Copy, Search, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, isAfter } from 'date-fns'
import PortalTokenForm from './PortalTokenForm'
import { Input } from '@/components/ui/input'

export default function PortalTokensList() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTokens = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('portal_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar tokens', { description: error.message })
    } else {
      setTokens(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja revogar este acesso? O token deixará de funcionar imediatamente.')) return

    const { error } = await supabase.from('portal_tokens').update({ ativo: false }).eq('id', id)
    if (error) {
      toast.error('Erro ao revogar token', { description: error.message })
    } else {
      toast.success('Token revogado com sucesso')
      fetchTokens()
    }
  }

  const copyToClipboard = (token: string, tipo: string) => {
    const url = `${window.location.origin}/portal/${tipo}/${token}`
    navigator.clipboard.writeText(url)
    toast.success('Link do portal copiado!', { description: 'Você já pode enviar para o parceiro.' })
  }

  const filteredTokens = tokens.filter(t => 
    t.nome_entidade.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.entidade_tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Portais Externos
          </h1>
          <p className="text-slate-500">Gerencie tokens de acesso seguro para parceiros e clientes.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Gerar Novo Acesso
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <CardTitle>Acessos Gerados</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou tipo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell>
                  </TableRow>
                ) : filteredTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Nenhum token encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokens.map((t) => {
                    const isExpired = !isAfter(new Date(t.data_expiracao), new Date())
                    const isValid = t.ativo && !isExpired

                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.nome_entidade}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{t.entidade_tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {t.acessos_permitidos.map((perm: string) => (
                              <Badge key={perm} variant="secondary" className="text-[10px]">{perm}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className={isExpired ? 'text-red-500 font-medium' : ''}>
                          {format(new Date(t.data_expiracao), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {t.ultimo_acesso ? format(new Date(t.ultimo_acesso), 'dd/MM/yyyy HH:mm') : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          {isValid ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Ativo</Badge>
                          ) : (
                            <Badge variant="destructive">
                              {isExpired ? 'Expirado' : 'Revogado'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(t.token, t.entidade_tipo)}
                            title="Copiar Link"
                            disabled={!isValid}
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              window.open(`/portal/${t.entidade_tipo}/${t.token}`, '_blank')
                            }}
                            title="Acessar Portal"
                            disabled={!isValid}
                          >
                            <ExternalLink className="w-4 h-4 text-slate-600" />
                          </Button>
                          {isValid && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(t.id)}
                              title="Revogar Acesso"
                            >
                              <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <PortalTokenForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false)
            fetchTokens()
          }} 
        />
      )}
    </div>
  )
}
