import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, AlertCircle, FileText, CalendarDays, Recycle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { differenceInDays, parseISO } from 'date-fns'
import { sustentabilidadeService } from '@/services/sustentabilidade'

export default function ResiduosLogistica() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [residuos, setResiduos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentResiduo, setCurrentResiduo] = useState<any>(null)

  const [formData, setFormData] = useState({
    descricao: '',
    tipo_residuo: 'comum',
    quantidade: '',
    unidade: 'kg',
    data_geracao: new Date().toISOString().split('T')[0],
    status_logistica_reversa: 'pendente',
    numero_mtr: '',
    numero_cdf: '',
    data_vencimento_cdf: '',
    data_devolucao: '',
  })

  const loadData = async () => {
    if (!user) return
    try {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single()
      if (profile?.empresa_id) {
        const { data } = await sustentabilidadeService.getResiduos(profile.empresa_id)
        if (data) setResiduos(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleOpenDialog = (residuo?: any) => {
    if (residuo) {
      setCurrentResiduo(residuo)
      setFormData({
        descricao: residuo.descricao || '',
        tipo_residuo: residuo.tipo_residuo || 'comum',
        quantidade: residuo.quantidade || '',
        unidade: residuo.unidade || 'kg',
        data_geracao: residuo.data_geracao || new Date().toISOString().split('T')[0],
        status_logistica_reversa: residuo.status_logistica_reversa || 'pendente',
        numero_mtr: residuo.numero_mtr || '',
        numero_cdf: residuo.numero_cdf || '',
        data_vencimento_cdf: residuo.data_vencimento_cdf || '',
        data_devolucao: residuo.data_devolucao || '',
      })
    } else {
      setCurrentResiduo(null)
      setFormData({
        descricao: '',
        tipo_residuo: 'comum',
        quantidade: '',
        unidade: 'kg',
        data_geracao: new Date().toISOString().split('T')[0],
        status_logistica_reversa: 'pendente',
        numero_mtr: '',
        numero_cdf: '',
        data_vencimento_cdf: '',
        data_devolucao: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single()
      if (!profile) return

      const payload = {
        ...formData,
        empresa_id: profile.empresa_id,
        quantidade: Number(formData.quantidade),
        numero_mtr: formData.numero_mtr || null,
        numero_cdf: formData.numero_cdf || null,
        data_vencimento_cdf: formData.data_vencimento_cdf || null,
        data_devolucao: formData.data_devolucao || null,
      }

      let res
      if (currentResiduo) {
        res = await sustentabilidadeService.updateResiduo(currentResiduo.id, payload)
      } else {
        res = await sustentabilidadeService.createResiduo(payload)
      }

      if (res.error) throw res.error

      toast({ title: 'Sucesso', description: 'Registro salvo com sucesso.' })
      setIsDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            Pendente
          </Badge>
        )
      case 'em_transito':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em Trânsito</Badge>
      case 'devolvido':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Devolvido</Badge>
      case 'comprovado':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Comprovado (CDF)</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const isVencendo = (dateStr: string) => {
    if (!dateStr) return false
    const days = differenceInDays(parseISO(dateStr), new Date())
    return days <= 15 && days >= 0
  }

  const isVencido = (dateStr: string) => {
    if (!dateStr) return false
    return differenceInDays(parseISO(dateStr), new Date()) < 0
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-emerald-600" />
            Logística Reversa de Resíduos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de descarte, MTR e CDF (Certificado de Destinação Final).
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Registrar Resíduo
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle>Histórico e Status</CardTitle>
          <CardDescription>
            Acompanhe a documentação para garantir conformidade (ex: GLOBALG.A.P).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando registros...</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Data Geração</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>MTR</TableHead>
                  <TableHead>CDF</TableHead>
                  <TableHead>Validade CDF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residuos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhum resíduo registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  residuos.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {r.data_geracao?.split('-').reverse().join('/')}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800">{r.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {r.tipo_residuo.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.quantidade}{' '}
                        <span className="text-xs text-muted-foreground">{r.unidade}</span>
                      </TableCell>
                      <TableCell>
                        {r.numero_mtr ? (
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                            {r.numero_mtr}
                          </span>
                        ) : r.tipo_residuo === 'perigoso' ||
                          r.tipo_residuo === 'embalagem_agrotoxico' ? (
                          <span className="text-red-500 flex items-center gap-1 text-xs font-semibold">
                            <AlertCircle className="h-3 w-3" /> Faltante
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {r.numero_cdf ? (
                          <span className="font-mono text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                            {r.numero_cdf}
                          </span>
                        ) : r.status_logistica_reversa === 'comprovado' ? (
                          <span className="text-red-500 flex items-center gap-1 text-xs font-semibold">
                            <AlertCircle className="h-3 w-3" /> Requer CDF
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {r.data_vencimento_cdf ? (
                          <span
                            className={`flex items-center gap-1.5 text-sm
                            ${isVencendo(r.data_vencimento_cdf) ? 'text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit' : ''}
                            ${isVencido(r.data_vencimento_cdf) ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full w-fit' : ''}
                          `}
                          >
                            {(isVencendo(r.data_vencimento_cdf) ||
                              isVencido(r.data_vencimento_cdf)) && (
                              <AlertCircle className="h-3.5 w-3.5" />
                            )}
                            {r.data_vencimento_cdf.split('-').reverse().join('/')}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(r.status_logistica_reversa)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(r)}
                          className="hover:bg-slate-100 text-slate-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Recycle className="h-5 w-5 text-emerald-600" />
              {currentResiduo ? 'Editar Resíduo e Logística' : 'Registrar Novo Resíduo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Descrição / Identificação</Label>
                <Input
                  required
                  placeholder="Ex: Óleo lubrificante usado"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Geração</Label>
                <Input
                  type="date"
                  required
                  value={formData.data_geracao}
                  onChange={(e) => setFormData({ ...formData, data_geracao: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Classificação</Label>
                <Select
                  value={formData.tipo_residuo}
                  onValueChange={(v) => setFormData({ ...formData, tipo_residuo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comum">Comum</SelectItem>
                    <SelectItem value="reciclavel">Reciclável</SelectItem>
                    <SelectItem value="perigoso">Perigoso (Classe I)</SelectItem>
                    <SelectItem value="embalagem_agrotoxico">Embalagem Agrotóxico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade de Medida</Label>
                <Select
                  value={formData.unidade}
                  onValueChange={(v) => setFormData({ ...formData, unidade: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                    <SelectItem value="L">Litros (L)</SelectItem>
                    <SelectItem value="unidade">Unidade(s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="space-y-2">
                <Label>Status Logística Reversa</Label>
                <Select
                  value={formData.status_logistica_reversa}
                  onValueChange={(v) => setFormData({ ...formData, status_logistica_reversa: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Aguardando Coleta</SelectItem>
                    <SelectItem value="em_transito">Em Trânsito</SelectItem>
                    <SelectItem value="devolvido">Entregue no Destino</SelectItem>
                    <SelectItem value="comprovado">Comprovado (com CDF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Devolução</Label>
                <Input
                  type="date"
                  value={formData.data_devolucao}
                  onChange={(e) => setFormData({ ...formData, data_devolucao: e.target.value })}
                  disabled={formData.status_logistica_reversa === 'pendente'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Número MTR{' '}
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  value={formData.numero_mtr}
                  onChange={(e) => setFormData({ ...formData, numero_mtr: e.target.value })}
                  placeholder="Manifesto..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Número CDF{' '}
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  value={formData.numero_cdf}
                  onChange={(e) => setFormData({ ...formData, numero_cdf: e.target.value })}
                  placeholder="Certificado..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Validade CDF{' '}
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  type="date"
                  value={formData.data_vencimento_cdf}
                  onChange={(e) =>
                    setFormData({ ...formData, data_vencimento_cdf: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Salvar Registro
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
