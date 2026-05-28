import { supabase } from '@/lib/supabase/client'

export async function getClientes(empresa_id: string) {
  return await supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresa_id)
    .is('deleted_at', null)
}

export async function getCliente(id: string) {
  const { data: cliente } = await supabase.from('clientes').select('*').eq('id', id).single()
  const { data: enderecos } = await supabase
    .from('enderecos_entidade')
    .select('*')
    .eq('entidade_id', id)
  const { data: contatos } = await supabase
    .from('contatos_entidade')
    .select('*')
    .eq('entidade_id', id)
  const { data: bancos } = await supabase
    .from('contas_bancarias_entidade')
    .select('*')
    .eq('entidade_id', id)
  const { data: documentos } = await supabase
    .from('documentos_entidade')
    .select('*')
    .eq('entidade_id', id)
  return { ...cliente, enderecos, contatos, bancos, documentos }
}

export async function saveCliente(empresa_id: string, id: string | null, data: any) {
  const { enderecos, contatos, bancos, documentos, ...core } = data
  let clienteId = id

  if (id) {
    const { error } = await supabase.from('clientes').update(core).eq('id', id)
    if (error) throw error
  } else {
    const { data: newC, error } = await supabase
      .from('clientes')
      .insert({ ...core, empresa_id })
      .select()
      .single()
    if (error) throw error
    clienteId = newC.id
  }

  if (!clienteId) throw new Error('Erro ao salvar cliente.')

  await supabase.from('enderecos_entidade').delete().eq('entidade_id', clienteId)
  if (enderecos?.length)
    await supabase
      .from('enderecos_entidade')
      .insert(
        enderecos.map((e: any) => ({
          ...e,
          entidade_id: clienteId,
          entidade_tipo: 'cliente',
          empresa_id,
        })),
      )

  await supabase.from('contatos_entidade').delete().eq('entidade_id', clienteId)
  if (contatos?.length)
    await supabase
      .from('contatos_entidade')
      .insert(
        contatos.map((c: any) => ({
          ...c,
          entidade_id: clienteId,
          entidade_tipo: 'cliente',
          empresa_id,
        })),
      )

  await supabase.from('contas_bancarias_entidade').delete().eq('entidade_id', clienteId)
  if (bancos?.length)
    await supabase
      .from('contas_bancarias_entidade')
      .insert(
        bancos.map((b: any) => ({
          ...b,
          entidade_id: clienteId,
          entidade_tipo: 'cliente',
          empresa_id,
        })),
      )

  await supabase.from('documentos_entidade').delete().eq('entidade_id', clienteId)
  if (documentos?.length)
    await supabase
      .from('documentos_entidade')
      .insert(
        documentos.map((d: any) => ({
          ...d,
          entidade_id: clienteId,
          entidade_tipo: 'cliente',
          empresa_id,
          data_emissao: d.data_emissao || null,
          data_validade: d.data_validade || null,
        })),
      )

  if (core.acesso_portal && core.email) {
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('cliente_id', clienteId)
      .maybeSingle()
    if (!existingUser) {
      const pwd = Math.random().toString(36).slice(-8) + 'Aa1@'
      await supabase.functions.invoke('admin-create-user', {
        body: {
          nome: core.nome,
          email: core.email,
          password: pwd,
          perfil: 'cliente',
          cliente_id: clienteId,
        },
      })
      await supabase.functions.invoke('send-email', {
        body: {
          to: core.email,
          subject: 'Acesso ao Portal do Cliente',
          text: `Sua senha temporária é: ${pwd}`,
        },
      })
    }
  }

  return clienteId
}
