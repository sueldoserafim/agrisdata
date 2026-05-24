import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEmpresa } from '@/services/admin/empresas'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AdminEmpresasDetail() {
  const { id } = useParams()
  const [empresa, setEmpresa] = useState<any>(null)
  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      getEmpresa(id).then(setEmpresa)
      supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', id)
        .then(({ data }) => setUsuarios(data || []))
    }
  }, [id])

  if (!empresa) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/empresas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{empresa.nome}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">CNPJ:</span> {empresa.cnpj || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {empresa.email || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Telefone:</span> {empresa.telefone || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Slug:</span> {empresa.slug}
            </div>
            <div>
              <span className="font-semibold">Plano:</span> {empresa.planos?.nome || 'Nenhum'}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {empresa.ativo ? 'Ativo' : 'Inativo'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários ({usuarios.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
            ) : (
              <ul className="space-y-2">
                {usuarios.map((u) => (
                  <li key={u.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{u.nome || u.email}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{u.perfil}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
