import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PackagePlus, Printer, Box } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function RomaneioDetail() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [romaneio, setRomaneio] = useState<any>(null)
  const [pallets, setPallets] = useState<any[]>([])

  const [availablePallets, setAvailablePallets] = useState<any[]>([])
  const [selectedPallets, setSelectedPallets] = useState<string[]>([])
  const [openModal, setOpenModal] = useState(false)

  const loadData = async () => {
    const { data: rom } = await supabase
      .from('romaneios_venda')
      .select('*, cliente:clientes(nome)')
      .eq('id', id)
      .single()
    setRomaneio(rom)

    const { data: pData } = await supabase
      .from('pallets')
      .select('*, produto:produtos(nome)')
      .eq('romaneio_id', id)
    setPallets(pData || [])
  }

  const loadAvailablePallets = async () => {
    if (!empresa?.id) return
    const { data } = await supabase
      .from('pallets')
      .select('*, produto:produtos(nome)')
      .eq('empresa_id', empresa.id)
      .eq('status', 'em_camara')
      .is('romaneio_id', null)
    setAvailablePallets(data || [])
  }

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const handleOpenModal = () => {
    setSelectedPallets([])
    loadAvailablePallets()
    setOpenModal(true)
  }

  const toggleSelect = (pid: string) => {
    setSelectedPallets((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid],
    )
  }

  const addPallets = async () => {
    if (selectedPallets.length === 0) return
    const { error } = await supabase
      .from('pallets')
      .update({ romaneio_id: id, status: 'reservado' })
      .in('id', selectedPallets)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Pallets adicionados ao romaneio.' })
      setOpenModal(false)
      loadData()
    }
  }

  if (!romaneio) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Romaneio {romaneio.numero_romaneio}</h1>
          <p className="text-muted-foreground">Cliente: {romaneio.cliente?.nome || 'Avulso'}</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Imprimir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Pallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{romaneio.total_pallets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Peso Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{romaneio.peso_total_kg} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className="capitalize text-lg"
              variant={romaneio.status === 'carregado' ? 'default' : 'secondary'}
            >
              {romaneio.status?.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Pallets Vinculados</CardTitle>
            <CardDescription>Carga separada para este romaneio</CardDescription>
          </div>
          {romaneio.status !== 'carregado' && (
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenModal}>
                  <PackagePlus className="w-4 h-4 mr-2" /> Adicionar Pallet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Selecionar Pallets Disponíveis (Em Câmara)</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Peso Líq (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availablePallets.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPallets.includes(p.id)}
                              onCheckedChange={() => toggleSelect(p.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono">{p.codigo_pallet}</TableCell>
                          <TableCell>{p.produto?.nome}</TableCell>
                          <TableCell>{p.peso_liquido_kg}</TableCell>
                        </TableRow>
                      ))}
                      {availablePallets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            Nenhum pallet disponível na câmara.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  onClick={addPallets}
                  className="w-full mt-4"
                  disabled={selectedPallets.length === 0}
                >
                  Adicionar {selectedPallets.length} Pallets
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Peso Líq (kg)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pallets.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-medium flex items-center">
                    <Box className="w-4 h-4 mr-2 text-muted-foreground" />
                    {p.codigo_pallet}
                  </TableCell>
                  <TableCell>{p.produto?.nome}</TableCell>
                  <TableCell>{p.peso_liquido_kg}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {pallets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum pallet adicionado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
