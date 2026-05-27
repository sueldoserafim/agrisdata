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
      throw new Error('Forbidden: Only admins can create new users.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const payload = await req.json()
    const { nome, email, password, perfil, fornecedor_id } = payload

    if (!nome || !email || !password || !perfil) {
      throw new Error('Missing required fields')
    }

    // Criar o usuário Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: nome, role: perfil }
    })

    if (authError) {
      throw new Error(`Error creating user in auth: ${authError.message}`)
    }

    // Criar o Perfil do usuário vinculando à mesma empresa do admin
    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        empresa_id: profile.empresa_id,
        email,
        nome,
        perfil,
        fornecedor_id: fornecedor_id || null,
        ativo: true
      })

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(`Error creating user profile: ${insertError.message}`)
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
