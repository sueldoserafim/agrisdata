import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function AdminProtectedRoute() {
  const { session, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    if (session?.user) {
      supabase
        .from('usuarios')
        .select('perfil')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (!mounted) return
          if (!error && data?.perfil === 'admin_saas') {
            setIsAdmin(true)
          } else {
            console.error('Error verifying admin profile or not admin:', error)
            setIsAdmin(false)
          }
        })
        .catch((err) => {
          console.error('Unexpected error verifying admin profile:', err)
          if (mounted) setIsAdmin(false)
        })
    } else if (!loading) {
      setIsAdmin(false)
    }
    return () => {
      mounted = false
    }
  }, [session, loading])

  if (loading || (session && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground font-medium">Verificando permissões...</span>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
