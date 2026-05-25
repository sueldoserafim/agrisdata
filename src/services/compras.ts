import { supabase } from '@/lib/supabase/client'

export const comprasService = {
  // --- Requisições ---
  async getRequisicoes(empresaId: string) {
    const { data, error } = await supabase
      .from('compras_requisicao')
      .select('*, solicitante:usuarios(nome)')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createRequisicao(requisicao: any, itens: any[]) {
    const { data: req, error } = await supabase
      .from('compras_requisicao')
      .insert([{ ...requisicao, itens, pedido_gerado: false }] as any)
      .select()
      .single()
    if (error) throw error

    return req
  },

  async updateRequisicaoStatus(id: string, status: string) {
    const { error } = await supabase.from('compras_requisicao').update({ status }).eq('id', id)
    if (error) throw error
  },

  // --- Pedidos ---
  async getPedidos(empresaId: string) {
    const { data, error } = await supabase
      .from('compras_pedido')
      .select(
        '*, produto:produtos(nome, unidade_medida), requisicao:compras_requisicao!inner(status, numero_requisicao), fornecedor:fornecedores(nome)',
      )
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getPedido(id: string) {
    const { data, error } = await supabase
      .from('compras_pedido')
      .select('*, produto:produtos(nome, unidade_medida)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async updatePedido(id: string, payload: any) {
    const { error } = await supabase.from('compras_pedido').update(payload).eq('id', id)
    if (error) throw error
  },

  // --- Recebimento de Estoque ---
  async receberPedido(pedidoId: string, recebimento: any) {
    const { data: lote, error: loteError } = await supabase
      .from('lotes_estoque')
      .insert([
        {
          empresa_id: recebimento.empresa_id,
          produto_id: recebimento.produto_id,
          armazem_id: recebimento.armazem_id,
          numero_lote: recebimento.numero_lote,
          quantidade: recebimento.quantidade,
          data_validade: recebimento.data_validade,
          data_entrada: new Date().toISOString(),
        },
      ])
      .select()
      .single()
    if (loteError) throw loteError

    const { error: movError } = await supabase.from('estoque_movimento').insert([
      {
        empresa_id: recebimento.empresa_id,
        lote_id: lote.id,
        tipo_movimento: 'entrada',
        quantidade: recebimento.quantidade,
        motivo: 'Recebimento de Pedido',
      },
    ])
    if (movError) throw movError

    const { error: pedError } = await supabase
      .from('compras_pedido')
      .update({
        status: 'recebido',
        numero_nota_fiscal: recebimento.numero_nota_fiscal,
      })
      .eq('id', pedidoId)
    if (pedError) throw pedError

    return true
  },
}
