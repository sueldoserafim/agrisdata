import { useEffect, useState } from 'react'
import { Printer, RefreshCw } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { useAuth } from '@/hooks/use-auth'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HelpTooltip } from '@/components/HelpTooltip'

export default function EtiquetasList() {
  const { empresa } = useEmpresa()
  const { user } = useAuth()
  const { toast } = useToast()
  const [pallets, setPallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewPallet, setPreviewPallet] = useState<any>(null)

  const loadData = async () => {
    if (!empresa?.id) return
    setLoading(true)
    const { data } = await supabase
      .from('pallets')
      .select(`
        id, codigo_pallet, peso_liquido_kg, calibre, data_paletizacao, status,
        produto:produtos(nome),
        romaneio:romaneios_venda(id, status, numero_romaneio)
      `)
      .eq('empresa_id', empresa.id)
      .in('romaneio.status', ['em_aberto', 'parcial'])
      .not('romaneio_id', 'is', null)

    const validPallets = (data || []).filter((p) => p.romaneio !== null)
    setPallets(validPallets)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [empresa?.id])

  const generateZPL = (pallet: any) => {
    return `^XA
^FO50,50^A0N,50,50^FDProduto: ${pallet.produto?.nome || 'N/A'}^FS
^FO50,120^A0N,40,40^FDPallet: ${pallet.codigo_pallet}^FS
^FO50,180^A0N,40,40^FDCalibre: ${pallet.calibre || '-'}^FS
^FO50,240^A0N,40,40^FDPeso: ${pallet.peso_liquido_kg || 0} kg^FS
^FO50,300^A0N,40,40^FDData: ${new Date(pallet.data_paletizacao).toLocaleDateString()}^FS
^FO50,380^BCN,100,Y,N,N^FD${pallet.codigo_pallet}^FS
^XZ`
  }

  const printLabel = async () => {
    if (!previewPallet || !empresa?.id || !user?.id) return
    const zpl = generateZPL(previewPallet)

    const { error } = await supabase.from('etiquetas_impressas').insert({
      empresa_id: empresa.id,
      pallet_id: previewPallet.id,
      numero_etiqueta: previewPallet.codigo_pallet,
      romaneio_id: previewPallet.romaneio?.id,
      impresso_por: user.id,
      etiqueta_zpl: zpl,
      data_impressao: new Date().toISOString(),
    })

    if (error) {
      toast({ title: 'Erro ao imprimir', description: error.message, variant: 'destructive' })
    } else {
      await supabase.from('pallets').update({ etiqueta_impressa: true }).eq('id', previewPallet.id)
      toast({ title: 'Enviado para Impressora', description: 'ZPL despachado com sucesso.' })
      setPreviewPallet(null)
      loadData()
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Etiquetas ZPL</h1>
          <p className="text-muted-foreground flex items-center">
            Geração de etiquetas térmicas de pallets.
            <HelpTooltip text="Apenas pallets vinculados a um Romaneio de Venda Aberto ou Parcial podem gerar etiquetas ZPL." />
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pallets Prontos para Emissão</CardTitle>
          <CardDescription>Aguardando impressão de código de barras para despacho.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código Pallet</TableHead>
                <TableHead>Romaneio</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pallets.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono">{p.codigo_pallet}</TableCell>
                  <TableCell>{p.romaneio?.numero_romaneio}</TableCell>
                  <TableCell>{p.produto?.nome}</TableCell>
                  <TableCell>{p.peso_liquido_kg} kg</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setPreviewPallet(p)}>
                      <Printer className="w-4 h-4 mr-2" /> Pré-visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pallets.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum pallet elegível para impressão. Vincule um pallet a um romaneio em
                    aberto.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {previewPallet && (
        <Dialog
          open={!!previewPallet}
          onOpenChange={(open: boolean) => !open && setPreviewPallet(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Preview Etiqueta: {previewPallet.codigo_pallet}</DialogTitle>
            </DialogHeader>
            <div className="bg-zinc-100 p-6 rounded-md font-mono text-sm whitespace-pre-wrap text-zinc-800 my-4 border">
              {generateZPL(previewPallet)}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPreviewPallet(null)}>
                Cancelar
              </Button>
              <Button onClick={printLabel}>Confirmar Impressão</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
