import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export default function FolhaPagamento() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [form, setForm] = useState({ funcId: '', mes: '', salario: 0, proventos: 0, descontos: 0 })
  const [res, setRes] = useState<any>(null)

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('funcionarios')
      .select('*')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .then(({ data }) => {
        if (data) setFuncionarios(data)
      })
  }, [empresa])

  const calculateTaxes = () => {
    const base = Number(form.salario) + Number(form.proventos)
    const inss = base * 0.075 // Simplificado
    const irrf = base > 2000 ? base * 0.075 : 0
    const fgts = base * 0.08
    const liq = base - inss - irrf - Number(form.descontos)
    setRes({ base, inss, irrf, fgts, liq })
  }

  const handleSave = async () => {
    if (!form.funcId || !form.mes || !res)
      return toast({ title: 'Preencha tudo e calcule os impostos' })
    const { error } = await supabase.from('rh_folha_pagamento').insert({
      empresa_id: empresa!.id,
      funcionario_id: form.funcId,
      mes_referencia: `${form.mes}-01`,
      salario_base: form.salario,
      proventos: form.proventos,
      descontos: form.descontos,
      inss: res.inss,
      irrf: res.irrf,
      fgts: res.fgts,
      liquido: res.liq,
    })
    if (error) toast({ title: 'Erro', variant: 'destructive' })
    else toast({ title: 'Holerite salvo!' })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Folha de Pagamento</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gerar Holerite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Funcionário</label>
              <Select value={form.funcId} onValueChange={(v) => setForm({ ...form, funcId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
            <div>
              <label>Mês Referência</label>
              <Input
                type="month"
                value={form.mes}
                onChange={(e) => setForm({ ...form, mes: e.target.value })}
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                Salário Base
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>Usado para base de INSS/FGTS</TooltipContent>
                </Tooltip>
              </label>
              <Input
                type="number"
                value={form.salario}
                onChange={(e) => setForm({ ...form, salario: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Proventos Extras</label>
              <Input
                type="number"
                value={form.proventos}
                onChange={(e) => setForm({ ...form, proventos: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Descontos Adicionais</label>
              <Input
                type="number"
                value={form.descontos}
                onChange={(e) => setForm({ ...form, descontos: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={calculateTaxes} variant="secondary">
            Calcular Impostos
          </Button>
        </CardContent>
      </Card>

      {res && (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Resumo do Holerite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                Base Cálculo: <strong>R$ {res.base.toFixed(2)}</strong>
              </div>
              <div>
                FGTS (8%): <strong>R$ {res.fgts.toFixed(2)}</strong>
              </div>
              <div className="text-destructive">
                INSS: <strong>- R$ {res.inss.toFixed(2)}</strong>
              </div>
              <div className="text-destructive">
                IRRF: <strong>- R$ {res.irrf.toFixed(2)}</strong>
              </div>
              <div className="col-span-2 text-xl mt-4 border-t pt-4">
                Líquido a Pagar: <strong className="text-green-600">R$ {res.liq.toFixed(2)}</strong>
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={handleSave}>
              Salvar e Fechar Folha
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
