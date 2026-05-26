import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, CloudRain, Droplets, Calendar, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, subDays, startOfMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { pluviometriaService, type Pluviometria } from '@/services/pluviometria'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function PluviometriaDashboard() {
  const [data, setData] = useState<Pluviometria[]>([])
  const [talhoes, setTalhoes] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTalhao, setFiltroTalhao] = useState('todos')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [pluvData, { data: talhoesData }] = await Promise.all([
        pluviometriaService.getAll(),
        supabase.from('talhoes').select('id, nome').is('deleted_at', null).order('nome'),
      ])
      setData(pluvData)
      if (talhoesData) setTalhoes(talhoesData)
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await pluviometriaService.delete(id)
      toast({ title: 'Sucesso', description: 'Registro excluído com sucesso.' })
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filtroTalhao !== 'todos' && item.talhao_id !== filtroTalhao) return false
      if (filtroDataInicio && item.data && item.data < filtroDataInicio) return false
      if (filtroDataFim && item.data && item.data > filtroDataFim) return false
      return true
    })
  }, [data, filtroTalhao, filtroDataInicio, filtroDataFim])

  const totalMensal = useMemo(() => {
    const start = startOfMonth(new Date())
    return data
      .filter((d) => d.data && parseISO(d.data) >= start)
      .reduce((acc, curr) => acc + (curr.precipitacao_mm || 0), 0)
  }, [data])

  const mediaSemanal = useMemo(() => {
    const start = subDays(new Date(), 7)
    const records = data.filter((d) => d.data && parseISO(d.data) >= start)
    if (records.length === 0) return 0
    const sum = records.reduce((acc, curr) => acc + (curr.precipitacao_mm || 0), 0)
    return sum / 7
  }, [data])

  const ultimoRegistro = useMemo(() => {
    if (data.length === 0) return null
    return data[0]
  }, [data])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pluviometria</h1>
          <p className="text-slate-500 mt-1">
            Monitore e registre os níveis de precipitação dos talhões.
          </p>
        </div>
        <Link to="/app/agronomia/pluviometria/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Registro
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precipitação Mensal
            </CardTitle>
            <CloudRain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMensal.toFixed(1)}{' '}
              <span className="text-sm font-normal text-muted-foreground">mm</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado neste mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média Semanal
            </CardTitle>
            <Droplets className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mediaSemanal.toFixed(1)}{' '}
              <span className="text-sm font-normal text-muted-foreground">mm/dia</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Média diária nos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Último Registro
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ultimoRegistro?.precipitacao_mm?.toFixed(1) || '0.0'}{' '}
              <span className="text-sm font-normal text-muted-foreground">mm</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ultimoRegistro?.data
                ? format(parseISO(ultimoRegistro.data), 'dd/MM/yyyy', { locale: ptBR })
                : 'Nenhum registro'}
              {ultimoRegistro?.talhoes?.nome ? ` em ${ultimoRegistro.talhoes.nome}` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Chuvas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Select value={filtroTalhao} onValueChange={setFiltroTalhao}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os Talhões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Talhões</SelectItem>
                  {talhoes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                placeholder="Data Início"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                placeholder="Data Fim"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Talhão</TableHead>
                  <TableHead className="text-right">Precipitação (mm)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.data
                          ? format(parseISO(item.data), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>{item.talhoes?.nome || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {item.precipitacao_mm?.toFixed(1)} mm
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/app/agronomia/pluviometria/${item.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o registro de{' '}
                                  {item.precipitacao_mm}mm do dia{' '}
                                  {item.data ? format(parseISO(item.data), 'dd/MM/yyyy') : ''}? Esta
                                  ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
