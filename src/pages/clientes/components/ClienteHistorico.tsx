import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, History } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface AuditLog {
  id: string
  acao: string
  created_at: string
  dados_anteriores: any
  dados_novos: any
  usuario: {
    nome: string
    email: string
  }
}

export function ClienteHistorico({ clienteId }: { clienteId: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      if (!clienteId) return

      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          id, acao, created_at, dados_anteriores, dados_novos,
          usuario_id
        `)
        .eq('tabela', 'clientes')
        .eq('registro_id', clienteId)
        .order('created_at', { ascending: false })

      if (data) {
        const userIds = data.map((d) => d.usuario_id).filter(Boolean)
        let usersMap: Record<string, any> = {}

        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('usuarios')
            .select('id, nome, email')
            .in('id', userIds)

          if (users) {
            usersMap = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {})
          }
        }

        setLogs(
          data.map((d) => ({
            ...d,
            usuario: usersMap[d.usuario_id] || { nome: 'Sistema', email: '' },
          })),
        )
      }
      setLoading(false)
    }

    fetchLogs()
  }, [clienteId])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <History className="w-5 h-5" />
        Histórico de Alterações
      </h3>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-sm">
                  {log.acao === 'INSERT'
                    ? 'Criação'
                    : log.acao === 'UPDATE'
                      ? 'Atualização'
                      : 'Exclusão'}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  por {log.usuario.nome || log.usuario.email}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(log.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>

            {log.acao === 'UPDATE' && log.dados_anteriores && log.dados_novos && (
              <div className="mt-3 text-sm">
                <p className="text-muted-foreground mb-1">Campos alterados:</p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(log.dados_novos).map((key) => {
                    const oldVal = log.dados_anteriores[key]
                    const newVal = log.dados_novos[key]
                    if (JSON.stringify(oldVal) !== JSON.stringify(newVal) && key !== 'updated_at') {
                      return (
                        <div
                          key={key}
                          className="col-span-2 md:col-span-1 p-2 bg-white rounded border"
                        >
                          <p className="font-medium capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div
                              className="text-red-600 line-through truncate"
                              title={String(oldVal || 'vazio')}
                            >
                              {String(oldVal || 'vazio')}
                            </div>
                            <div
                              className="text-green-600 truncate"
                              title={String(newVal || 'vazio')}
                            >
                              {String(newVal || 'vazio')}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">
            Nenhum histórico encontrado.
          </p>
        )}
      </div>
    </div>
  )
}
