import { useEffect, useState } from 'react'
import { Box, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useEmpresa } from '@/hooks/use-empresa'
import { cooperativaService } from '@/services/cooperativa'
import { toast } from 'sonner'

export default function VincularPallets() {
  const { empresa } = useEmpresa()
  const [pallets, setPallets] = useState<any[]>([])
  const [cooperados, setCooperados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [produtorId, setProdutorId] = useState<string>('')

  useEffect(() => {
    if (empresa) {
      cooperativaService.getCooperados(empresa.id).then(setCooperados)
      loadData()
    }
  }, [empresa])

  async function loadData() {
    try {
      setLoading(true)
      const data = await cooperativaService.getPalletsSemProdutor(empresa!.id)
      setPallets(data || [])
      setSelectedIds(new Set())
    } catch (error: any) {
      toast.error('Erro ao carregar pallets')
    } finally {
      setLoading(false)
    }
  }

  const toggleAll = () => {
    if (selectedIds.size === pallets.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pallets.map((p) => p.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleVincular = async () => {
    if (!produtorId) return toast.error('Selecione um cooperado')
    if (selectedIds.size === 0) return toast.error('Selecione ao menos um pallet')

    try {
      setLoading(true)
      await cooperativaService.atribuirPallets(Array.from(selectedIds), produtorId)
      toast.success(`${selectedIds.size} pallets vinculados com sucesso`)
      loadData()
      setProdutorId('')
    } catch (err) {
      toast.error('Erro ao vincular pallets')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vincular Produção a Cooperado</h1>
          <p className="text-muted-foreground mt-2">
            Relacione pallets gerados ao seu respectivo produtor para o rateio correto.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={produtorId} onValueChange={setProdutorId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o Cooperado" />
            </SelectTrigger>
            <SelectContent>
              {cooperados.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleVincular}
            disabled={loading || !produtorId || selectedIds.size === 0}
          >
            <Link2 className="w-4 h-4 mr-2" /> Vincular Selecionados
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.size === pallets.length && pallets.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Código Pallet</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Peso Líquido (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum pallet sem produtor encontrado (últimos 100).
                </TableCell>
              </TableRow>
            ) : (
              pallets.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(p.id)}
                      onCheckedChange={() => toggleOne(p.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Box className="w-4 h-4 text-muted-foreground" />
                    {p.codigo_pallet}
                  </TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {Number(p.peso_liquido_kg).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
