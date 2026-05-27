import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash, Warehouse, Search, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default function EstufasList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [estufas, setEstufas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (empresa) loadEstufas()
  }, [empresa])

  const loadEstufas = async () => {
    setLoading(true)
    const { data: estufasData, error: estufasError } = await supabase
      .from('estufas')
      .select('*, fazendas(nome)')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('nome')

    const { data: lotesData } = await supabase
      .from('lotes_mudas')
      .select('estufa_id, status')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)

    if (estufasError) {
      toast({
        title: 'Erro ao carregar estufas',
        description: estufasError.message,
        variant: 'destructive',
      })
    } else {
      const estufasWithLots =
        estufasData?.map((estufa) => {
          const lotes = lotesData?.filter((l) => l.estufa_id === estufa.id) || []
          const activeBatches = lotes.filter(
            (l) => l.status !== 'transplantado' && l.status !== 'descartado',
          )
          return {
            ...estufa,
            activeBatchesCount: activeBatches.length,
          }
        }) || []
      setEstufas(estufasWithLots)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta estufa?')) return

    const { error } = await supabase
      .from('estufas')
      .update({ deleted_at: new Date().toISOString(), ativo: false })
      .eq('id', id)

    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Estufa excluída com sucesso' })
      loadEstufas()
    }
  }

  const filtered = estufas.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.tipo?.toLowerCase().includes(search.toLowerCase()),
  )

  const getTypeLabel = (tipo: string) => {
    const tipos: any = {
      viveiro: 'Viveiro',
      propagador: 'Propagador',
      ambiente_controlado: 'Ambiente Controlado',
      sombrite: 'Sombrite',
    }
    return tipos[tipo] || tipo
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estufas & Viveiros</h1>
          <p className="text-muted-foreground mt-1">Gerencie os ambientes de produção de mudas</p>
        </div>
        <Button onClick={() => navigate('/app/estufas/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Estufa
        </Button>
      </div>

      <div className="relative w-full sm:max-w-md mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar estufa..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground animate-pulse">
          Carregando estufas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed">
          Nenhuma estufa encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((estufa) => {
            const isFull =
              estufa.capacidade_lotes > 0 && estufa.activeBatchesCount >= estufa.capacidade_lotes
            const occupancy =
              estufa.capacidade_lotes > 0
                ? Math.min(
                    100,
                    Math.round((estufa.activeBatchesCount / estufa.capacidade_lotes) * 100),
                  )
                : 0
            return (
              <Card
                key={estufa.id}
                className={cn(
                  'overflow-hidden hover:shadow-md transition-shadow',
                  isFull && 'border-red-300 shadow-sm',
                )}
              >
                <CardHeader className="pb-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Warehouse className="h-5 w-5 text-emerald-600" />
                      {estufa.nome}
                    </CardTitle>
                    <div className="flex gap-1 -mt-1 -mr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/app/estufas/${estufa.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(estufa.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-normal">
                      {getTypeLabel(estufa.tipo)}
                    </Badge>
                    <span className="text-xs">{estufa.fazendas?.nome || 'Sem Fazenda'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">
                        Área Total
                      </p>
                      <p className="font-medium">{estufa.area_m2 ? `${estufa.area_m2} m²` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">
                        Status
                      </p>
                      {estufa.ativo ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 shadow-none">
                          Em Operação
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="border-0 shadow-none">
                          Inativa
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        Ocupação (Lotes Ativos)
                      </span>
                      <span
                        className={cn('font-bold', isFull ? 'text-red-500' : 'text-emerald-600')}
                      >
                        {estufa.activeBatchesCount}{' '}
                        <span className="text-muted-foreground font-normal">
                          / {estufa.capacidade_lotes || '∞'}
                        </span>
                      </span>
                    </div>
                    {estufa.capacidade_lotes > 0 && (
                      <Progress
                        value={occupancy}
                        className={cn('h-2.5 bg-muted', isFull && 'bg-red-100 [&>div]:bg-red-500')}
                      />
                    )}
                    {isFull && (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-1.5 animate-pulse">
                        <AlertCircle className="h-3.5 w-3.5" /> Capacidade Máxima Atingida
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
