import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf } from 'lucide-react'

export default function EsgBI() {
  const { empresa } = useEmpresa()
  const [metrics, setMetrics] = useState({ totalCo2e: 0, totalKg: 0, intensity: 0 })

  useEffect(() => {
    if (!empresa?.id) return
    async function load() {
      const { data: emissoes } = await supabase
        .from('emissoes_carbono')
        .select('co2e_total')
        .eq('empresa_id', empresa.id)
      const { data: colheitas } = await supabase
        .from('colheita_registros')
        .select('producao_liquida_ton')
        .eq('empresa_id', empresa.id)

      const totalCo2e = emissoes?.reduce((acc, e) => acc + (e.co2e_total || 0), 0) || 0
      const totalKg =
        colheitas?.reduce((acc, c) => acc + (c.producao_liquida_ton || 0) * 1000, 0) || 0

      setMetrics({
        totalCo2e: Math.round(totalCo2e),
        totalKg: Math.round(totalKg),
        intensity: totalKg > 0 ? Number((totalCo2e / totalKg).toFixed(4)) : 0,
      })
    }
    load()
  }, [empresa?.id])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Total CO2e Emissions</CardTitle>
          <Leaf className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.totalCo2e.toLocaleString()} kg</div>
          <p className="text-sm text-muted-foreground mt-1">Accumulated across operations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle>Total Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.totalKg.toLocaleString()} kg</div>
          <p className="text-sm text-muted-foreground mt-1">Total clean yield</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-emerald-700">Carbon Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">{metrics.intensity}</div>
          <p className="text-sm text-emerald-600/80 mt-1">kg CO2e / kg produced</p>
        </CardContent>
      </Card>
    </div>
  )
}
