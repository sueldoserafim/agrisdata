import { Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, LayoutDashboard, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PortalLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-slate-900">Portal do Fornecedor</h1>
            <nav className="hidden md:flex gap-4">
              <Link
                to="/portal-fornecedor"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Painel
              </Link>
              <Link
                to="/portal-fornecedor/cotacoes"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Minhas Cotações
              </Link>
            </nav>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
