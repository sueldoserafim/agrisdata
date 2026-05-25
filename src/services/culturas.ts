import { supabase } from '@/lib/supabase/client'

export type FenologiaData = {
  id?: string
  estagio: string
  dias_desde_plantio: number
  descricao?: string | null
}

export type CulturaData = {
  id?: string
  nome: string
  nome_cientifico?: string | null
  tipo: string
  codigo_ncm?: string | null
  unidade_medida?: string | null
  ciclo_dias: number
  temperatura_base_gda?: number | null
  temp_minima_ideal?: number | null
  temp_maxima_ideal?: number | null
  necessidade_hidrica_mm_dia?: number | null
  brix_minimo_ideal?: number | null
  brix_maximo_ideal?: number | null
  produtividade_media_t_ha?: number | null
}

export async function getCulturas(empresaId: string) {
  const { data, error } = await supabase
    .from('culturas')
    .select('*')
    .eq('empresa_id', empresaId)
    .is('deleted_at', null)
    .order('nome')

  if (error) throw error
  return data
}

export async function getCulturaById(id: string, empresaId: string) {
  const { data: cultura, error: culturaError } = await supabase
    .from('culturas')
    .select('*')
    .eq('id', id)
    .eq('empresa_id', empresaId)
    .is('deleted_at', null)
    .single()

  if (culturaError) throw culturaError

  const { data: fenologia, error: fenologiaError } = await supabase
    .from('culturas_fenologia')
    .select('*')
    .eq('cultura_id', id)
    .eq('empresa_id', empresaId)
    .is('deleted_at', null)
    .order('dias_desde_plantio')

  if (fenologiaError) throw fenologiaError

  return { cultura, fenologia }
}

export async function createCultura(
  culturaData: CulturaData,
  fenologiaData: FenologiaData[],
  empresaId: string,
) {
  const { data: cultura, error: culturaError } = await supabase
    .from('culturas')
    .insert({ ...culturaData, empresa_id: empresaId })
    .select()
    .single()

  if (culturaError) throw culturaError

  if (fenologiaData.length > 0) {
    const fenoToInsert = fenologiaData.map((f) => ({
      ...f,
      cultura_id: cultura.id,
      empresa_id: empresaId,
    }))
    const { error: fenoError } = await supabase.from('culturas_fenologia').insert(fenoToInsert)
    if (fenoError) throw fenoError
  }

  return cultura
}

export async function updateCultura(
  id: string,
  culturaData: CulturaData,
  fenologiaData: FenologiaData[],
  empresaId: string,
) {
  const { data: cultura, error: culturaError } = await supabase
    .from('culturas')
    .update(culturaData)
    .eq('id', id)
    .eq('empresa_id', empresaId)
    .select()
    .single()

  if (culturaError) throw culturaError

  const { error: delError } = await supabase
    .from('culturas_fenologia')
    .delete()
    .eq('cultura_id', id)
    .eq('empresa_id', empresaId)

  if (delError) throw delError

  if (fenologiaData.length > 0) {
    const fenoToInsert = fenologiaData.map((f) => ({ ...f, cultura_id: id, empresa_id: empresaId }))
    const { error: fenoError } = await supabase.from('culturas_fenologia').insert(fenoToInsert)
    if (fenoError) throw fenoError
  }

  return cultura
}

export async function deleteCultura(id: string, empresaId: string) {
  const { error } = await supabase
    .from('culturas')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('empresa_id', empresaId)

  if (error) throw error
}
