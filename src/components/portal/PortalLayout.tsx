import { Outlet } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export function PortalLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg text-slate-800">Portal do Parceiro</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>Agrisdata © {new Date().getFullYear()} - Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
