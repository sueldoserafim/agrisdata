import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function SafraDashboard() {
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [safras, setSafras] = useState<any[]>([])
  const [safraToClose, setSafraToClose] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('planejada')

  const loadSafras = async () => {
    if (!empresa?.id) return
    const { data } = await supabase
      .from('safras')
      .select('*, cultivares(nome, culturas(nome)), fazendas(nome)')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (data) setSafras(data)
  }

  useEffect(() => {
    loadSafras()
  }, [empresa?.id])

  const handleCloseSafra = async () => {
    if (!safraToClose) return

    try {
      const { error } = await supabase
        .from('safras')
        .update({ status: 'encerrada' })
        .eq('id', safraToClose.id)

      if (error) throw error

      toast({
        title: 'Safra encerrada',
        description: 'A safra foi encerrada com sucesso.',
      })

      loadSafras()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível encerrar a safra: ' + error.message,
        variant: 'destructive',
      })
    } finally {
      setSafraToClose(null)
    }
  }

  const normalizeStatus = (status: string | null) => {
    if (!status) return 'planejada'
    const s = status.toLowerCase()
    if (s.includes('andamento') || s === 'em_andamento') return 'em_andamento'
    if (s.includes('encerra') || s.includes('finaliza')) return 'finalizada'
    return 'planejada'
  }

  const filteredSafras = useMemo(() => {
    return safras.filter((safra) => {
      const statusMatch = normalizeStatus(safra.status) === activeTab

      const searchLower = searchTerm.toLowerCase()
      const nameMatch =
        (safra.nome_safra || '').toLowerCase().includes(searchLower) ||
        (safra.codigo_safra || '').toLowerCase().includes(searchLower) ||
        (safra.cultivares?.nome || '').toLowerCase().includes(searchLower) ||
        (safra.cultivares?.culturas?.nome || '').toLowerCase().includes(searchLower) ||
        (safra.fazendas?.nome || '').toLowerCase().includes(searchLower)

      return statusMatch && (searchTerm === '' || nameMatch)
    })
  }, [safras, activeTab, searchTerm])

  const counts = useMemo(() => {
    return safras.reduce(
      (acc, safra) => {
        const status = normalizeStatus(safra.status)
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [safras])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const getStatusBadge = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'planejada':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Planejada
          </Badge>
        )
      case 'em_andamento':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Em Andamento
          </Badge>
        )
      case 'finalizada':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Finalizada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderTable = () => (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[250px] font-semibold">Nome da Safra</TableHead>
              <TableHead className="font-semibold">Cultura / Cultivar</TableHead>
              <TableHead className="font-semibold">Fazenda</TableHead>
              <TableHead className="w-[100px] text-center font-semibold">Ano</TableHead>
              <TableHead className="w-[120px] text-center font-semibold">Data Plantio</TableHead>
              <TableHead className="w-[140px] text-center font-semibold">Status</TableHead>
              <TableHead className="w-[80px] text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSafras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Nenhuma safra encontrada para este status.
                </TableCell>
              </TableRow>
            ) : (
              filteredSafras.map((safra) => (
                <TableRow
                  key={safra.id}
                  className="cursor-pointer group hover:bg-muted/40 transition-colors"
                  onClick={() => navigate(`/app/safras/${safra.id}`)}
                >
                  <TableCell className="font-medium text-foreground">
                    {safra.nome_safra || safra.codigo_safra || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {safra.cultivares?.culturas?.nome || '-'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {safra.cultivares?.nome || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {safra.fazendas?.nome || '-'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {safra.ano_safra || '-'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {formatDate(safra.data_plantio)}
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(safra.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(normalizeStatus(safra.status) === 'planejada' ||
                        normalizeStatus(safra.status) === 'em_andamento') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSafraToClose(safra)
                          }}
                          title="Encerrar Safra"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Encerrar</span>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={`/app/safras/${safra.id}`} onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safras</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe o status de todas as safras.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/safras/new">
            <Plus className="w-4 h-4 mr-2" /> Nova Safra
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, fazenda ou cultivar..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 h-auto p-1 bg-muted/50 inline-flex rounded-lg">
          <TabsTrigger value="planejada" className="flex items-center gap-2 py-2 rounded-md">
            Planejadas
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary"
            >
              {counts['planejada'] || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="em_andamento" className="flex items-center gap-2 py-2 rounded-md">
            Em Andamento
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary"
            >
              {counts['em_andamento'] || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="finalizada" className="flex items-center gap-2 py-2 rounded-md">
            Finalizadas
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary"
            >
              {counts['finalizada'] || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planejada" className="m-0 focus-visible:outline-none">
          {renderTable()}
        </TabsContent>
        <TabsContent value="em_andamento" className="m-0 focus-visible:outline-none">
          {renderTable()}
        </TabsContent>
        <TabsContent value="finalizada" className="m-0 focus-visible:outline-none">
          {renderTable()}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!safraToClose} onOpenChange={(open) => !open && setSafraToClose(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Safra</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente encerrar esta safra? Esta ação alterará o status para encerrada e
              liberará os talhões vinculados para novos plantios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseSafra}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Encerrar Safra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
