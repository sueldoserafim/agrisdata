import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'

export default function AuditoriaSafrasList() {
  const { empresa } = useEmpresa()
  const [safras, setSafras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [farmFilter, setFarmFilter] = useState('all')
  const [fazendas, setFazendas] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      if (!empresa?.id) return
      setLoading(true)

      const [safrasRes, fazendasRes] = await Promise.all([
        supabase
          .from('safras')
          .select(`
            *,
            cultivares(nome, culturas(nome)),
            fazendas(nome),
            usuarios!safras_responsavel_encerramento_id_fkey(nome, email),
            historico_produtividade_talhao(produtividade_kg_ha),
            colheita_registros(producao_liquida_ton)
          `)
          .eq('empresa_id', empresa.id)
          .eq('status', 'encerrada')
          .is('deleted_at', null)
          .order('data_colheita_real', { ascending: false }),
        supabase
          .from('fazendas')
          .select('id, nome')
          .eq('empresa_id', empresa.id)
          .is('deleted_at', null),
      ])

      if (safrasRes.data) setSafras(safrasRes.data)
      if (fazendasRes.data) setFazendas(fazendasRes.data)

      setLoading(false)
    }
    loadData()
  }, [empresa?.id])

  const filteredSafras = useMemo(() => {
    return safras.filter((safra) => {
      const matchSearch =
        (safra.nome_safra || safra.codigo_safra || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (safra.cultivares?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (safra.cultivares?.culturas?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchFarm = farmFilter === 'all' || safra.fazenda_id === farmFilter

      return matchSearch && matchFarm
    })
  }, [safras, searchTerm, farmFilter])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const calcTotalProduction = (colheitas: any[]) => {
    if (!colheitas) return 0
    return colheitas.reduce((acc, curr) => acc + (curr.producao_liquida_ton || 0), 0)
  }

  const calcAvgProductivity = (historico: any[]) => {
    if (!historico || historico.length === 0) return 0
    const sum = historico.reduce((acc, curr) => acc + (curr.produtividade_kg_ha || 0), 0)
    return sum / historico.length
  }

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria e Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhamento consolidado de safras encerradas e geração de relatórios finais.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar safra, cultura ou cultivar..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={farmFilter} onValueChange={setFarmFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Todas as Fazendas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Fazendas</SelectItem>
            {fazendas.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Safra</TableHead>
              <TableHead>Fazenda</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Responsável (Encerramento)</TableHead>
              <TableHead className="text-right">Produção Total (ton)</TableHead>
              <TableHead className="text-right">Produtividade Média</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredSafras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Nenhuma safra encerrada encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredSafras.map((safra) => {
                const totalProd = calcTotalProduction(safra.colheita_registros)
                const avgProd = calcAvgProductivity(safra.historico_produtividade_talhao)

                return (
                  <TableRow key={safra.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="font-medium">
                        {safra.nome_safra || safra.codigo_safra || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {safra.cultivares?.culturas?.nome} - {safra.cultivares?.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {safra.fazendas?.nome || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>Plantio: {formatDate(safra.data_plantio)}</span>
                        <span>Encerramento: {formatDate(safra.data_colheita_real)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {safra.usuarios?.nome || safra.usuarios?.email || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {totalProd.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {avgProd > 0
                        ? `${avgProd.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} kg/ha`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                      >
                        <Link to={`/app/auditoria-safras/${safra.id}/relatorio`}>
                          <FileText className="h-4 w-4" />
                          Gerar Relatório Final
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
