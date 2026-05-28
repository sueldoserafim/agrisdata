import { useEffect, useState } from 'react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, QrCode } from 'lucide-react'

export default function PatrimonioBens() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: b } = await supabase
      .from('patrimonio_bens')
      .select('*')
      .eq('empresa_id', empresa.id)
      .order('created_at', { ascending: false })
    if (b) setData(b)
  }

  useEffect(() => {
    fetchDados()
  }, [empresa])

  const calcularBookValue = (
    valorOriginal: number,
    vidaUtilMeses: number,
    dataAquisicao: string,
  ) => {
    if (!vidaUtilMeses || vidaUtilMeses <= 0) return valorOriginal
    const dateAq = new Date(dataAquisicao)
    const today = new Date()
    let mesesUsados =
      (today.getFullYear() - dateAq.getFullYear()) * 12 + (today.getMonth() - dateAq.getMonth())
    if (mesesUsados < 0) mesesUsados = 0
    if (mesesUsados > vidaUtilMeses) mesesUsados = vidaUtilMeses

    const depreciaoMensal = valorOriginal / vidaUtilMeses
    const bookValue = valorOriginal - depreciaoMensal * mesesUsados
    return bookValue < 0 ? 0 : bookValue
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!empresa) return
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      const { error } = await supabase.from('patrimonio_bens').insert({
        empresa_id: empresa.id,
        nome: fd.get('nome'),
        codigo_qr: fd.get('codigo_qr') || null,
        valor_aquisicao: Number(fd.get('valor_aquisicao')),
        vida_util_meses: Number(fd.get('vida_util_meses')),
        data_aquisicao: fd.get('data_aquisicao'),
      })
      if (error) throw error
      toast.success('Ativo registrado com sucesso!')
      setOpen(false)
      fetchDados()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ativos Imobilizados</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Cadastrar Bem</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Ativo</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome/Descrição do Ativo</Label>
                <Input name="nome" required placeholder="Trator John Deere 123" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Valor Aquisição</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>O valor de compra do equipamento.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input type="number" step="0.01" min="0" name="valor_aquisicao" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Vida Útil (Meses)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Este valor é usado para calcular a depreciação linear mês a mês.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input type="number" min="1" name="vida_util_meses" required defaultValue={60} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Aquisição</Label>
                  <Input type="date" name="data_aquisicao" required />
                </div>
                <div className="space-y-2">
                  <Label>Código (Etiqueta/QR)</Label>
                  <Input name="codigo_qr" placeholder="PAT-001" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Salvar Ativo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cód. QR</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Aquisição</TableHead>
                <TableHead>Valor Original</TableHead>
                <TableHead>Valor Contábil Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const bookValue = calcularBookValue(
                  item.valor_aquisicao,
                  item.vida_util_meses,
                  item.data_aquisicao,
                )
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" /> {item.codigo_qr || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{new Date(item.data_aquisicao).toLocaleDateString()}</TableCell>
                    <TableCell>
                      R${' '}
                      {Number(item.valor_aquisicao).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={bookValue <= 0 ? 'text-red-500' : 'text-green-600 font-bold'}
                    >
                      R$ {bookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum ativo cadastrado.
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
