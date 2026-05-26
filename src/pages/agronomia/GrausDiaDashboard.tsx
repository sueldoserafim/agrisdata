import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ThermometerSun, Leaf, Clock, Target, CalendarDays, Loader2 } from 'lucide-react'
import { format, addDays, parseISO } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { grausDiaService } from '@/services/graus-dia'
import { cn } from '@/lib/utils'

export default function GrausDiaDashboard() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [safras, setSafras] = useState<any[]>([])
  const [selectedSafraId, setSelectedSafraId] = useState<string>('')
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa) {
      loadSafras()
    }
  }, [empresa])

  useEffect(() => {
    if (empresa && selectedSafraId) {
      loadRecords()
    } else {
      setRecords([])
    }
  }, [selectedSafraId, empresa])

  const loadSafras = async () => {
    try {
      setLoading(true)
      const data = await grausDiaService.getSafras(empresa!.id)
      setSafras(data || [])
      if (data && data.length > 0) {
        setSelectedSafraId(data[0].id)
      }
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Erro ao carregar safras', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const loadRecords = async () => {
    try {
      setLoading(true)
      const data = await grausDiaService.fetchBySafra(empresa!.id, selectedSafraId)
      setRecords(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registros de GDA',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const {
    totalGDA,
    targetGDA,
    progress,
    estimatedDays,
    estimativaDate,
    badgeAlert,
    processedRecords,
  } = useMemo(() => {
    if (!selectedSafraId)
      return {
        processedRecords: [],
        totalGDA: 0,
        targetGDA: 0,
        progress: 0,
        estimatedDays: 0,
        estimativaDate: null,
        badgeAlert: null,
      }

    const safra = safras.find((s) => s.id === selectedSafraId)
    const target = safra?.cultivares?.gda_objetivo_colheita || 0

    // Sort asc to calculate running total
    const ascRecords = [...records].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    )

    let sum = 0
    const processed = ascRecords.map((r) => {
      sum += Number(r.gda_diario || 0)
      return { ...r, acumulado: sum }
    })

    // Reverse back to desc for table display
    processed.reverse()

    const prog = target > 0 ? Math.min((sum / target) * 100, 100) : 0

    // Estimate based on last 7 records
    const last7 = ascRecords.slice(-7)
    const avgLast7 =
      last7.length > 0
        ? last7.reduce((acc, r) => acc + Number(r.gda_diario || 0), 0) / last7.length
        : 0

    let estDays = 0
    let estDate = null
    let alert = null

    if (target > 0 && avgLast7 > 0 && sum < target) {
      estDays = Math.ceil((target - sum) / avgLast7)
      estDate = addDays(new Date(), estDays)

      const remainingGDA = target - sum
      if (remainingGDA <= 7 * avgLast7) {
        alert = {
          label: `Janela de colheita em ~${estDays} dias!`,
          color: 'bg-destructive text-destructive-foreground border-transparent',
        }
      } else if (remainingGDA <= 14 * avgLast7) {
        alert = {
          label: `Atenção: Colheita em ~${estDays} dias`,
          color: 'bg-yellow-500 text-white border-transparent',
        }
      }
    }

    return {
      totalGDA: sum,
      targetGDA: target,
      progress: prog,
      estimatedDays: estDays,
      estimativaDate: estDate,
      badgeAlert: alert,
      processedRecords: processed,
    }
  }, [records, selectedSafraId, safras])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ThermometerSun className="size-8 text-primary" />
            Painel GDA (Graus-Dia)
          </h1>
          <p className="text-muted-foreground">
            Monitore o acúmulo térmico e a estimativa de colheita.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Select value={selectedSafraId} onValueChange={setSelectedSafraId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Safra" />
              </SelectTrigger>
              <SelectContent>
                {safras.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nome_safra || s.codigo_safra || 'Safra Sem Nome'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Link to="/app/agronomia/gda/novo">
            <Button>
              <Plus className="size-4 mr-2" />
              Novo Registro
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GDA Acumulado</CardTitle>
                <ThermometerSun className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGDA.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Soma total da safra selecionada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GDA para Colheita</CardTitle>
                <Target className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {targetGDA > 0 ? targetGDA.toFixed(1) : 'Não definido'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Objetivo baseado na cultivar</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  Progresso até a Colheita
                  {badgeAlert && (
                    <Badge className={cn('ml-2 font-medium', badgeAlert.color)}>
                      {badgeAlert.label}
                    </Badge>
                  )}
                </CardTitle>
                <Leaf className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-2">
                  <Progress value={progress} className="h-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}% Alcançado</span>
                    {estimativaDate && (
                      <span className="flex items-center gap-1 font-medium text-primary">
                        <CalendarDays className="size-3" />
                        Estimativa: {format(estimativaDate, 'dd/MM/yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Histórico de Registros
              </CardTitle>
              <CardDescription>Acompanhamento diário do desenvolvimento térmico</CardDescription>
            </CardHeader>
            <CardContent>
              {processedRecords.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Temp. Máxima</TableHead>
                        <TableHead>Temp. Mínima</TableHead>
                        <TableHead>GDA Diário</TableHead>
                        <TableHead>GDA Acumulado</TableHead>
                        <TableHead>Fonte</TableHead>
                        <TableHead>Responsável</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedRecords.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">
                            {r.data ? format(parseISO(r.data), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>{r.temp_maxima ? `${r.temp_maxima} °C` : '-'}</TableCell>
                          <TableCell>{r.temp_minima ? `${r.temp_minima} °C` : '-'}</TableCell>
                          <TableCell className="font-semibold text-primary">
                            {r.gda_diario ? Number(r.gda_diario).toFixed(2) : '-'}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {r.acumulado ? Number(r.acumulado).toFixed(2) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {r.fonte_dados?.replace('_', ' ') || '-'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {r.usuarios?.nome || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <ThermometerSun className="size-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhum registro encontrado
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione os dados diários de temperatura para acompanhar o GDA.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
