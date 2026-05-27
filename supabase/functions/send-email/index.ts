import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Sending email with payload:', payload)

    // MOCK EMAIL SENDING
    // Here we would integrate with Resend, SendGrid, etc.
    // e.g., await fetch('https://api.resend.com/emails', { ... })

    return new Response(
      JSON.stringify({ success: true, message: 'Email successfully dispatched to ' + payload.to }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
