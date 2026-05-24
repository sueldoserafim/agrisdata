import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function AdminProtectedRoute() {
  const { session, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (session?.user) {
      supabase
        .from('usuarios')
        .select('perfil')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data?.perfil === 'admin_saas') {
            setIsAdmin(true)
          } else {
            setIsAdmin(false)
          }
        })
    } else if (!loading) {
      setIsAdmin(false)
    }
  }, [session, loading])

  if (loading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">Verificando permissões...</div>
    )
  }

  if (!session || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
