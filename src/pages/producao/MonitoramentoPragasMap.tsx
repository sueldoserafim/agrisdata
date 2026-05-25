import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Plus, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function MonitoramentoPragasMap() {
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  const loadData = async () => {
    try {
      const { data: talhoesData } = await supabase
        .from('talhoes')
        .select('id, nome, safras(id, nome_safra)')
        .eq('empresa_id', empresa?.id)
        .is('deleted_at', null)

      const { data: monitoramentos } = await supabase
        .from('monitoramento_pragas')
        .select('*')
        .eq('empresa_id', empresa?.id)
        .is('deleted_at', null)
        .order('data_monitoramento', { ascending: false })

      if (talhoesData && monitoramentos) {
        const mapped = talhoesData.map((t) => {
          const latest = monitoramentos.find((m) => m.talhao_id === t.id)
          return { ...t, latest }
        })
        setTalhoes(mapped)
      }
    } finally {
      setLoading(false)
    }
  }

  const getColorClass = (nivel?: string) => {
    switch (nivel) {
      case 'ausente':
        return 'bg-green-500 text-white hover:bg-green-600'
      case 'baixo':
        return 'bg-yellow-400 text-black hover:bg-yellow-500'
      case 'médio':
        return 'bg-orange-500 text-white hover:bg-orange-600'
      case 'alto':
        return 'bg-red-500 text-white hover:bg-red-600'
      case 'crítico':
        return 'bg-red-900 text-white hover:bg-red-950'
      default:
        return 'bg-slate-200 text-slate-700 hover:bg-slate-300'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Monitoramento Integrado de Pragas (MIP)
          </h1>
          <p className="text-muted-foreground mt-1">Mapa de calor das infestações nos talhões</p>
        </div>
        <Button asChild>
          <Link to="/app/producao/monitoramento/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 text-xs mb-6 overflow-x-auto pb-2">
        <Badge variant="outline" className="bg-slate-200 text-slate-700">
          Sem Dados
        </Badge>
        <Badge variant="outline" className="bg-green-500 text-white border-transparent">
          Ausente
        </Badge>
        <Badge variant="outline" className="bg-yellow-400 text-black border-transparent">
          Baixo
        </Badge>
        <Badge variant="outline" className="bg-orange-500 text-white border-transparent">
          Médio
        </Badge>
        <Badge variant="outline" className="bg-red-500 text-white border-transparent">
          Alto
        </Badge>
        <Badge variant="outline" className="bg-red-900 text-white border-transparent">
          Crítico
        </Badge>
      </div>

      {loading ? (
        <div className="text-center p-12">Carregando mapa...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {talhoes.map((t) => (
            <Card
              key={t.id}
              className={cn(
                'overflow-hidden cursor-pointer transition-all hover:scale-[1.02]',
                getColorClass(t.latest?.nivel_infestacao),
              )}
              onClick={() => {
                if (t.latest) {
                  navigate(`/app/producao/monitoramento/${t.latest.id}`)
                } else {
                  navigate(
                    `/app/producao/monitoramento/novo?talhao=${t.id}&safra=${t.safras?.[0]?.id || ''}`,
                  )
                }
              }}
            >
              <div className="p-4 h-24 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">{t.nome}</h3>
                  <MapPin className="w-4 h-4 opacity-50 shrink-0" />
                </div>
                {t.latest ? (
                  <div className="text-sm opacity-90 truncate">{t.latest.praga_identificada}</div>
                ) : (
                  <div className="text-xs opacity-70">Sem registros recentes</div>
                )}
              </div>
              {t.latest && (
                <div className="bg-black/10 px-4 py-2 text-xs flex justify-between">
                  <span>{format(new Date(t.latest.data_monitoramento), 'dd/MM/yy')}</span>
                  <span className="capitalize font-semibold">{t.latest.nivel_infestacao}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
