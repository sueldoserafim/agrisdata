import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    )
    
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    
    const { data: profile } = await supabaseClient.from('usuarios').select('perfil').eq('id', user.id).single()
    if (profile?.perfil !== 'admin_saas') throw new Error('Forbidden')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const payload = await req.json()
    const { nome, cnpj, email, telefone, plano_id, slug, modulos_habilitados, limite_usuarios, admin_nome, admin_email, admin_senha } = payload

    const { data: empresa, error: empresaError } = await supabaseAdmin
      .from('empresas')
      .insert({
        nome, cnpj, email, telefone, plano_id, slug, ativo: true,
        modulos_habilitados: modulos_habilitados || [],
        limite_usuarios: limite_usuarios || 5
      })
      .select()
      .single()

    if (empresaError) throw new Error(`Erro ao criar empresa: ${empresaError.message}`)

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_senha,
      email_confirm: true,
      user_metadata: { name: admin_nome, role: 'admin' }
    })

    if (authError) {
      await supabaseAdmin.from('empresas').delete().eq('id', empresa.id)
      throw new Error(`Erro ao criar usuário auth: ${authError.message}`)
    }

    const { error: userError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        empresa_id: empresa.id,
        email: admin_email,
        nome: admin_nome,
        perfil: 'admin',
        ativo: true
      })

    if (userError) throw new Error(`Erro ao criar perfil de usuário: ${userError.message}`)

    return new Response(JSON.stringify({ success: true, empresa }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
