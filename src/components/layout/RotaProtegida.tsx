import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

interface RotaProtegidaProps {
  requiredRole?: string
  children?: React.ReactNode
}

export function RotaProtegida({ requiredRole, children }: RotaProtegidaProps) {
  const { session, user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const userRole = user?.app_metadata?.role || user?.user_metadata?.role || (user as any)?.role

    if (userRole !== requiredRole) {
      return <Navigate to="/app" replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}
