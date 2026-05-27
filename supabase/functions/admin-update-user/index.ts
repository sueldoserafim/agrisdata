import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error(`Unauthorized: ${userError?.message || 'User not found'}`)
    }
    
    const { data: profile, error: profileError } = await supabaseClient
      .from('usuarios')
      .select('perfil, empresa_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Forbidden: Profile not found')
    }
    
    if (profile.perfil !== 'admin' && profile.perfil !== 'admin_saas') {
      throw new Error('Forbidden: Only admins can update users.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const payload = await req.json()
    const { id, email, password, nome } = payload

    if (!id) {
      throw new Error('Missing required field: id')
    }

    const updateData: any = {}
    if (email) updateData.email = email
    if (password) updateData.password = password
    if (nome) updateData.user_metadata = { name: nome }

    if (Object.keys(updateData).length > 0) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, updateData)
      if (authError) {
        throw new Error(`Error updating user in auth: ${authError.message}`)
      }
    }

    const dbUpdate: any = {}
    if (email) dbUpdate.email = email
    if (nome) dbUpdate.nome = nome

    if (Object.keys(dbUpdate).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('usuarios')
        .update(dbUpdate)
        .eq('id', id)

      if (updateError) {
        throw new Error(`Error updating user profile: ${updateError.message}`)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
