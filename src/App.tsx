import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'

import Index from './pages/Index'
import Patients from './pages/Patients'
import Messages from './pages/Messages'
import Appointments from './pages/Appointments'
import MedicalRecords from './pages/MedicalRecords'
import Analytics from './pages/Analytics'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
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
              <Route path="/" element={<Index />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
