import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Download, Leaf, Recycle, Factory } from 'lucide-react'
import { sustentabilidadeService } from '@/services/sustentabilidade'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Emissao = any
type Residuo = any
type BalancoMassa = any
type Alerta = any

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

export default function DashboardSustentabilidade() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [emissoes, setEmissoes] = useState<Emissao[]>([])
  const [residuos, setResiduos] = useState<Residuo[]>([])
  const [balancoMassas, setBalancoMassas] = useState<BalancoMassa[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()

        if (profile?.empresa_id) {
          await sustentabilidadeService.syncSustentabilidadeAlertas(profile.empresa_id)

          const [resEmissoes, resResiduos, resBalanco, resAlertas] = await Promise.all([
            sustentabilidadeService.getEmissoes(profile.empresa_id),
            sustentabilidadeService.getResiduos(profile.empresa_id),
            sustentabilidadeService.getBalancoMassas(profile.empresa_id),
            sustentabilidadeService.getAlertas(profile.empresa_id),
          ])

          if (resEmissoes.data) setEmissoes(resEmissoes.data)
          if (resResiduos.data) setResiduos(resResiduos.data)
          if (resBalanco.data) setBalancoMassas(resBalanco.data)
          if (resAlertas.data) setAlertas(resAlertas.data)
        }
      } catch (error: any) {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do painel.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user, toast])

  const totalCO2e = useMemo(
    () => emissoes.reduce((acc, curr) => acc + (Number(curr.co2e_total) || 0), 0),
    [emissoes],
  )

  const totalProduzido = useMemo(
    () => balancoMassas.reduce((acc, curr) => acc + (Number(curr.quantidade_colhida_kg) || 0), 0),
    [balancoMassas],
  )

  const intensidadeCarbono = useMemo(() => {
    if (totalProduzido > 0) return totalCO2e / totalProduzido
    return 0
  }, [totalCO2e, totalProduzido])

  const emissoesPorFonte = useMemo(() => {
    const grouped = emissoes.reduce((acc: any, curr) => {
      acc[curr.fonte_emissao] = (acc[curr.fonte_emissao] || 0) + Number(curr.co2e_total || 0)
      return acc
    }, {})
    return Object.keys(grouped).map((key) => ({ name: key, value: grouped[key] }))
  }, [emissoes])

  const residuosPorTipo = useMemo(() => {
    const grouped = residuos.reduce((acc: any, curr) => {
      acc[curr.tipo_residuo] = (acc[curr.tipo_residuo] || 0) + Number(curr.quantidade || 0)
      return acc
    }, {})
    return Object.keys(grouped).map((key) => ({ name: key, value: grouped[key] }))
  }, [residuos])

  const complianceResiduosPerigosos = useMemo(() => {
    const perigosos = residuos.filter((r) => r.tipo_residuo === 'perigoso')
    const total = perigosos.length
    if (total === 0) return { percent: 100, total, comCdf: 0 }
    const comCdf = perigosos.filter(
      (r) => r.numero_cdf && r.status_logistica_reversa === 'comprovado',
    ).length
    return { percent: (comCdf / total) * 100, total, comCdf }
  }, [residuos])

  const exportPdf = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        Carregando métricas ESG...
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            Dashboard de Sustentabilidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão consolidada de métricas ESG e pegada ambiental.
          </p>
        </div>
        <Button onClick={exportPdf} className="gap-2 shrink-0 bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4" /> Relatório de Sustentabilidade
        </Button>
      </div>

      {alertas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Alertas Críticos de Conformidade
          </h3>
          {alertas.map((alerta) => (
            <Alert
              variant="destructive"
              key={alerta.id}
              className="bg-red-50 text-red-900 border-red-200"
            >
              <AlertTriangle className="h-4 w-4 stroke-red-600" />
              <AlertTitle className="text-red-800">{alerta.titulo}</AlertTitle>
              <AlertDescription>{alerta.descricao}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center gap-2">
              <Factory className="h-4 w-4 text-emerald-500" /> Total Emissões
            </CardDescription>
            <CardTitle className="text-4xl font-black text-slate-800">
              {totalCO2e.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              <span className="text-sm font-normal text-muted-foreground ml-1">tCO2e</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-blue-500" /> Intensidade de Carbono
            </CardDescription>
            <CardTitle className="text-4xl font-black text-slate-800">
              {intensidadeCarbono.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                kgCO2e / kg prod
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center gap-2">
              <Recycle className="h-4 w-4 text-amber-500" /> Conformidade CDF
            </CardDescription>
            <CardTitle className="text-4xl font-black text-slate-800">
              {complianceResiduosPerigosos.percent.toFixed(1)}%
            </CardTitle>
            <CardDescription className="pt-1 text-xs">
              {complianceResiduosPerigosos.comCdf} de {complianceResiduosPerigosos.total} resíduos
              perigosos
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Emissões por Fonte</CardTitle>
            <CardDescription>Distribuição de emissões de CO2e geradas</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissoesPorFonte}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    label
                  >
                    {emissoesPorFonte.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Resíduos por Tipo</CardTitle>
            <CardDescription>Volume gerado (kg / Litros)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={residuosPorTipo}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Quantidade" radius={[4, 4, 0, 0]}>
                    {residuosPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
