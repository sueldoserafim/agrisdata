import { supabase } from '@/lib/supabase/client'

export const getFazendas = async (
  empresa_id: string,
  filtros?: { municipio?: string; tipo_producao?: string },
) => {
  let query = supabase
    .from('fazendas')
    .select('*')
    .eq('empresa_id', empresa_id)
    .is('deleted_at', null)

  if (filtros?.municipio) {
    query = query.ilike('municipio', `%${filtros.municipio}%`)
  }
  if (filtros?.tipo_producao && filtros.tipo_producao !== 'todos') {
    query = query.eq('tipo_producao', filtros.tipo_producao)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getFazenda = async (id: string, empresa_id: string) => {
  const { data, error } = await supabase
    .from('fazendas')
    .select('*')
    .eq('id', id)
    .eq('empresa_id', empresa_id)
    .single()
  if (error) throw error
  return data
}

export const createFazenda = async (fazenda: any) => {
  const { data, error } = await supabase.from('fazendas').insert(fazenda).select().single()
  if (error) throw error
  return data
}

export const updateFazenda = async (id: string, fazenda: any) => {
  const { data, error } = await supabase
    .from('fazendas')
    .update(fazenda)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getFazendaStats = async (id: string) => {
  const { count: talhoesCount } = await supabase
    .from('talhoes')
    .select('id', { count: 'exact', head: true })
    .eq('fazenda_id', id)
    .is('deleted_at', null)

  const { data: talhoes } = await supabase
    .from('talhoes')
    .select('id')
    .eq('fazenda_id', id)
    .is('deleted_at', null)
  const talhoesIds = talhoes?.map((t) => t.id) || []

  let culturaPrincipal = 'N/A'
  if (talhoesIds.length > 0) {
    const { data: safras } = await supabase
      .from('safras')
      .select(`cultivares(culturas(nome))`)
      .in('talhao_id', talhoesIds)
      .is('deleted_at', null)

    const counts: Record<string, number> = {}
    safras?.forEach((s) => {
      const nome = (s.cultivares as any)?.culturas?.nome
      if (nome) counts[nome] = (counts[nome] || 0) + 1
    })

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    if (sorted.length > 0) culturaPrincipal = sorted[0][0]
  }

  return { numTalhoes: talhoesCount || 0, culturaPrincipal }
}
