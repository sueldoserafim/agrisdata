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

  // --- Cotações ---
  async getCotacoes(empresaId: string) {
    const { data, error } = await supabase
      .from('compras_cotacoes' as any)
      .select('*, requisicao:compras_requisicao(numero_requisicao, justificativa)')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getCotacao(id: string) {
    const { data, error } = await supabase
      .from('compras_cotacoes' as any)
      .select('*, requisicao:compras_requisicao(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createCotacao(payload: any) {
    const { data, error } = await supabase
      .from('compras_cotacoes' as any)
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateCotacaoStatus(id: string, status: string) {
    const { error } = await supabase
      .from('compras_cotacoes' as any)
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },

  async getFornecedoresCotacao(cotacaoId: string) {
    const { data, error } = await supabase
      .from('compras_cotacao_fornecedores' as any)
      .select('*, fornecedor:fornecedores(nome)')
      .eq('cotacao_id', cotacaoId)
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async saveFornecedorCotacao(payload: any) {
    if (payload.id) {
      const { error } = await supabase
        .from('compras_cotacao_fornecedores' as any)
        .update(payload)
        .eq('id', payload.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('compras_cotacao_fornecedores' as any).insert([payload])
      if (error) throw error
    }
  },

  async deleteFornecedorCotacao(id: string) {
    const { error } = await supabase
      .from('compras_cotacao_fornecedores' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async finalizarCotacao(
    cotacaoId: string,
    fornecedorVencedorId: string,
    requisicaoId: string,
    pedidoData: any,
  ) {
    await supabase
      .from('compras_cotacao_fornecedores' as any)
      .update({ vencedor: true })
      .eq('id', fornecedorVencedorId)
    await supabase
      .from('compras_cotacoes' as any)
      .update({ status: 'finalizada' })
      .eq('id', cotacaoId)

    const { data: requisicao } = await supabase
      .from('compras_requisicao')
      .select('itens')
      .eq('id', requisicaoId)
      .single()
    const itens = (requisicao?.itens as any[]) || []

    if (itens.length > 0) {
      const pedidos = itens.map((item) => ({
        empresa_id: pedidoData.empresa_id,
        requisicao_id: requisicaoId,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        fornecedor_id: pedidoData.fornecedor_id,
        preco_unitario: pedidoData.preco_unitario,
        data_entrega_prevista: pedidoData.data_entrega_prevista,
        condicoes_pagamento: pedidoData.condicoes_pagamento,
        total_pedido: Number(pedidoData.preco_unitario) * Number(item.quantidade),
        status: 'pendente',
      }))
      await supabase.from('compras_pedido').insert(pedidos)
    } else {
      await supabase.from('compras_pedido').insert([
        {
          empresa_id: pedidoData.empresa_id,
          requisicao_id: requisicaoId,
          produto_id: '00000000-0000-0000-0000-000000000000',
          quantidade: 1,
          fornecedor_id: pedidoData.fornecedor_id,
          preco_unitario: pedidoData.preco_unitario,
          data_entrega_prevista: pedidoData.data_entrega_prevista,
          condicoes_pagamento: pedidoData.condicoes_pagamento,
          total_pedido: Number(pedidoData.preco_unitario) * 1,
          status: 'pendente',
        },
      ])
    }

    await supabase.from('compras_requisicao').update({ pedido_gerado: true }).eq('id', requisicaoId)
  },

  // --- Fornecedores ---
  async getFornecedores(empresaId: string) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('nome')
    if (error) throw error
    return data
  },

  async getFornecedor(id: string) {
    const { data, error } = await supabase.from('fornecedores').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async saveFornecedor(payload: any) {
    if (payload.id) {
      const { data, error } = await supabase
        .from('fornecedores')
        .update(payload)
        .eq('id', payload.id)
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([payload])
        .select()
        .single()
      if (error) throw error
      return data
    }
  },

  async deleteFornecedor(id: string) {
    const { error } = await supabase
      .from('fornecedores')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  // --- Edge Functions ---
  async enviarEmail(payload: { to: string; subject: string; body: string }) {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: payload,
    })
    if (error) throw error
    return data
  },

  async getUsuarioFornecedor(fornecedorId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('fornecedor_id', fornecedorId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async criarUsuarioPortal(payload: any) {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: payload,
    })
    if (error) throw error
    if (data?.error) throw new Error(data.error)
    return data
  },

  async atualizarUsuarioPortal(payload: any) {
    const { data, error } = await supabase.functions.invoke('admin-update-user', {
      body: payload,
    })
    if (error) throw error
    if (data?.error) throw new Error(data.error)
    return data
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
  async receberPedido(payload: any) {
    const item = payload.itens[0]

    const { data: lote, error: loteError } = await supabase
      .from('lotes_estoque')
      .insert([
        {
          empresa_id: payload.empresa_id,
          produto_id: item.produto_id,
          armazem_id: item.armazem_id,
          numero_lote: item.numero_lote,
          quantidade: item.qtd_recebida,
          data_validade: item.data_validade,
          data_fabricacao: item.data_fabricacao || null,
          localizacao: item.localizacao || null,
          data_entrada: payload.data_recebimento,
        },
      ])
      .select()
      .single()
    if (loteError) throw loteError

    const { error: movError } = await supabase.from('estoque_movimento').insert([
      {
        empresa_id: payload.empresa_id,
        lote_id: lote.id,
        tipo_movimento: 'entrada',
        quantidade: item.qtd_recebida,
        motivo: `Recebimento NF: ${payload.numero_nf}`,
      },
    ])
    if (movError) throw movError

    const { error: pedError } = await supabase
      .from('compras_pedido')
      .update({
        status: 'recebido',
        numero_nota_fiscal: payload.numero_nf,
        observacoes: item.motivo_divergencia ? `Divergência: ${item.motivo_divergencia}` : null,
      })
      .eq('id', payload.pedido_id)
    if (pedError) throw pedError

    if (item.qtd_pedida !== item.qtd_recebida) {
      await supabase.from('alertas' as any).insert([
        {
          empresa_id: payload.empresa_id,
          titulo: 'Divergência no Recebimento',
          descricao: `Pedido recebido com divergência. Pedido: ${item.qtd_pedida}, Recebido: ${item.qtd_recebida}. Motivo: ${item.motivo_divergencia}`,
          tipo: 'warning',
        },
      ])
    }

    if (item.atualizar_estoque_minimo && item.novo_estoque_minimo) {
      const { error: prodError } = await supabase
        .from('produtos')
        .update({ estoque_minimo: item.novo_estoque_minimo })
        .eq('id', item.produto_id)
      if (prodError) throw prodError
    }

    return true
  },
}
