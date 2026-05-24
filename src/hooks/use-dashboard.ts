import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export function useDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modulos, setModulos] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user) return

      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()
        if (!profile?.empresa_id) {
          if (mounted) setLoading(false)
          return
        }

        const { data: empresa } = await supabase
          .from('empresas')
          .select('modulos_habilitados')
          .eq('id', profile.empresa_id)
          .single()
        const mods = empresa?.modulos_habilitados || []
        if (mounted) setModulos(mods)

        const { count: safrasAtivas } = await supabase
          .from('safras')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'encerrada')

        const { data: safras } = await supabase
          .from('safras')
          .select('talhao_id')
          .neq('status', 'encerrada')
        const talhoesIds = [...new Set(safras?.map((s) => s.talhao_id).filter(Boolean) || [])]
        let areaPlantada = 0
        if (talhoesIds.length > 0) {
          const { data: talhoes } = await supabase
            .from('talhoes')
            .select('area_ha')
            .in('id', talhoesIds)
          areaPlantada = talhoes?.reduce((acc, t) => acc + Number(t.area_ha || 0), 0) || 0
        }

        const { count: osPendentes } = await supabase
          .from('operacoes_campo')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pendente')

        let kpis: any = {
          safrasAtivas: safrasAtivas || 0,
          talhoesAtivos: talhoesIds.length,
          areaPlantada,
          osPendentes: osPendentes || 0,
        }

        if (mods.includes('packing')) {
          const { count: palletsEmCamaraFria } = await supabase
            .from('pallets')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'em_estoque')
          const { count: carregamentosHoje } = await supabase
            .from('carregamentos')
            .select('*', { count: 'exact', head: true })
            .eq('data_carregamento', new Date().toISOString().split('T')[0])
          const { data: pallets } = await supabase.from('pallets').select('conformidade_percentual')
          const conformidadeMedia = pallets?.length
            ? pallets.reduce((acc, p) => acc + Number(p.conformidade_percentual || 0), 0) /
              pallets.length
            : 0

          kpis = {
            ...kpis,
            palletsEmCamaraFria: palletsEmCamaraFria || 0,
            carregamentosHoje: carregamentosHoje || 0,
            conformidadeMedia,
          }
        }

        if (mods.includes('exportacao')) {
          const { count: containersEmbarcados } = await supabase
            .from('containers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'embarcado')
          const { count: containersEmTransito } = await supabase
            .from('containers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'em_transito')

          const nextWeek = new Date()
          nextWeek.setDate(nextWeek.getDate() + 7)
          const { count: cutoffsProximos } = await supabase
            .from('containers')
            .select('*', { count: 'exact', head: true })
            .gte('cut_off', new Date().toISOString().split('T')[0])
            .lte('cut_off', nextWeek.toISOString().split('T')[0])

          kpis = {
            ...kpis,
            containersEmbarcados: containersEmbarcados || 0,
            containersEmTransito: containersEmTransito || 0,
            cutoffsProximos: cutoffsProximos || 0,
          }
        }

        if (mods.includes('financeiro')) {
          const { data: receitas } = await supabase
            .from('financeiro_lancamentos')
            .select('valor')
            .eq('tipo', 'receita')
            .eq('status', 'pendente')
          const { data: despesas } = await supabase
            .from('financeiro_lancamentos')
            .select('valor')
            .eq('tipo', 'despesa')
            .eq('status', 'pendente')
          const contasAReceber = receitas?.reduce((acc, r) => acc + Number(r.valor || 0), 0) || 0
          const contasAPagar = despesas?.reduce((acc, d) => acc + Number(d.valor || 0), 0) || 0
          const saldoProjetado = contasAReceber - contasAPagar

          kpis = { ...kpis, contasAReceber, contasAPagar, saldoProjetado }
        }

        const { data: prodData } = await supabase
          .from('historico_produtividade_talhao')
          .select('ano, produtividade_kg_ha')
        const prodAgg = (prodData || []).reduce((acc: any, row) => {
          if (!row.ano) return acc
          acc[row.ano] = (acc[row.ano] || 0) + Number(row.produtividade_kg_ha || 0)
          return acc
        }, {})
        const productivityChart = Object.keys(prodAgg)
          .map((year) => ({ year, value: prodAgg[year] }))
          .sort((a, b) => Number(a.year) - Number(b.year))

        const { data: costData } = await supabase
          .from('custos_talhao')
          .select('valor, centros_custo(nome)')
        const costAgg = (costData || []).reduce((acc: any, row) => {
          const name = (row.centros_custo as any)?.nome || 'Outros'
          acc[name] = (acc[name] || 0) + Number(row.valor || 0)
          return acc
        }, {})
        const costChart = Object.keys(costAgg).map((name) => ({ name, value: costAgg[name] }))

        if (mounted) {
          setData({ kpis, charts: { productivity: productivityChart, cost: costChart } })
        }
      } catch (err) {
        console.error('Dashboard fetch error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [user])

  return { data, loading, modulos }
}
