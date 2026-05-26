import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, CheckCircle, Loader2, XCircle } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function SafraDashboard() {
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [safras, setSafras] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [safraToClose, setSafraToClose] = useState<any | null>(null)
  const [closureData, setClosureData] = useState<any>(null)
  const [loadingClosure, setLoadingClosure] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
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

  const loadUsuarios = async () => {
    if (!empresa?.id) return
    const { data } = await supabase
      .from('usuarios')
      .select('id, nome, perfil, email')
      .eq('empresa_id', empresa.id)
      .eq('ativo', true)
    if (data) setUsuarios(data)
  }

  useEffect(() => {
    loadSafras()
    loadUsuarios()
  }, [empresa?.id])

  const openClosureModal = async (safra: any) => {
    setSafraToClose(safra)
    setLoadingClosure(true)
    try {
      const [opsRes, colheitasRes, balancoRes] = await Promise.all([
        supabase
          .from('operacoes_campo')
          .select('status')
          .eq('safra_id', safra.id)
          .is('deleted_at', null),
        supabase
          .from('colheita_registros')
          .select('id')
          .eq('safra_id', safra.id)
          .is('deleted_at', null),
        supabase.from('balanco_massas').select('*').eq('safra_id', safra.id).maybeSingle(),
      ])

      const ops = opsRes.data || []
      const pendingOps = ops.filter((op) => op.status !== 'concluída' && op.status !== 'cancelada')
      const hasColheita = (colheitasRes.data || []).length > 0

      let divergence = 0
      const b = balancoRes.data
      if (b && b.quantidade_colhida_kg) {
        const inputs = b.quantidade_colhida_kg || 0
        const outputs = (b.quantidade_processada_kg || 0) + (b.quantidade_descarte_kg || 0)
        if (inputs > 0) {
          divergence = Math.abs((inputs - outputs) / inputs) * 100
        }
      }

      setClosureData({
        pendingOpsCount: pendingOps.length,
        hasColheita,
        divergence,
        isBalancoValid: divergence <= 0.5,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingClosure(false)
    }
  }

  const handleCloseSafra = async () => {
    if (!safraToClose || !selectedUser || !acceptTerms) return

    const selectedUserObj = usuarios.find((u) => u.id === selectedUser)
    const isCurrentUserAdmin =
      usuarios.find((u) => u.id === user?.id)?.perfil === 'admin' ||
      usuarios.find((u) => u.id === user?.id)?.perfil === 'admin_saas'

    if (selectedUser !== user?.id && !isCurrentUserAdmin) {
      toast({
        title: 'Não Autorizado',
        description:
          'Você só pode assinar o encerramento em seu próprio nome, a menos que seja um administrador.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await supabase
        .from('safras')
        .update({
          status: 'encerrada',
          data_colheita_real: new Date().toISOString().split('T')[0],
          responsavel_encerramento_id: user?.id,
          data_assinatura_tecnica: new Date().toISOString(),
        })
        .eq('id', safraToClose.id)

      if (error) throw error

      toast({
        title: 'Safra encerrada',
        description: 'A safra foi encerrada e bloqueada com sucesso.',
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
      setSelectedUser('')
      setClosureData(null)
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
                            openClosureModal(safra)
                          }}
                          title="Encerrar Safra"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Encerrar</span>
                        </Button>
                      )}
                      {normalizeStatus(safra.status) !== 'finalizada' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link to={`/app/safras/${safra.id}`} onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                      )}
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

      <AlertDialog
        open={!!safraToClose}
        onOpenChange={(open) => {
          if (!open) {
            setSafraToClose(null)
            setClosureData(null)
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Checklist de Encerramento da Safra</AlertDialogTitle>
            <AlertDialogDescription>
              A safra {safraToClose?.nome_safra || safraToClose?.codigo_safra} passará por
              validações antes de ser encerrada definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {loadingClosure ? (
            <div className="flex justify-center p-6">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : closureData ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                {closureData.pendingOpsCount === 0 ? (
                  <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                )}
                <span className="text-sm">
                  Todas as operações concluídas ({closureData.pendingOpsCount} pendentes)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {closureData.hasColheita ? (
                  <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                )}
                <span className="text-sm">Possui registros de colheita</span>
              </div>
              <div className="flex items-center gap-3">
                {closureData.isBalancoValid ? (
                  <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                )}
                <span className="text-sm">
                  Balanço de massas divergência ≤ 0.5% (Atual: {closureData.divergence.toFixed(2)}%)
                </span>
              </div>

              <div className="mt-4 pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <Label>Aprovação Técnica (Responsável Selecionado)</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável..." />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nome || u.email} ({u.perfil})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start space-x-2 pt-2 border-t">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal leading-snug cursor-pointer"
                  >
                    Eu,{' '}
                    <strong>{usuarios.find((u) => u.id === user?.id)?.nome || user?.email}</strong>,
                    confirmo a integridade dos dados e aprovo o encerramento técnico desta safra.
                    Assinatura Digital será registrada.
                  </Label>
                </div>
              </div>
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseSafra}
              disabled={
                !closureData ||
                closureData.pendingOpsCount > 0 ||
                !closureData.hasColheita ||
                !closureData.isBalancoValid ||
                !selectedUser ||
                !acceptTerms
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              Confirmar Encerramento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
