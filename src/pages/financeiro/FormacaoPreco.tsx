import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

export default function FormacaoPreco() {
  const [formData, setFormData] = useState({
    custosProducao: 0,
    custosLogistica: 0,
    quantidadeKg: 0,
    margemDesejada: 0,
  })

  const [resultado, setResultado] = useState<{
    precoMinimo: number
    precoSugerido: number
    lucroEstimado: number
  } | null>(null)

  const handleCalculate = () => {
    const { custosProducao, custosLogistica, quantidadeKg, margemDesejada } = formData

    if (quantidadeKg <= 0) return

    const totalCustos = Number(custosProducao) + Number(custosLogistica)
    const custoPorKg = totalCustos / Number(quantidadeKg)

    const margemDecimal = Number(margemDesejada) / 100
    // Preço = Custo / (1 - Margem)
    const precoSugerido = margemDecimal < 1 ? custoPorKg / (1 - margemDecimal) : custoPorKg
    const lucro = (precoSugerido - custoPorKg) * Number(quantidadeKg)

    setResultado({
      precoMinimo: custoPorKg,
      precoSugerido,
      lucroEstimado: lucro,
    })
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulador de Formação de Preço</h1>
        <p className="text-muted-foreground">
          Calcule o preço mínimo de exportação com base em custos e margem desejada.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados de Entrada</CardTitle>
            <CardDescription>Insira os custos totais e a quantidade prevista.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Custos de Produção (BRL)</Label>
              <Input
                type="number"
                value={formData.custosProducao || ''}
                onChange={(e) =>
                  setFormData({ ...formData, custosProducao: Number(e.target.value) })
                }
                placeholder="Ex: 50000"
              />
            </div>
            <div className="space-y-2">
              <Label>Custos Logísticos/Despesas (BRL)</Label>
              <Input
                type="number"
                value={formData.custosLogistica || ''}
                onChange={(e) =>
                  setFormData({ ...formData, custosLogistica: Number(e.target.value) })
                }
                placeholder="Ex: 15000"
              />
            </div>
            <div className="space-y-2">
              <Label>Quantidade a Exportar (KG)</Label>
              <Input
                type="number"
                value={formData.quantidadeKg || ''}
                onChange={(e) => setFormData({ ...formData, quantidadeKg: Number(e.target.value) })}
                placeholder="Ex: 24000"
              />
            </div>
            <div className="space-y-2">
              <Label>Margem de Lucro Desejada (%)</Label>
              <Input
                type="number"
                value={formData.margemDesejada || ''}
                onChange={(e) =>
                  setFormData({ ...formData, margemDesejada: Number(e.target.value) })
                }
                placeholder="Ex: 20"
              />
            </div>
            <Button className="w-full mt-2" onClick={handleCalculate}>
              <Calculator className="w-4 h-4 mr-2" /> Calcular Preço Sugerido
            </Button>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Resultado da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Custo (Breakeven) por KG</p>
                <p className="text-2xl font-bold">{formatCurrency(resultado.precoMinimo)}</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm font-medium text-primary">Preço de Venda Sugerido (por KG)</p>
                <p className="text-4xl font-extrabold text-primary">
                  {formatCurrency(resultado.precoSugerido)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lucro Total Estimado (BRL)</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(resultado.lucroEstimado)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
