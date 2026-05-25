import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export function PortalFornecedorProtectedRoute() {
  const { session, loading } = useAuth()
  const [perfil, setPerfil] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (session) {
      supabase
        .from('usuarios')
        .select('perfil')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setPerfil(data?.perfil || null)
          setChecking(false)
        })
    } else {
      if (!loading) setChecking(false)
    }
  }, [session, loading])

  if (loading || checking) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (perfil !== 'fornecedor') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
