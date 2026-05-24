import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'

import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEmpresasList from './pages/admin/AdminEmpresasList'
import AdminEmpresasForm from './pages/admin/AdminEmpresasForm'
import AdminEmpresasDetail from './pages/admin/AdminEmpresasDetail'
import AdminPlanosList from './pages/admin/AdminPlanosList'
import AdminPlanosForm from './pages/admin/AdminPlanosForm'
import AdminFaturamentoList from './pages/admin/AdminFaturamentoList'
import AdminSuporteList from './pages/admin/AdminSuporteList'
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="empresas" element={<AdminEmpresasList />} />
              <Route path="empresas/new" element={<AdminEmpresasForm />} />
              <Route path="empresas/:id" element={<AdminEmpresasDetail />} />
              <Route path="empresas/:id/edit" element={<AdminEmpresasForm />} />
              <Route path="planos" element={<AdminPlanosList />} />
              <Route path="planos/new" element={<AdminPlanosForm />} />
              <Route path="planos/:id/edit" element={<AdminPlanosForm />} />
              <Route path="faturamento" element={<AdminFaturamentoList />} />
              <Route path="suporte" element={<AdminSuporteList />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="/app" element={<Index />} />
              <Route
                path="/app/producao"
                element={<div className="p-8 font-semibold text-xl">Produção</div>}
              />
              <Route
                path="/app/packing"
                element={<div className="p-8 font-semibold text-xl">Packing</div>}
              />
              <Route
                path="/app/exportacao"
                element={<div className="p-8 font-semibold text-xl">Exportação</div>}
              />
              <Route
                path="/app/financeiro"
                element={<div className="p-8 font-semibold text-xl">Financeiro</div>}
              />
              <Route path="/app/rh" element={<div className="p-8 font-semibold text-xl">RH</div>} />
              <Route
                path="/app/frota"
                element={<div className="p-8 font-semibold text-xl">Frota</div>}
              />
              <Route path="/app/bi" element={<div className="p-8 font-semibold text-xl">BI</div>} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
