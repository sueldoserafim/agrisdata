import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'

import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import { EmpresaProvider } from './hooks/use-empresa'
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
import Usuarios from './pages/app/Usuarios'
import SettingsPage from './pages/Settings'
import AuditoriaSafrasList from './pages/auditoria/AuditoriaSafrasList'
import RelatorioSafra from './pages/auditoria/RelatorioSafra'

import FazendaList from './pages/fazendas/FazendaList'
import FazendaForm from './pages/fazendas/FazendaForm'
import TalhaoList from './pages/talhoes/TalhaoList'
import TalhaoForm from './pages/talhoes/TalhaoForm'
import CulturaList from './pages/culturas/CulturaList'
import CulturaForm from './pages/culturas/CulturaForm'
import CultivarList from './pages/cultivares/CultivarList'
import CultivarForm from './pages/cultivares/CultivarForm'
import SafraDashboard from './pages/safras/SafraDashboard'
import SafraForm from './pages/safras/SafraForm'
import ProdutoList from './pages/produtos/ProdutoList'
import ProdutoForm from './pages/produtos/ProdutoForm'
import AlmoxarifadoDashboard from './pages/estoque/AlmoxarifadoDashboard'
import RequisicoesInternasList from './pages/estoque/RequisicoesInternasList'
import RequisicoesInternasForm from './pages/estoque/RequisicoesInternasForm'
import RequisicaoList from './pages/compras/RequisicaoList'
import RequisicaoForm from './pages/compras/RequisicaoForm'
import AprovacoesList from './pages/compras/AprovacoesList'
import CotacaoList from './pages/compras/CotacaoList'
import CotacaoForm from './pages/compras/CotacaoForm'
import CotacaoDetail from './pages/compras/CotacaoDetail'
import PedidoList from './pages/compras/PedidoList'
import PedidoForm from './pages/compras/PedidoForm'
import RecebimentoForm from './pages/compras/RecebimentoForm'
import FornecedorList from './pages/compras/FornecedorList'
import FornecedorForm from './pages/compras/FornecedorForm'
import GrausDiaDashboard from './pages/agronomia/GrausDiaDashboard'
import GrausDiaForm from './pages/agronomia/GrausDiaForm'
import PluviometriaDashboard from './pages/agronomia/PluviometriaDashboard'
import PluviometriaForm from './pages/agronomia/PluviometriaForm'
import AnalisesSoloList from './pages/agronomia/AnalisesSoloList'
import AnalisesSoloForm from './pages/agronomia/AnalisesSoloForm'
import AmostrasQualidadeList from './pages/agronomia/AmostrasQualidadeList'
import AmostrasQualidadeForm from './pages/agronomia/AmostrasQualidadeForm'
import OperacaoList from './pages/operacoes/OperacaoList'
import OperacaoForm from './pages/operacoes/OperacaoForm'
import MinhasOperacoes from './pages/operacoes/MinhasOperacoes'
import MonitoramentoList from './pages/producao/MonitoramentoList'
import MonitoramentoForm from './pages/producao/MonitoramentoForm'
import EquipePerformance from './pages/operacoes/EquipePerformance'
import ProducaoDashboard from './pages/producao/ProducaoDashboard'
import MonitoramentoPragasMap from './pages/producao/MonitoramentoPragasMap'
import MonitoramentoPragasForm from './pages/producao/MonitoramentoPragasForm'
import ColheitaForm from './pages/producao/colheita/ColheitaForm'
import EquipamentoList from './pages/equipamentos/EquipamentoList'
import EquipamentoForm from './pages/equipamentos/EquipamentoForm'
import EquipamentoDetail from './pages/equipamentos/EquipamentoDetail'
import RentabilidadeList from './pages/financeiro/RentabilidadeList'
import RastreabilidadeDetail from './pages/producao/colheita/RastreabilidadeDetail'
import PackingDashboard from './pages/packing/PackingDashboard'

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
            <Route
              element={
                <EmpresaProvider>
                  <Outlet />
                </EmpresaProvider>
              }
            >
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/app" replace />} />
                <Route path="/app" element={<Index />} />
                <Route path="/app/fazendas" element={<FazendaList />} />
                <Route path="/app/fazendas/new" element={<FazendaForm />} />
                <Route path="/app/fazendas/:id" element={<FazendaForm />} />

                <Route path="/app/talhoes" element={<TalhaoList />} />
                <Route path="/app/talhoes/new" element={<TalhaoForm />} />
                <Route path="/app/talhoes/:id" element={<TalhaoForm />} />

                <Route path="/app/agronomia/gda" element={<GrausDiaDashboard />} />
                <Route path="/app/agronomia/gda/novo" element={<GrausDiaForm />} />
                <Route path="/app/agronomia/gda/:id" element={<GrausDiaForm />} />

                <Route path="/app/agronomia/pluviometria" element={<PluviometriaDashboard />} />
                <Route path="/app/agronomia/pluviometria/novo" element={<PluviometriaForm />} />
                <Route path="/app/agronomia/pluviometria/:id" element={<PluviometriaForm />} />

                <Route path="/app/agronomia/analises-solo" element={<AnalisesSoloList />} />
                <Route path="/app/agronomia/analises-solo/novo" element={<AnalisesSoloForm />} />
                <Route path="/app/agronomia/analises-solo/:id" element={<AnalisesSoloForm />} />

                <Route
                  path="/app/agronomia/amostras-qualidade"
                  element={<AmostrasQualidadeList />}
                />
                <Route
                  path="/app/agronomia/amostras-qualidade/nova"
                  element={<AmostrasQualidadeForm />}
                />
                <Route
                  path="/app/agronomia/amostras-qualidade/:id"
                  element={<AmostrasQualidadeForm />}
                />

                <Route path="/app/culturas" element={<CulturaList />} />
                <Route path="/app/culturas/new" element={<CulturaForm />} />
                <Route path="/app/culturas/:id" element={<CulturaForm />} />

                <Route path="/app/cultivares" element={<CultivarList />} />
                <Route path="/app/cultivares/new" element={<CultivarForm />} />
                <Route path="/app/cultivares/:id" element={<CultivarForm />} />

                <Route path="/app/safras" element={<SafraDashboard />} />
                <Route path="/app/safras/new" element={<SafraForm />} />
                <Route path="/app/safras/:id" element={<SafraForm />} />

                <Route path="/app/produtos" element={<ProdutoList />} />
                <Route path="/app/produtos/new" element={<ProdutoForm />} />
                <Route path="/app/produtos/:id" element={<ProdutoForm />} />

                <Route path="/app/insumos" element={<ProdutoList />} />
                <Route path="/app/insumos/new" element={<ProdutoForm />} />
                <Route path="/app/insumos/:id" element={<ProdutoForm />} />

                <Route path="/app/estoque/almoxarifado" element={<AlmoxarifadoDashboard />} />
                <Route
                  path="/app/estoque/requisicoes-internas"
                  element={<RequisicoesInternasList />}
                />
                <Route
                  path="/app/estoque/requisicoes-internas/nova"
                  element={<RequisicoesInternasForm />}
                />

                <Route path="/app/compras/requisicoes" element={<RequisicaoList />} />
                <Route path="/app/compras/requisicoes/new" element={<RequisicaoForm />} />
                <Route path="/app/compras/requisicoes/:id" element={<RequisicaoForm />} />
                <Route path="/app/compras/aprovacoes" element={<AprovacoesList />} />
                <Route path="/app/compras/cotacoes" element={<CotacaoList />} />
                <Route path="/app/compras/cotacoes/nova" element={<CotacaoForm />} />
                <Route path="/app/compras/cotacoes/:id" element={<CotacaoDetail />} />
                <Route path="/app/compras/pedidos" element={<PedidoList />} />
                <Route path="/app/compras/pedidos/:id" element={<PedidoForm />} />
                <Route path="/app/compras/recebimentos/novo" element={<RecebimentoForm />} />
                <Route path="/app/compras/pedidos/:id/receber" element={<RecebimentoForm />} />
                <Route path="/app/compras/fornecedores" element={<FornecedorList />} />
                <Route path="/app/compras/fornecedores/new" element={<FornecedorForm />} />
                <Route path="/app/compras/fornecedores/:id" element={<FornecedorForm />} />

                <Route path="/app/operacoes" element={<OperacaoList />} />
                <Route path="/app/operacoes/minhas" element={<MinhasOperacoes />} />
                <Route path="/app/operacoes/equipe" element={<EquipePerformance />} />
                <Route path="/app/operacoes/nova" element={<OperacaoForm />} />
                <Route path="/app/operacoes/:id" element={<OperacaoForm />} />
                <Route
                  path="/app/suporte"
                  element={<div className="p-8 font-semibold text-xl">Suporte</div>}
                />
                <Route path="/app/producao" element={<ProducaoDashboard />} />
                <Route path="/app/producao/monitoramento" element={<MonitoramentoList />} />
                <Route path="/app/producao/monitoramento/novo" element={<MonitoramentoForm />} />
                <Route path="/app/producao/monitoramento/:id" element={<MonitoramentoForm />} />
                <Route path="/app/producao/monitoramento" element={<MonitoramentoPragasMap />} />
                <Route
                  path="/app/producao/monitoramento/novo"
                  element={<MonitoramentoPragasForm />}
                />
                <Route
                  path="/app/producao/monitoramento/:id"
                  element={<MonitoramentoPragasForm />}
                />
                <Route path="/app/producao/colheita/novo" element={<ColheitaForm />} />
                <Route path="/app/equipamentos" element={<EquipamentoList />} />
                <Route path="/app/equipamentos/new" element={<EquipamentoForm />} />
                <Route path="/app/equipamentos/:id" element={<EquipamentoDetail />} />
                <Route path="/app/packing" element={<PackingDashboard />} />
                <Route path="/app/packing/estoque" element={<PackingDashboard />} />
                <Route
                  path="/app/exportacao"
                  element={<div className="p-8 font-semibold text-xl">Exportação</div>}
                />
                <Route
                  path="/app/financeiro"
                  element={<div className="p-8 font-semibold text-xl">Financeiro</div>}
                />
                <Route path="/app/financeiro/rentabilidade" element={<RentabilidadeList />} />
                <Route
                  path="/app/producao/colheita/rastreabilidade/:id"
                  element={<RastreabilidadeDetail />}
                />
                <Route
                  path="/app/rh"
                  element={<div className="p-8 font-semibold text-xl">RH</div>}
                />
                <Route
                  path="/app/frota"
                  element={<div className="p-8 font-semibold text-xl">Frota</div>}
                />
                <Route
                  path="/app/bi"
                  element={<div className="p-8 font-semibold text-xl">BI</div>}
                />
                <Route path="/app/auditoria-safras" element={<AuditoriaSafrasList />} />
                <Route path="/app/auditoria-safras/:id/relatorio" element={<RelatorioSafra />} />
                <Route path="/app/usuarios" element={<Usuarios />} />
                <Route path="/app/configuracoes" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
