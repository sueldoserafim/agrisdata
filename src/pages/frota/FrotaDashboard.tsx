import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Truck, Wrench, AlertCircle, Droplets } from 'lucide-react'
import { ModuleHelp } from '@/components/ModuleHelp'

export default function FrotaDashboard() {
  const { empresa } = useEmpresa()
  const [stats, setStats] = useState({
    veiculos: 0,
    viagensAtivas: 0,
    manutencoesPendentes: 0,
    alertasConsumo: 0,
  })

  useEffect(() => {
    if (!empresa) return
    const fetchStats = async () => {
      const [vRes, mRes, alertRes] = await Promise.all([
        supabase
          .from('frota_veiculos')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id),
        supabase
          .from('frota_manutencoes')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id)
          .is('data_realizada', null),
        supabase
          .from('alertas')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id)
          .eq('tipo', 'frota_consumo')
          .eq('lido', false),
      ])

      setStats({
        veiculos: vRes.count || 0,
        viagensAtivas: 0,
        manutencoesPendentes: mRes.count || 0,
        alertasConsumo: alertRes.count || 0,
      })
    }
    fetchStats()
  }, [empresa])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Frota</h1>
          <p className="text-muted-foreground">Controle de veículos, viagens e custos.</p>
        </div>
        <ModuleHelp
          title="Gestão de Frota"
          description="Controle total sobre seus veículos e logística."
          rules={[
            'Os veículos possuem controle de documentação e seguros.',
            'As manutenções podem ser preventivas (geram alerta 15 dias antes) ou corretivas.',
            'O sistema monitora a média de Km/L. Caso um abastecimento tenha um desvio maior que 20% da média do veículo, um alerta de anomalia é disparado.',
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Veículos Cadastrados</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.veiculos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.manutencoesPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Consumo</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertasConsumo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mês (Mock)</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.300,00</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
