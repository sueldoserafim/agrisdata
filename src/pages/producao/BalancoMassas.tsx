import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Scale, CheckCircle2, AlertTriangle, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { toast } from 'sonner'

export default function BalancoMassas() {
  const { empresa } = useEmpresa()
  const [safras, setSafras] = useState<any[]>([])
  const [safraSelecionada, setSafraSelecionada] = useState<string>('')
  const [balanco, setBalanco] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editáveis
  const [doacao, setDoacao] = useState(0)
  const [descarteQualidade, setDescarteQualidade] = useState(0)
  const [descarteExcesso, setDescarteExcesso] = useState(0)
  const [perdaPacking, setPerdaPacking] = useState(0)

  useEffect(() => {
    if (empresa?.id) loadSafras()
  }, [empresa?.id])

  useEffect(() => {
    if (safraSelecionada) loadBalanco()
  }, [safraSelecionada])

  const loadSafras = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('safras')
      .select('id, nome_safra, codigo_safra, status')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (data) {
      setSafras(data)
      if (data.length > 0) setSafraSelecionada(data[0].id)
    }
    setLoading(false)
  }

  const loadBalanco = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('balanco_massas')
      .select('*')
      .eq('safra_id', safraSelecionada)
      .maybeSingle()

    if (data) {
      setBalanco(data)
      setDoacao(data.doacao_kg || 0)
      setDescarteQualidade(data.descarte_qualidade_kg || 0)
      setDescarteExcesso(data.descarte_excesso_kg || 0)
      setPerdaPacking(data.perda_packing_kg || 0)
    } else {
      setBalanco(null)
      setDoacao(0)
      setDescarteQualidade(0)
      setDescarteExcesso(0)
      setPerdaPacking(0)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!safraSelecionada) return
    setSaving(true)
    try {
      if (balanco?.id) {
        await supabase
          .from('balanco_massas')
          .update({
            doacao_kg: doacao,
            descarte_qualidade_kg: descarteQualidade,
            descarte_excesso_kg: descarteExcesso,
            perda_packing_kg: perdaPacking,
          })
          .eq('id', balanco.id)
      } else {
        await supabase.from('balanco_massas').insert({
          empresa_id: empresa?.id,
          safra_id: safraSelecionada,
          doacao_kg: doacao,
          descarte_qualidade_kg: descarteQualidade,
          descarte_excesso_kg: descarteExcesso,
          perda_packing_kg: perdaPacking,
          quantidade_colhida_kg: 0,
        })
      }
      toast.success('Balanço atualizado com sucesso!')
      loadBalanco()
    } catch (e: any) {
      toast.error('Erro ao salvar dados')
    } finally {
      setSaving(false)
    }
  }

  const formatKg = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'decimal', maximumFractionDigits: 2 }).format(
      val || 0,
    ) + ' kg'

  const totalColhido = balanco?.quantidade_colhida_kg || 0
  const exportacao = balanco?.exportacao_kg || 0
  const mercadoInterno = balanco?.mercado_interno_kg || 0
  const perdaCampo = balanco?.perda_campo_kg || 0

  const totalDestinos =
    exportacao +
    mercadoInterno +
    doacao +
    descarteQualidade +
    descarteExcesso +
    perdaCampo +
    perdaPacking
  const diferenca = Math.abs(totalColhido - totalDestinos)
  const hasDivergence = diferenca > totalColhido * 0.005

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" /> MÓDULO F - BALANÇO DE MASSAS
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a distribuição do volume colhido e garanta a integridade (tolerância de 0.5%).
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={safraSelecionada} onValueChange={setSafraSelecionada}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione a Safra" />
            </SelectTrigger>
            <SelectContent>
              {safras.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nome_safra || s.codigo_safra} ({s.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Colhido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatKg(totalColhido)}</div>
                <p className="text-xs text-muted-foreground mt-1">Origem: Apontamentos de Campo</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Exportação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatKg(exportacao)}</div>
                <p className="text-xs text-muted-foreground mt-1">Pallets Embarcados (Ext)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Mercado Interno</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatKg(mercadoInterno)}</div>
                <p className="text-xs text-muted-foreground mt-1">Pallets Embarcados (Nac)</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Perda Campo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{formatKg(perdaCampo)}</div>
                <p className="text-xs text-muted-foreground mt-1">Registrado na Colheita</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Destinos Manuais e Descartes</CardTitle>
              <CardDescription>
                Ajuste os volumes descartados e não-comercializados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Doação (kg)</Label>
                  <Input
                    type="number"
                    value={doacao}
                    onChange={(e) => setDoacao(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descarte Qualidade (kg)</Label>
                  <Input
                    type="number"
                    value={descarteQualidade}
                    onChange={(e) => setDescarteQualidade(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descarte Excesso (kg)</Label>
                  <Input
                    type="number"
                    value={descarteExcesso}
                    onChange={(e) => setDescarteExcesso(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Perda no Packing (kg)</Label>
                  <Input
                    type="number"
                    value={perdaPacking}
                    onChange={(e) => setPerdaPacking(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Atualizar Valores
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={hasDivergence ? 'border-destructive' : 'border-green-500'}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">TOTAL DESTINOS</p>
                    <p className="text-3xl font-bold">{formatKg(totalDestinos)}</p>
                  </div>
                  <div className="text-muted-foreground text-2xl font-light">vs</div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">TOTAL COLHIDO</p>
                    <p className="text-3xl font-bold text-primary">{formatKg(totalColhido)}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium text-muted-foreground uppercase">Diferença</p>
                  <p
                    className={`text-2xl font-bold ${hasDivergence ? 'text-destructive' : 'text-green-600'}`}
                  >
                    {formatKg(diferenca)} (
                    {(totalColhido > 0 ? (diferenca / totalColhido) * 100 : 0).toFixed(2)}%)
                  </p>
                  <div className="mt-2">
                    {hasDivergence ? (
                      <span className="inline-flex items-center rounded-md bg-destructive/10 px-2 py-1 text-sm font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                        <AlertTriangle className="mr-1.5 h-4 w-4" /> ⚠️ Divergência de{' '}
                        {formatKg(diferenca)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> ✅ Balanceado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
