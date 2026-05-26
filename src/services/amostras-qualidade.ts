import { supabase } from '@/lib/supabase/client'

export type AmostraQualidade = {
  id?: string
  empresa_id?: string
  talhao_id: string
  safra_id: string
  data_coleta: string
  estagio_fenologico?: string | null
  tamanho_amostra_frutos: number
  brix_minimo?: number | null
  brix_medio: number
  brix_maximo?: number | null
  acidez_titulavel?: number | null
  ratio_brix_acidez?: number | null
  firmeza_media?: number | null
  coloracao_escala?: number | null
  peso_medio_fruto?: number | null
  defeitos_percentual?: number | null
  apto_colheita?: boolean
  data_estimada_colheita?: string | null
  fotos?: string[]
  observacoes?: string | null
  created_at?: string
}

export async function uploadAmostraFoto(empresaId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${empresaId}/${Math.random().toString(36).slice(2)}.${fileExt}`
  const { error } = await supabase.storage.from('field-quality-samples').upload(fileName, file)
  if (error) {
    console.error('Error uploading photo:', error)
    return null
  }
  const { data } = supabase.storage.from('field-quality-samples').getPublicUrl(fileName)
  return data.publicUrl
}

export async function getAmostrasQualidade(empresaId: string) {
  const { data, error } = await supabase
    .from('amostras_qualidade_campo')
    .select(`
      *,
      safras(nome_safra, codigo_safra),
      talhoes(nome)
    `)
    .eq('empresa_id', empresaId)
    .order('data_coleta', { ascending: false })

  if (error) throw error
  return data
}

export async function getAmostraQualidade(id: string) {
  const { data, error } = await supabase
    .from('amostras_qualidade_campo')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function saveAmostraQualidade(data: AmostraQualidade) {
  if (data.id) {
    const { id, created_at, ...rest } = data
    const { data: updated, error } = await supabase
      .from('amostras_qualidade_campo')
      .update(rest as any)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  } else {
    const { data: inserted, error } = await supabase
      .from('amostras_qualidade_campo')
      .insert(data as any)
      .select()
      .single()
    if (error) throw error
    return inserted
  }
}

export async function deleteAmostraQualidade(id: string) {
  const { error } = await supabase.from('amostras_qualidade_campo').delete().eq('id', id)
  if (error) throw error
}
