import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, MapPin, Calculator } from 'lucide-react'
import { ModuleHelp } from '@/components/ModuleHelp'

export default function PatrimonioDashboard() {
  const { empresa } = useEmpresa()
  const [stats, setStats] = useState({
    bens: 0,
    valorTotal: 0,
  })

  useEffect(() => {
    if (!empresa) return
    const fetchStats = async () => {
      const { data } = await supabase
        .from('patrimonio_bens')
        .select('valor_aquisicao')
        .eq('empresa_id', empresa.id)

      let total = 0
      data?.forEach((b) => (total += Number(b.valor_aquisicao)))

      setStats({
        bens: data?.length || 0,
        valorTotal: total,
      })
    }
    fetchStats()
  }, [empresa])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patrimônio</h1>
          <p className="text-muted-foreground">Gestão de bens imobilizados e ativos.</p>
        </div>
        <ModuleHelp
          title="Gestão de Patrimônio"
          description="Controle do ativo imobilizado da empresa."
          rules={[
            'O valor contábil (Book Value) de cada bem é calculado automaticamente baseando-se no valor de aquisição, vida útil estimada em meses e data da compra (Depreciação Linear).',
            'É possível fazer inventário rápido pelo aplicativo acessando a opção de Scanner QR.',
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ativos Registrados</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bens}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor de Aquisição Global</CardTitle>
            <Calculator className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventário Rápido</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Use o leitor QR para encontrar itens fisicamente.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
