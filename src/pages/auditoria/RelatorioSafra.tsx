import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Printer, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function RelatorioSafra() {
  const { id } = useParams<{ id: string }>()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadRelatorio() {
      if (!empresa?.id || !id) return
      setLoading(true)

      const [safraRes, opsRes, colheitasRes, balancoRes, custosRes] = await Promise.all([
        supabase
          .from('safras')
          .select(`
            *,
            cultivares(nome, culturas(nome)),
            fazendas(nome, endereco, municipio, estado, cnpj_imobiliario),
            usuarios!safras_responsavel_encerramento_id_fkey(nome, email, perfil),
            historico_produtividade_talhao(produtividade_kg_ha)
          `)
          .eq('id', id)
          .eq('empresa_id', empresa.id)
          .single(),
        supabase
          .from('operacoes_campo')
          .select('id, status')
          .eq('safra_id', id)
          .is('deleted_at', null),
        supabase.from('colheita_registros').select('*').eq('safra_id', id).is('deleted_at', null),
        supabase.from('balanco_massas').select('*').eq('safra_id', id).maybeSingle(),
        supabase
          .from('custos_talhao')
          .select('valor, descricao, centros_custo(nome)')
          .eq('safra_id', id)
          .is('deleted_at', null),
      ])

      if (safraRes.data) {
        const ops = opsRes.data || []
        const concluidas = ops.filter((o) => o.status === 'concluída').length
        const totalOps = ops.filter((o) => o.status !== 'cancelada').length
        const pendentes = totalOps - concluidas

        const colheitas = colheitasRes.data || []
        const totalTon = colheitas.reduce((acc, c) => acc + (c.producao_liquida_ton || 0), 0)
        const areaColhida = colheitas.reduce((acc, c) => acc + (c.area_colhida_ha || 0), 0)

        const historico = safraRes.data.historico_produtividade_talhao || []
        const avgProd =
          historico.length > 0
            ? historico.reduce(
                (acc: number, curr: any) => acc + (curr.produtividade_kg_ha || 0),
                0,
              ) / historico.length
            : 0

        let divergence = 0
        const b = balancoRes.data
        if (b && b.quantidade_colhida_kg) {
          const inputs = b.quantidade_colhida_kg || 0
          const outputs = (b.quantidade_processada_kg || 0) + (b.quantidade_descarte_kg || 0)
          if (inputs > 0) {
            divergence = Math.abs((inputs - outputs) / inputs) * 100
          }
        }

        const custos = custosRes.data || []
        const totalCustos = custos.reduce((acc, c) => acc + (Number(c.valor) || 0), 0)
        const areaPlanejada = Number(safraRes.data.area_planejada_ha) || areaColhida || 1
        const custoPorHa = totalCustos / areaPlanejada
        const custoPorTon = totalTon > 0 ? totalCustos / totalTon : 0

        const custosAgrupados = custos.reduce(
          (acc, c) => {
            const cat = c.centros_custo?.nome || 'Geral'
            acc[cat] = (acc[cat] || 0) + (Number(c.valor) || 0)
            return acc
          },
          {} as Record<string, number>,
        )

        setData({
          safra: safraRes.data,
          checklist: {
            opsPendentes: pendentes,
            opsTotal: totalOps,
            hasColheita: colheitas.length > 0,
            divergence,
            isBalancoValid: divergence <= 0.5,
          },
          metrics: {
            totalTon,
            areaColhida,
            avgProd,
            totalCustos,
            custoPorHa,
            custoPorTon,
            custosAgrupados,
          },
        })
      }
      setLoading(false)
    }
    loadRelatorio()
  }, [empresa?.id, id])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data || !data.safra) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Safra não encontrada ou não encerrada.
      </div>
    )
  }

  const { safra, checklist, metrics } = data
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="p-8 w-full max-w-[1000px] mx-auto min-h-screen bg-muted/20 print:bg-white print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button variant="ghost" asChild>
          <Link to="/app/auditoria-safras">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Link>
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir Relatório
        </Button>
      </div>

      <div className="bg-card text-card-foreground shadow-sm rounded-lg border p-10 print:shadow-none print:border-none print:p-0">
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wider">{empresa?.nome}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Relatório Final de Safra e Auditoria
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Emitido em:</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
              Informações da Fazenda
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Fazenda:</span> {safra.fazendas?.nome || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Endereço:</span> {safra.fazendas?.endereco || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Localidade:</span> {safra.fazendas?.municipio} -{' '}
                {safra.fazendas?.estado}
              </p>
              <p>
                <span className="font-medium">CNPJ Imobiliário:</span>{' '}
                {safra.fazendas?.cnpj_imobiliario || 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
              Dados da Safra
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Identificação:</span>{' '}
                {safra.nome_safra || safra.codigo_safra}
              </p>
              <p>
                <span className="font-medium">Cultura:</span> {safra.cultivares?.culturas?.nome} (
                {safra.cultivares?.nome})
              </p>
              <p>
                <span className="font-medium">Data de Plantio:</span>{' '}
                {formatDate(safra.data_plantio)}
              </p>
              <p>
                <span className="font-medium">Encerramento Real:</span>{' '}
                {formatDate(safra.data_colheita_real)}
              </p>
              <p>
                <span className="font-medium">Ano Safra:</span> {safra.ano_safra}
              </p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-4 border-b pb-2">
          Métricas de Produção
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">Área Total Colhida</p>
            <p className="text-xl font-bold">
              {metrics.areaColhida.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha
            </p>
            <p className="text-xs text-muted-foreground mt-1 print:text-black">
              Planejado: {safra.area_planejada_ha || 0} ha
            </p>
          </div>
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">Produção Líquida Total</p>
            <p className="text-xl font-bold">
              {metrics.totalTon.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ton
            </p>
            <p className="text-xs text-muted-foreground mt-1 print:text-black">
              Meta: {safra.meta_producao_kg / 1000 || 0} ton
            </p>
          </div>
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">
              Produtividade Média Realizada
            </p>
            <p className="text-xl font-bold">
              {metrics.avgProd.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg/ha
            </p>
            <p className="text-xs text-muted-foreground mt-1 print:text-black">
              Planejado: {safra.produtividade_planejada || 0} kg/ha
            </p>
          </div>
        </div>

        <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-4 border-b pb-2">
          Rentabilidade Estimada & Custos
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">Custo Total</p>
            <p className="text-xl font-bold text-destructive">
              {formatCurrency(metrics.totalCustos)}
            </p>
          </div>
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">Custo por Hectare</p>
            <p className="text-xl font-bold">{formatCurrency(metrics.custoPorHa)}</p>
          </div>
          <div className="p-4 border rounded-md bg-muted/10 print:bg-transparent print:border-black/20">
            <p className="text-xs text-muted-foreground print:text-black">
              Custo por Tonelada Produzida
            </p>
            <p className="text-xl font-bold">{formatCurrency(metrics.custoPorTon)}</p>
          </div>
        </div>

        {Object.keys(metrics.custosAgrupados).length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
              Desdobramento de Custos
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(metrics.custosAgrupados).map(([categoria, valor]) => (
                <div key={categoria} className="text-sm border-b pb-1 print:border-black/20">
                  <span className="text-muted-foreground block text-xs">{categoria}</span>
                  <span className="font-medium">{formatCurrency(valor as number)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-4 border-b pb-2">
          Checklist de Conformidade (Auditoria)
        </h3>
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3">
            {checklist.opsPendentes === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 print:text-black" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 print:text-black" />
            )}
            <span className="text-sm font-medium">
              Operações de Campo:{' '}
              {checklist.opsPendentes === 0
                ? 'Todas concluídas'
                : `${checklist.opsPendentes} operações não concluídas`}{' '}
              (Total: {checklist.opsTotal})
            </span>
          </div>
          <div className="flex items-center gap-3">
            {checklist.hasColheita ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 print:text-black" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 print:text-black" />
            )}
            <span className="text-sm font-medium">
              Registros de Colheita: {checklist.hasColheita ? 'Presentes' : 'Ausentes'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {checklist.isBalancoValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 print:text-black" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 print:text-black" />
            )}
            <span className="text-sm font-medium">
              Balanço de Massas (Divergência ≤ 0.5%):{' '}
              {checklist.isBalancoValid ? 'Conforme' : 'Fora da tolerância'} (
              {checklist.divergence.toFixed(2)}%)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 print:text-black" />
            <span className="text-sm font-medium">
              Integração de Estoque: Lotes gerados automaticamente no encerramento.
            </span>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t grid grid-cols-2 gap-16 text-center">
          <div>
            {safra.data_assinatura_tecnica ? (
              <div className="mb-2 flex flex-col items-center">
                <p className="font-mono text-xs text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-md py-2 px-4 inline-block print:border-black print:text-black print:bg-transparent">
                  Assinado Digitalmente em
                  <br />
                  {format(new Date(safra.data_assinatura_tecnica), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>
            ) : (
              <div className="border-b border-black w-3/4 mx-auto mb-2 h-10"></div>
            )}
            <p className="font-semibold text-sm mt-2">
              {safra.usuarios?.nome || safra.usuarios?.email || 'Responsável Técnico'}
            </p>
            <p className="text-xs text-muted-foreground">
              {safra.usuarios?.perfil === 'admin'
                ? 'Administrador'
                : 'Responsável pelo Encerramento'}
            </p>
          </div>
          <div>
            <div className="border-b border-black w-3/4 mx-auto mb-2 h-10"></div>
            <p className="font-semibold text-sm mt-2">Diretoria / Gerência</p>
            <p className="text-xs text-muted-foreground">Aprovação Final</p>
          </div>
        </div>
      </div>
    </div>
  )
}
