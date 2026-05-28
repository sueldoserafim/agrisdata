import { useEffect, useState } from 'react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { ModuleHelp } from '@/components/ModuleHelp'

export default function RHFolha() {
  const { empresa } = useEmpresa()
  const [data, setData] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchDados = async () => {
    if (!empresa) return
    const { data: fl, error } = await supabase
      .from('rh_folha_pagamento')
      .select('*, funcionario:funcionarios(nome)')
      .eq('empresa_id', empresa.id)
      .order('mes_referencia', { ascending: false })
    if (!error && fl) setData(fl)

    const { data: f } = await supabase
      .from('funcionarios')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
    if (f) setFuncionarios(f)
  }

  useEffect(() => {
    fetchDados()
  }, [empresa])

  const calcularImpostos = (salarioBruto: number) => {
    // Calculo Simplificado BR
    let inss = 0
    if (salarioBruto <= 1412) inss = salarioBruto * 0.075
    else if (salarioBruto <= 2666.68) inss = salarioBruto * 0.09
    else if (salarioBruto <= 4000.03) inss = salarioBruto * 0.12
    else inss = salarioBruto * 0.14

    let irrf = 0
    let baseIR = salarioBruto - inss
    if (baseIR > 2259.2 && baseIR <= 2826.65) irrf = baseIR * 0.075 - 169.44
    else if (baseIR > 2826.65 && baseIR <= 3751.05) irrf = baseIR * 0.15 - 381.44
    else if (baseIR > 3751.05) irrf = baseIR * 0.225 - 662.77
    if (irrf < 0) irrf = 0

    let fgts = salarioBruto * 0.08
    return {
      inss: Number(inss.toFixed(2)),
      irrf: Number(irrf.toFixed(2)),
      fgts: Number(fgts.toFixed(2)),
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!empresa) return
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const salario_base = Number(fd.get('salario_base'))
    const proventos = Number(fd.get('proventos')) || 0
    const descontos = Number(fd.get('descontos')) || 0
    const salarioBruto = salario_base + proventos

    if (salario_base <= 0) {
      toast.error('O salário base deve ser > 0')
      setLoading(false)
      return
    }

    const { inss, irrf, fgts } = calcularImpostos(salarioBruto)
    const liquido = salarioBruto - descontos - inss - irrf

    try {
      const { error } = await supabase.from('rh_folha_pagamento').insert({
        empresa_id: empresa.id,
        funcionario_id: fd.get('funcionario_id'),
        mes_referencia: fd.get('mes_referencia') + '-01',
        salario_base,
        proventos,
        descontos,
        inss,
        irrf,
        fgts,
        liquido,
      })
      if (error) throw error
      toast.success('Folha gerada com sucesso!')
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
          <h1 className="text-3xl font-bold tracking-tight">Folha de Pagamento</h1>
          <p className="text-muted-foreground">Cálculo automatizado de holerites e impostos.</p>
        </div>
        <div className="flex items-center gap-4">
          <ModuleHelp
            title="Folha de Pagamento"
            description="Cálculos automáticos de retenções (INSS, IRRF, FGTS)."
            rules={[
              'O INSS e IRRF são calculados na base simplificada vigente (simulação).',
              'Os valores financeiros devem ser estritamente > 0.',
              "Status 'Fechado' impede edições da folha.",
            ]}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Nova Folha (Func.)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Holerite</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Funcionário</Label>
                  <Select name="funcionario_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mês Referência (YYYY-MM)</Label>
                  <Input type="month" name="mes_referencia" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salário Base (R$)</Label>
                    <Input type="number" step="0.01" min="1" name="salario_base" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Proventos Extras (R$)</Label>
                    <Input type="number" step="0.01" name="proventos" defaultValue={0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Outros Descontos (R$)</Label>
                    <Input type="number" step="0.01" name="descontos" defaultValue={0} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Gerar e Calcular Impostos
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês Ref.</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Salário Bruto</TableHead>
                <TableHead>INSS / IRRF</TableHead>
                <TableHead>Líquido</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.mes_referencia).toLocaleDateString(undefined, {
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{item.funcionario?.nome}</TableCell>
                  <TableCell>
                    R${' '}
                    {(item.salario_base + item.proventos).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-red-500">
                    -R$ {item.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / -R${' '}
                    {item.irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    R$ {item.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'fechado' ? 'secondary' : 'default'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma folha gerada.
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
