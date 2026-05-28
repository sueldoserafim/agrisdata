import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Users, AlertTriangle, Briefcase, FileText } from 'lucide-react'
import { ModuleHelp } from '@/components/ModuleHelp'

export default function RHDashboard() {
  const { empresa } = useEmpresa()
  const [stats, setStats] = useState({
    funcionarios: 0,
    feriasPendentes: 0,
    episVencendo: 0,
  })

  useEffect(() => {
    if (!empresa) return
    const fetchStats = async () => {
      const [funcRes, feriasRes, episRes] = await Promise.all([
        supabase
          .from('funcionarios')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id),
        supabase
          .from('rh_ferias_afastamentos')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id)
          .eq('status', 'solicitado'),
        supabase
          .from('rh_epi_entregas')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id)
          .lte('data_vencimento', new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      setStats({
        funcionarios: funcRes.count || 0,
        feriasPendentes: feriasRes.count || 0,
        episVencendo: episRes.count || 0,
      })
    }
    fetchStats()
  }, [empresa])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos Humanos</h1>
          <p className="text-muted-foreground">Visão geral e gestão de pessoas.</p>
        </div>
        <ModuleHelp
          title="Módulo de RH"
          description="Gestão integrada de recursos humanos."
          rules={[
            'Ponto Eletrônico: requer permissão de GPS no dispositivo.',
            'Afastamentos: solicitações de férias e licenças podem ser aprovadas ou rejeitadas pelos gestores.',
            'Folha de Pagamento: valores gerados automaticamente podem ser fechados e integrados com o financeiro.',
            'EPIs: o sistema alerta 10 dias antes do vencimento do equipamento de proteção.',
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.funcionarios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Férias Pendentes</CardTitle>
            <Briefcase className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feriasPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">EPIs Próx. Vencimento</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.episVencendo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Folhas Abertas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
