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

    // Usar o cliente Supabase autenticado para obter as credenciais do chamador
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error(`Unauthorized: ${userError?.message || 'User not found'}`)
    }
    
    // Verificar se o usuário possui a role de admin_saas
    const { data: profile, error: profileError } = await supabaseClient
      .from('usuarios')
      .select('perfil')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw new Error(`Forbidden: Falha ao carregar perfil do usuário (${profileError.message})`)
    }
    if (profile?.perfil !== 'admin_saas') {
      throw new Error('Forbidden: Apenas usuários admin_saas podem criar novas empresas.')
    }

    // Criar um cliente com privilégios Service Role para realizar bypass no RLS e criar dados protegidos
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const payload = await req.json()
    const { nome, cnpj, email, telefone, plano_id, slug, modulos_habilitados, limite_usuarios, admin_nome, admin_email, admin_senha } = payload

    if (!nome || !slug || !admin_email || !admin_senha) {
      throw new Error('Campos obrigatórios faltando: nome, slug, admin_email, ou admin_senha')
    }

    // Verificar unicidade do slug
    const { data: existingEmpresa } = await supabaseAdmin.from('empresas').select('id').eq('slug', slug).maybeSingle()
    if (existingEmpresa) {
      throw new Error(`O slug "${slug}" já está em uso por outra empresa.`)
    }

    // Criar a empresa
    const { data: empresa, error: empresaError } = await supabaseAdmin
      .from('empresas')
      .insert({
        nome, 
        cnpj: cnpj || null, 
        email: email || null, 
        telefone: telefone || null, 
        plano_id: plano_id || null, 
        slug, 
        ativo: true,
        modulos_habilitados: modulos_habilitados || [],
        limite_usuarios: limite_usuarios || 5
      })
      .select()
      .single()

    if (empresaError) throw new Error(`Erro ao criar empresa: ${empresaError.message}`)

    // Criar o usuário Auth administrador do Tenant
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_senha,
      email_confirm: true,
      user_metadata: { name: admin_nome, role: 'admin' }
    })

    if (authError) {
      // Reverter criação da empresa
      await supabaseAdmin.from('empresas').delete().eq('id', empresa.id)
      throw new Error(`Erro ao criar usuário administrador no Auth: ${authError.message}`)
    }

    // Criar o Perfil do usuário vinculando à empresa recém criada
    const { error: userErrorAdmin } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        empresa_id: empresa.id,
        email: admin_email,
        nome: admin_nome,
        perfil: 'admin',
        ativo: true
      })

    if (userErrorAdmin) {
      // Reverter criação
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabaseAdmin.from('empresas').delete().eq('id', empresa.id)
      throw new Error(`Erro ao criar perfil de usuário: ${userErrorAdmin.message}`)
    }

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
