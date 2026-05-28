import {
  LayoutDashboard,
  Factory,
  BookOpen,
  Scale,
  TrendingUp,
  ThermometerSun,
  Package,
  Users,
  Truck,
  LineChart,
  Printer,
  Map,
  MapPin,
  Sprout,
  Leaf,
  Tractor,
  LifeBuoy,
  UserCog,
  ShoppingCart,
  Settings,
  Database,
  Bug,
  Briefcase,
  Warehouse,
  Boxes,
  FlaskConical,
  ClipboardList,
  FileText,
  CheckSquare,
  Calculator,
  ShoppingBag,
  ArrowDownToLine,
  Wrench,
  Cog,
  Box,
  Ship,
  Anchor,
  CircleDollarSign,
  Globe,
  RefreshCcw,
  UserPlus,
  Sliders,
  ShieldAlert,
  CloudRain,
  ExternalLink,
  Camera,
  Droplet,
  ShieldCheck,
  Recycle,
  Handshake,
} from 'lucide-react'

export type MenuItemRaw = {
  icon?: any
  label: string
  path?: string
  module?: string | null
  adminOnly?: boolean
  managerOnly?: boolean
  badge?: 'pendingApprovals'
  subItems?: MenuItemRaw[]
}

export const allMenuItems: MenuItemRaw[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app', module: null },
  {
    icon: Tractor,
    label: 'Agro',
    subItems: [
      { icon: Map, label: 'Fazendas', path: '/app/fazendas', module: 'cadastros' },
      { icon: MapPin, label: 'Talhões', path: '/app/talhoes', module: 'cadastros' },
      { icon: Sprout, label: 'Culturas', path: '/app/culturas', module: 'cadastros' },
      { icon: Leaf, label: 'Cultivares/Variedades', path: '/app/cultivares', module: 'cadastros' },
      { icon: Sprout, label: 'Lotes de Mudas', path: '/app/mudas', module: 'producao' },
      { icon: Sprout, label: 'Transplantios', path: '/app/transplantios', module: 'producao' },
      { icon: Leaf, label: 'Replantios', path: '/app/replantios', module: 'producao' },
      { icon: Tractor, label: 'Safras', path: '/app/safras', module: 'cadastros' },
      {
        icon: Bug,
        label: 'Monitoramento (MIP)',
        path: '/app/producao/monitoramento',
        module: 'producao',
      },
      {
        icon: FlaskConical,
        label: 'Análises de Solo',
        path: '/app/agronomia/analises-solo',
        module: 'cadastros',
      },
      {
        icon: ThermometerSun,
        label: 'Graus-Dia (GDA)',
        path: '/app/agronomia/gda',
        module: 'cadastros',
      },
      {
        icon: FlaskConical,
        label: 'Amostras de Qualidade',
        path: '/app/agronomia/amostras-qualidade',
        module: 'producao',
      },
      {
        icon: CloudRain,
        label: 'Pluviometria',
        path: '/app/agronomia/pluviometria',
        module: 'cadastros',
      },
    ],
  },
  {
    icon: Handshake,
    label: 'Cooperativa',
    subItems: [
      { icon: Users, label: 'Cooperados', path: '/app/compras/fornecedores', module: 'estoque' },
      {
        icon: FileText,
        label: 'Contratos',
        path: '/app/cooperativa/contratos',
        module: 'financeiro',
      },
      {
        icon: Box,
        label: 'Vincular Produção',
        path: '/app/cooperativa/vincular-pallets',
        module: 'packing',
      },
      {
        icon: Calculator,
        label: 'Conta Corrente',
        path: '/app/financeiro/produtores',
        module: 'financeiro',
      },
    ],
  },
  {
    icon: Database,
    label: 'Cadastros Base',
    subItems: [
      { icon: Users, label: 'Fornecedores', path: '/app/compras/fornecedores', module: 'estoque' },
      { icon: Briefcase, label: 'Vendedores', path: '/app/vendedores', module: null },
      { icon: Users, label: 'Clientes', path: '/app/clientes', module: null },
    ],
  },
  {
    icon: Package,
    label: 'Suprimentos & Estoque',
    subItems: [
      {
        icon: Warehouse,
        label: 'Almoxarifado',
        path: '/app/estoque/almoxarifado',
        module: 'estoque',
      },
      { icon: Boxes, label: 'Produtos', path: '/app/produtos', module: 'estoque' },
      { icon: FlaskConical, label: 'Insumos', path: '/app/insumos', module: 'estoque' },
      {
        icon: ClipboardList,
        label: 'Requisições Internas',
        path: '/app/estoque/requisicoes-internas',
        module: 'estoque',
      },
      {
        icon: ShoppingCart,
        label: 'Compras',
        subItems: [
          {
            icon: FileText,
            label: 'Solicitações',
            path: '/app/compras/requisicoes',
            module: 'estoque',
          },
          {
            icon: CheckSquare,
            label: 'Aprovações',
            path: '/app/compras/aprovacoes',
            module: 'estoque',
            managerOnly: true,
            badge: 'pendingApprovals',
          },
          { icon: Calculator, label: 'Cotações', path: '/app/compras/cotacoes', module: 'estoque' },
          { icon: ShoppingBag, label: 'Pedidos', path: '/app/compras/pedidos', module: 'estoque' },
          {
            icon: ArrowDownToLine,
            label: 'Recebimentos',
            path: '/app/compras/recebimentos/novo',
            module: 'estoque',
          },
        ],
      },
    ],
  },
  {
    icon: Factory,
    label: 'Operacional',
    subItems: [
      {
        icon: CheckSquare,
        label: 'Minhas Tarefas (Campo)',
        path: '/app/operacoes/minhas',
        module: 'operacoes',
      },
      { icon: Wrench, label: 'Painel de Operações', path: '/app/operacoes', module: 'operacoes' },
      {
        icon: BookOpen,
        label: 'Caderno de Campo (Digital)',
        path: '/app/operacoes/caderno',
        module: 'operacoes',
      },
      {
        icon: Users,
        label: 'Performance da Equipe',
        path: '/app/operacoes/equipe',
        module: 'operacoes',
      },
      { icon: Cog, label: 'Produção', path: '/app/producao', module: 'producao' },
      {
        icon: Scale,
        label: 'Balanço de Massa',
        path: '/app/producao/balanco-massas',
        module: 'producao',
      },
      {
        icon: ShieldAlert,
        label: 'Monitoramento (MIP)',
        path: '/app/producao/monitoramento',
        module: 'producao',
      },
      {
        icon: Tractor,
        label: 'Registro de Colheita',
        path: '/app/producao/colheita/novo',
        module: 'producao',
      },
      {
        icon: Box,
        label: 'Packing',
        subItems: [
          { icon: Box, label: 'Dashboard', path: '/app/packing', module: 'packing' },
          {
            icon: ArrowDownToLine,
            label: 'Recepção',
            path: '/app/packing/recepcao',
            module: 'packing',
          },
          { icon: Package, label: 'Pallets', path: '/app/packing/pallets', module: 'packing' },
          {
            icon: ClipboardList,
            label: 'Romaneios',
            path: '/app/packing/romaneios',
            module: 'packing',
          },
          {
            icon: Truck,
            label: 'Expedição & Carga',
            path: '/app/packing/carregamento',
            module: 'packing',
          },
          {
            icon: Printer,
            label: 'Etiquetas ZPL',
            path: '/app/packing/etiquetas',
            module: 'packing',
          },
        ],
        module: 'packing',
      },
      {
        icon: Ship,
        label: 'Exportação',
        module: 'exportacao',
        subItems: [
          { icon: Ship, label: 'Navios', path: '/app/exportacao/navios', module: 'exportacao' },
          { icon: Anchor, label: 'Portos', path: '/app/exportacao/portos', module: 'exportacao' },
          {
            icon: ClipboardList,
            label: 'Bookings',
            path: '/app/exportacao/bookings',
            module: 'exportacao',
          },
          {
            icon: Box,
            label: 'Containers',
            path: '/app/exportacao/containers',
            module: 'exportacao',
          },
          {
            icon: FileText,
            label: 'Invoices Exportação',
            path: '/app/exportacao/invoices',
            module: 'exportacao',
          },
          {
            icon: FileText,
            label: 'Documentos',
            path: '/app/exportacao/documentos',
            module: 'exportacao',
          },
          {
            icon: Box,
            label: 'Rolagem de Container',
            path: '/app/exportacao/rolagem',
            module: 'exportacao',
          },
        ],
      },
    ],
  },
  {
    icon: Briefcase,
    label: 'Gestão & BI',
    subItems: [
      {
        icon: CircleDollarSign,
        label: 'Financeiro',
        subItems: [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/app/financeiro',
            module: 'financeiro',
          },
          {
            icon: BookOpen,
            label: 'Plano de Contas',
            path: '/app/financeiro/plano-contas',
            module: 'financeiro',
          },
          {
            icon: Briefcase,
            label: 'Contas Bancárias',
            path: '/app/financeiro/contas',
            module: 'financeiro',
          },
          {
            icon: ClipboardList,
            label: 'Lançamentos',
            path: '/app/financeiro/lancamentos',
            module: 'financeiro',
          },
          {
            icon: RefreshCcw,
            label: 'Conciliação Bancária',
            path: '/app/financeiro/conciliacao',
            module: 'financeiro',
          },
          {
            icon: Users,
            label: 'C/C Produtores',
            path: '/app/financeiro/produtores',
            module: 'financeiro',
          },
          {
            icon: Globe,
            label: 'Adiantamentos (Intl)',
            path: '/app/financeiro/adiantamentos',
            module: 'financeiro',
          },
          {
            icon: LineChart,
            label: 'Rentabilidade de Lotes',
            path: '/app/financeiro/rentabilidade',
            module: 'financeiro',
          },
          {
            icon: BookOpen,
            label: 'Account Sales',
            path: '/app/financeiro/account-sales',
            module: 'financeiro',
          },
          {
            icon: Box,
            label: 'Histórico Container',
            path: '/app/financeiro/historico-container',
            module: 'financeiro',
          },
          {
            icon: Calculator,
            label: 'Simulador de Preços',
            path: '/app/financeiro/formacao-preco',
            module: 'financeiro',
          },
        ],
        module: 'financeiro',
      },
      {
        icon: UserPlus,
        label: 'RH',
        module: 'rh',
        subItems: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/app/rh' },
          { icon: MapPin, label: 'Bater Ponto', path: '/app/rh/ponto' },
          { icon: FileText, label: 'Férias & Afastamentos', path: '/app/rh/ferias' },
          { icon: CircleDollarSign, label: 'Folha de Pagamento', path: '/app/rh/folha' },
          { icon: ShieldAlert, label: 'Controle de EPIs', path: '/app/rh/epis' },
        ],
      },
      {
        icon: Truck,
        label: 'Frota',
        module: 'frota',
        subItems: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/app/frota' },
          { icon: Truck, label: 'Veículos', path: '/app/frota/veiculos' },
          { icon: Map, label: 'Viagens', path: '/app/frota/viagens' },
          { icon: Wrench, label: 'Manutenções', path: '/app/frota/manutencoes' },
          { icon: Droplet, label: 'Abastecimentos', path: '/app/frota/abastecimentos' },
        ],
      },
      {
        icon: Box,
        label: 'Patrimônio',
        module: 'patrimonio',
        subItems: [
          { icon: LayoutDashboard, label: 'Inventário', path: '/app/patrimonio' },
          { icon: Camera, label: 'Scanner QR', path: '/app/patrimonio/scanner' },
        ],
      },
      { icon: LineChart, label: 'Desempenho (Safras)', path: '/app/performance', module: 'bi' },
      { icon: TrendingUp, label: 'Tendências', path: '/app/performance/tendencias', module: 'bi' },
      { icon: LineChart, label: 'BI', path: '/app/bi', module: 'bi' },
      {
        icon: ClipboardList,
        label: 'Auditoria de Safras',
        path: '/app/auditoria-safras',
        module: null,
        managerOnly: true,
      },
    ],
  },
  {
    icon: Leaf,
    label: 'Sustentabilidade & Compliance',
    subItems: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/app/sustentabilidade', module: null },
      {
        icon: ShieldCheck,
        label: 'Certificações',
        path: '/app/sustentabilidade/certificacoes',
        module: null,
      },
      {
        icon: ShieldAlert,
        label: 'Não Conformidades',
        path: '/app/sustentabilidade/ncs',
        module: null,
      },
      {
        icon: CloudRain,
        label: 'Emissões de Carbono',
        path: '/app/sustentabilidade/emissoes',
        module: null,
      },
      {
        icon: Recycle,
        label: 'Gestão de Resíduos',
        path: '/app/sustentabilidade/residuos',
        module: null,
      },
    ],
  },
  {
    icon: Settings,
    label: 'Configurações',
    subItems: [
      { icon: UserCog, label: 'Usuários', path: '/app/usuarios', module: null, adminOnly: true },
      {
        icon: Sliders,
        label: 'Configurações do Sistema',
        path: '/app/configuracoes',
        module: null,
        adminOnly: true,
      },
      {
        icon: Globe,
        label: 'Portais Externos',
        path: '/app/configuracoes/portais',
        module: null,
        adminOnly: true,
      },
      { icon: LifeBuoy, label: 'Suporte', path: '/app/suporte', module: 'suporte' },
    ],
  },
]

export function filterMenu(
  items: MenuItemRaw[],
  isAdmin: boolean,
  isManager: boolean,
  modulos: string[],
): MenuItemRaw[] {
  return items
    .map((item) => {
      if (item.subItems) {
        return { ...item, subItems: filterMenu(item.subItems, isAdmin, isManager, modulos) }
      }
      return item
    })
    .filter((item) => {
      if (item.adminOnly && !isAdmin) return false
      if (item.managerOnly && !isManager) return false

      if (item.subItems) {
        return item.subItems.length > 0
      }

      if (item.module) {
        return isAdmin || modulos.includes(item.module)
      }

      return true
    })
}

export const isPathActive = (itemPath: string, currentPath: string) => {
  if (itemPath === '/app') return currentPath === '/app'
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
}

export const isItemActive = (item: MenuItemRaw, currentPath: string): boolean => {
  if (item.path && isPathActive(item.path, currentPath)) return true
  if (item.subItems) {
    return item.subItems.some((sub) => isItemActive(sub, currentPath))
  }
  return false
}
