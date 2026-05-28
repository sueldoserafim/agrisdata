import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, Info, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function FormacaoPreco() {
  const [formData, setFormData] = useState({
    custosProducao: 0,
    custosLogistica: 0,
    quantidadeKg: 0,
    margemDesejada: 0,
  })

  const { custosProducao, custosLogistica, quantidadeKg, margemDesejada } = formData

  // Dynamic calculations in real-time
  const totalCustos = Number(custosProducao) + Number(custosLogistica)
  const custoPorKg = quantidadeKg > 0 ? totalCustos / Number(quantidadeKg) : 0
  const margemDecimal = Number(margemDesejada) / 100

  // Markup divisor formula
  const precoSugerido =
    margemDecimal > 0 && margemDecimal < 1 ? custoPorKg / (1 - margemDecimal) : custoPorKg

  const lucro = (precoSugerido - custoPorKg) * Number(quantidadeKg)

  // Assistive logic to show margin variation impact
  const precoAumentado =
    margemDecimal + 0.05 < 1 ? custoPorKg / (1 - (margemDecimal + 0.05)) : custoPorKg
  const ganhoExtraKg = precoAumentado - precoSugerido

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulador de Formação de Preço</h1>
          <p className="text-muted-foreground mt-1">
            Calcule o preço mínimo de exportação com base em custos e margem desejada.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <HelpCircle className="w-4 h-4" /> Guia de Metodologia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Metodologia de Cálculo (Markup)</DialogTitle>
              <DialogDescription className="pt-4 space-y-4 text-base text-foreground/90">
                <p>
                  O simulador utiliza a fórmula de <strong>Markup Divisor</strong> para garantir que
                  a margem de lucro seja aplicada sobre o preço final de venda, e não apenas
                  adicionada ao custo.
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm text-center border">
                  Preço Mínimo = Custo por KG / (1 - Margem %)
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Custo por KG:</strong> Total de custos (produção + logística) dividido
                    pela quantidade total (volume) exportado.
                  </li>
                  <li>
                    <strong>Margem %:</strong> A porcentagem de lucro líquido que você quer garantir
                    contida no preço final.
                  </li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Dados de Entrada</CardTitle>
            <CardDescription>Insira os custos totais e a quantidade prevista.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Custos de Produção (BRL)</Label>
                <Tooltip>
                  <TooltipTrigger type="button" tabIndex={-1}>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="w-[220px]">
                      Custos diretos relacionados ao campo: insumos, mão de obra, maquinário,
                      embalagens, etc.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                min={0}
                value={custosProducao || ''}
                onChange={(e) =>
                  setFormData({ ...formData, custosProducao: Number(e.target.value) })
                }
                placeholder="Ex: 50000"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Custos Logísticos/Despesas (BRL)</Label>
                <Tooltip>
                  <TooltipTrigger type="button" tabIndex={-1}>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="w-[220px]">
                      Frete marítimo/terrestre, taxas portuárias (THC, B/L), serviços de despachante
                      e certificados.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                min={0}
                value={custosLogistica || ''}
                onChange={(e) =>
                  setFormData({ ...formData, custosLogistica: Number(e.target.value) })
                }
                placeholder="Ex: 15000"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Quantidade a Exportar (KG)</Label>
                <Tooltip>
                  <TooltipTrigger type="button" tabIndex={-1}>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="w-[220px]">
                      Volume total estimado para esta remessa (peso líquido total de venda em
                      quilogramas).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                min={0}
                value={quantidadeKg || ''}
                onChange={(e) => setFormData({ ...formData, quantidadeKg: Number(e.target.value) })}
                placeholder="Ex: 24000"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Margem de Lucro Desejada (%)</Label>
                <Tooltip>
                  <TooltipTrigger type="button" tabIndex={-1}>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="w-[220px]">
                      Percentual de lucro líquido final (markup). Ex: 20 significa que 20% do preço
                      de venda será lucro.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                min={0}
                max={99}
                value={margemDesejada || ''}
                onChange={(e) =>
                  setFormData({ ...formData, margemDesejada: Number(e.target.value) })
                }
                placeholder="Ex: 20"
                className="font-medium"
              />
            </div>

            {quantidadeKg > 0 && margemDecimal > 0 && margemDecimal < 1 && (
              <div className="bg-primary/10 text-primary p-3 rounded-md text-sm border border-primary/20 flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  <strong>Orientação em tempo real:</strong> Aumentar a margem em +5% adicionaria{' '}
                  <strong>{formatCurrency(ganhoExtraKg)}</strong> ao preço sugerido por KG.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-6 opacity-5 pointer-events-none">
            <Calculator className="w-64 h-64" />
          </div>
          <CardHeader>
            <CardTitle>Cenário Projetado</CardTitle>
            <CardDescription>Projeção imediata de precificação unitária.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Custo Base (Breakeven) por KG
              </p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(custoPorKg)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Preço mínimo para empatar os custos totais (lucro R$ 0,00).
              </p>
            </div>

            <div className="p-6 bg-background rounded-xl border shadow-sm">
              <p className="text-sm font-semibold text-primary mb-1">
                Preço Mínimo de Venda (por KG)
              </p>
              <p className="text-5xl font-extrabold text-primary tracking-tighter">
                {formatCurrency(precoSugerido)}
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded shadow-sm">
                  {margemDesejada}% Margem
                </span>
                <span className="text-xs text-muted-foreground">inclusa na composição final</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Lucro Líquido Global Estimado
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                {formatCurrency(lucro)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Volume ({quantidadeKg} kg) × Ganho por KG (
                {formatCurrency(precoSugerido - custoPorKg)}).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
