import { supabase } from '@/lib/supabase/client'

export const exportacaoService = {
  async getBookings(empresaId: string) {
    return supabase
      .from('bookings' as any)
      .select(
        `*, navios(nome_navio), porto_origem:porto_origem_id(nome_porto), porto_destino:porto_destino_id(nome_porto)`,
      )
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  },
  async getBooking(id: string) {
    return supabase
      .from('bookings' as any)
      .select('*')
      .eq('id', id)
      .single()
  },
  async saveBooking(data: any) {
    if (data.id)
      return supabase
        .from('bookings' as any)
        .update(data)
        .eq('id', data.id)
        .select()
        .single()
    return supabase
      .from('bookings' as any)
      .insert(data)
      .select()
      .single()
  },
  async deleteBooking(id: string) {
    return supabase
      .from('bookings' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
  },

  async getContainers(empresaId: string) {
    return supabase
      .from('containers')
      .select(`*, bookings:booking_id(numero_booking)`)
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  },
  async getContainer(id: string) {
    const [containerRes, romaneiosRes] = await Promise.all([
      supabase.from('containers').select('*').eq('id', id).single(),
      supabase.from('romaneios_venda').select('id').eq('container_id', id),
    ])
    if (containerRes.data) {
      ;(containerRes.data as any).romaneio_ids = romaneiosRes.data?.map((r: any) => r.id) || []
    }
    return containerRes
  },
  async saveContainer(data: any) {
    const { romaneio_ids, ...containerData } = data
    let containerResult
    if (containerData.id) {
      containerResult = await supabase
        .from('containers')
        .update(containerData)
        .eq('id', containerData.id)
        .select()
        .single()
    } else {
      containerResult = await supabase.from('containers').insert(containerData).select().single()
    }

    if (containerResult.error) return containerResult

    if (romaneio_ids) {
      await supabase
        .from('romaneios_venda')
        .update({ container_id: null })
        .eq('container_id', containerResult.data.id)
      if (romaneio_ids.length > 0) {
        await supabase
          .from('romaneios_venda')
          .update({ container_id: containerResult.data.id })
          .in('id', romaneio_ids)
      }
    }

    return containerResult
  },
  async deleteContainer(id: string) {
    return supabase.from('containers').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  },

  async getInvoices(empresaId: string) {
    return supabase
      .from('invoices_exportacao' as any)
      .select(`*, containers:container_id(numero_container), clientes:cliente_id(nome)`)
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  },
  async getInvoice(id: string) {
    return supabase
      .from('invoices_exportacao' as any)
      .select('*')
      .eq('id', id)
      .single()
  },
  async saveInvoice(data: any) {
    if (data.id)
      return supabase
        .from('invoices_exportacao' as any)
        .update(data)
        .eq('id', data.id)
        .select()
        .single()
    return supabase
      .from('invoices_exportacao' as any)
      .insert(data)
      .select()
      .single()
  },
  async deleteInvoice(id: string) {
    return supabase
      .from('invoices_exportacao' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
  },

  async getNavios(empresaId: string) {
    return supabase.from('navios').select('*').eq('empresa_id', empresaId).is('deleted_at', null)
  },
  async getPortos(empresaId: string) {
    return supabase.from('portos').select('*').eq('empresa_id', empresaId).is('deleted_at', null)
  },
  async getRomaneios(empresaId: string) {
    return supabase
      .from('romaneios_venda')
      .select('*')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
  },
  async getRomaneiosDisponiveis(empresaId: string, containerId?: string) {
    let query = supabase
      .from('romaneios_venda')
      .select('*')
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
    if (containerId) {
      query = query.or(`container_id.is.null,container_id.eq.${containerId}`)
    } else {
      query = query.is('container_id', null)
    }
    return query
  },
  async getClientes(empresaId: string) {
    return supabase.from('clientes').select('*').eq('empresa_id', empresaId).is('deleted_at', null)
  },
  async getUsuariosAprovadores(empresaId: string) {
    return supabase
      .from('usuarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .in('perfil', ['admin', 'gerente', 'supervisor'])
      .is('deleted_at', null)
  },

  async getDocumentos(empresaId: string) {
    return supabase
      .from('documentos_exportacao' as any)
      .select(`*, containers(numero_container)`)
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('data_validade', { ascending: true })
  },
  async getDocumento(id: string) {
    return supabase
      .from('documentos_exportacao' as any)
      .select('*')
      .eq('id', id)
      .single()
  },
  async saveDocumento(data: any) {
    if (data.id)
      return supabase
        .from('documentos_exportacao' as any)
        .update(data)
        .eq('id', data.id)
        .select()
        .single()
    return supabase
      .from('documentos_exportacao' as any)
      .insert(data)
      .select()
      .single()
  },
  async deleteDocumento(id: string) {
    return supabase
      .from('documentos_exportacao' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
  },

  async getRolagens(empresaId: string) {
    return supabase
      .from('rolagens_container' as any)
      .select(
        `*, containers(numero_container), booking_original:booking_original_id(numero_booking), booking_novo:booking_novo_id(numero_booking)`,
      )
      .eq('empresa_id', empresaId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  },
  async getRolagem(id: string) {
    return supabase
      .from('rolagens_container' as any)
      .select('*')
      .eq('id', id)
      .single()
  },
  async saveRolagem(data: any) {
    if (data.id)
      return supabase
        .from('rolagens_container' as any)
        .update(data)
        .eq('id', data.id)
        .select()
        .single()
    return supabase
      .from('rolagens_container' as any)
      .insert(data)
      .select()
      .single()
  },
  async deleteRolagem(id: string) {
    return supabase
      .from('rolagens_container' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
  },
}
