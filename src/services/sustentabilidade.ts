import { supabase } from '@/lib/supabase/client'

export const sustentabilidadeService = {
  getModelos: async (empresaId: string) =>
    supabase.from('certificacoes_modelos').select('*').eq('empresa_id', empresaId),
  getItensModelo: async (modeloId: string) =>
    supabase
      .from('certificacoes_itens_modelo')
      .select('*')
      .eq('modelo_id', modeloId)
      .order('secao'),

  getAuditorias: async (empresaId: string) =>
    supabase
      .from('certificacoes_auditorias')
      .select('*, certificacoes_modelos(nome)')
      .eq('empresa_id', empresaId)
      .order('data_agendada', { ascending: false }),
  getAuditoria: async (id: string) =>
    supabase
      .from('certificacoes_auditorias')
      .select('*, certificacoes_modelos(nome)')
      .eq('id', id)
      .single(),
  createAuditoria: async (data: any) =>
    supabase.from('certificacoes_auditorias').insert(data).select().single(),
  updateAuditoria: async (id: string, data: any) =>
    supabase.from('certificacoes_auditorias').update(data).eq('id', id).select().single(),

  getItensAuditoria: async (auditoriaId: string) =>
    supabase
      .from('certificacoes_itens_auditoria')
      .select('*, certificacoes_itens_modelo(*)')
      .eq('auditoria_id', auditoriaId),
  saveItemAuditoria: async (data: any) => {
    const { data: existing } = await supabase
      .from('certificacoes_itens_auditoria')
      .select('id')
      .eq('auditoria_id', data.auditoria_id)
      .eq('item_modelo_id', data.item_modelo_id)
      .maybeSingle()
    if (existing) {
      return supabase
        .from('certificacoes_itens_auditoria')
        .update({ resposta: data.resposta, observacoes: data.observacoes })
        .eq('id', existing.id)
    }
    return supabase.from('certificacoes_itens_auditoria').insert(data)
  },

  getNaoConformidades: async (empresaId: string) =>
    supabase
      .from('nao_conformidades')
      .select('*, certificacoes_auditorias(tipo_auditoria)')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false }),
  createNaoConformidade: async (data: any) =>
    supabase.from('nao_conformidades').insert(data).select().single(),
  updateNaoConformidade: async (id: string, data: any) =>
    supabase.from('nao_conformidades').update(data).eq('id', id).select().single(),

  getEmissoes: async (empresaId: string) =>
    supabase
      .from('emissoes_carbono')
      .select('*, safras(nome_safra), talhoes(nome)')
      .eq('empresa_id', empresaId)
      .order('data_registro', { ascending: true }),
  createEmissao: async (data: any) =>
    supabase.from('emissoes_carbono').insert(data).select().single(),

  getResiduos: async (empresaId: string) =>
    supabase
      .from('residuos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('data_geracao', { ascending: false }),
  createResiduo: async (data: any) => supabase.from('residuos').insert(data).select().single(),
  updateResiduo: async (id: string, data: any) =>
    supabase.from('residuos').update(data).eq('id', id).select().single(),

  getBalancoMassas: async (empresaId: string) =>
    supabase.from('balanco_massas').select('*, safras(nome_safra)').eq('empresa_id', empresaId),

  getAlertas: async (empresaId: string) =>
    supabase
      .from('alertas')
      .select('*')
      .eq('empresa_id', empresaId)
      .in('tipo', ['cdf_vencimento', 'manejo_fenologia', 'baixa_produtividade'])
      .eq('lido', false)
      .order('created_at', { ascending: false }),

  syncSustentabilidadeAlertas: async (empresaId: string) => {
    await supabase.rpc('gerar_alertas_fenologia', { p_empresa_id: empresaId })
    await supabase.rpc('check_daily_alerts_compliance')
  },
}
