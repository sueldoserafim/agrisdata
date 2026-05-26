import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Leaf, AlertTriangle, Layers } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PerdaEstufaModal from './PerdaEstufaModal'

export default function LotesMudasDashboard() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [lotes, setLotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [perdaModalOpen, setPerdaModalOpen] = useState(false)
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null)

  useEffect(() => {
    if (empresa) loadLotes()
  }, [empresa])

  const loadLotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('lotes_mudas')
      .select('*, estufas(nome), culturas(nome), cultivares(nome)')
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Erro ao carregar lotes', description: error.message, variant: 'destructive' })
    } else {
      setLotes(data || [])
    }
    setLoading(false)
  }

  const handleOpenPerda = (id: string) => {
    setSelectedLoteId(id)
    setPerdaModalOpen(true)
  }

  const handlePerdaSaved = () => {
    loadLotes()
  }

  const filtered = lotes.filter(
    (l) =>
      l.nome_lote.toLowerCase().includes(search.toLowerCase()) ||
      l.estufas?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      l.culturas?.nome?.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      germinando: 'bg-amber-500',
      em_desenvolvimento: 'bg-blue-500',
      pronto: 'bg-emerald-500',
      transplantado: 'bg-gray-500',
      descartado: 'bg-red-500',
    }
    const labels: Record<string, string> = {
      germinando: 'Germinando',
      em_desenvolvimento: 'Desenvolvimento',
      pronto: 'Pronto p/ Campo',
      transplantado: 'Transplantado',
      descartado: 'Descartado',
    }
    return (
      <Badge className={`${colors[status] || 'bg-gray-500'}`}>{labels[status] || status}</Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lotes de Mudas</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe a germinação e desenvolvimento das mudas
          </p>
        </div>
        <Button onClick={() => navigate('/app/lotes-mudas/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lote
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mudas Vivas</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lotes
                .reduce((acc, curr) => acc + (curr.quantidade_viva || 0), 0)
                .toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Prontos</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lotes.filter((l) => l.status === 'pronto').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Lotes Ativos</CardTitle>
            <Input
              placeholder="Buscar lote..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nenhum lote encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Estufa</TableHead>
                  <TableHead>Cultura/Cultivar</TableHead>
                  <TableHead>Semeadura</TableHead>
                  <TableHead className="text-right">Mudas (Vivas/Total)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium">{lote.nome_lote}</TableCell>
                    <TableCell>{lote.estufas?.nome || '-'}</TableCell>
                    <TableCell>
                      {lote.culturas?.nome}{' '}
                      {lote.cultivares?.nome ? `(${lote.cultivares.nome})` : ''}
                    </TableCell>
                    <TableCell>
                      {lote.data_semeadura
                        ? new Date(lote.data_semeadura).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          lote.quantidade_viva < lote.quantidade_mudas
                            ? 'text-red-500 font-medium'
                            : ''
                        }
                      >
                        {lote.quantidade_viva}
                      </span>
                      <span className="text-muted-foreground"> / {lote.quantidade_mudas}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lote.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {['germinando', 'em_desenvolvimento', 'pronto'].includes(lote.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPerda(lote.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" /> Baixa
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/app/lotes-mudas/${lote.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedLoteId && (
        <PerdaEstufaModal
          open={perdaModalOpen}
          onOpenChange={setPerdaModalOpen}
          loteId={selectedLoteId}
          onSaved={handlePerdaSaved}
        />
      )}
    </div>
  )
}
