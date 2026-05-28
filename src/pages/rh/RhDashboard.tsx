import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, ShieldAlert, FileText } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'

export default function RhDashboard() {
  const { empresa } = useEmpresa()
  const [stats, setStats] = useState({ func: 0, ponto: 0, ferias: 0, epis: 0 })

  useEffect(() => {
    if (!empresa?.id) return
    const loadStats = async () => {
      const today = new Date().toISOString().split('T')[0]
      const [funcR, pontoR, feriasR, episR] = await Promise.all([
        supabase
          .from('funcionarios')
          .select('id', { count: 'exact' })
          .eq('empresa_id', empresa.id)
          .is('deleted_at', null),
        supabase
          .from('rh_ponto')
          .select('id', { count: 'exact' })
          .eq('empresa_id', empresa.id)
          .gte('timestamp', `${today}T00:00:00Z`),
        supabase
          .from('rh_ferias_afastamentos')
          .select('id', { count: 'exact' })
          .eq('empresa_id', empresa.id)
          .eq('status', 'solicitado'),
        supabase
          .from('rh_epi_entregas')
          .select('id', { count: 'exact' })
          .eq('empresa_id', empresa.id)
          .lte('data_vencimento', new Date(Date.now() + 10 * 86400000).toISOString()),
      ])

      setStats({
        func: funcR.count || 0,
        ponto: pontoR.count || 0,
        ferias: feriasR.count || 0,
        epis: episR.count || 0,
      })

      // Chama gerador de alertas
      supabase.rpc('gerar_alertas_rh_frota', { p_empresa_id: empresa.id }).then(() => {})
    }
    loadStats()
  }, [empresa])

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard RH</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.func}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Batidos (Hoje)</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ponto}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Férias Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ferias}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EPIs Vencendo</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.epis}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
