import {
  LayoutDashboard,
  Factory,
  Package,
  Users,
  Truck,
  LineChart,
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
  CircleDollarSign,
  UserPlus,
  Sliders,
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
      { icon: Tractor, label: 'Safras', path: '/app/safras', module: 'cadastros' },
    ],
  },
  {
    icon: Database,
    label: 'Cadastros Base',
    subItems: [
      { icon: Users, label: 'Fornecedores', path: '/app/compras/fornecedores', module: 'estoque' },
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
      { icon: Wrench, label: 'Operações de Campo', path: '/app/operacoes', module: 'operacoes' },
      { icon: Cog, label: 'Produção', path: '/app/producao', module: 'producao' },
      { icon: Box, label: 'Packing', path: '/app/packing', module: 'packing' },
      { icon: Ship, label: 'Exportação', path: '/app/exportacao', module: 'exportacao' },
    ],
  },
  {
    icon: Briefcase,
    label: 'Gestão & BI',
    subItems: [
      {
        icon: CircleDollarSign,
        label: 'Financeiro',
        path: '/app/financeiro',
        module: 'financeiro',
      },
      { icon: UserPlus, label: 'RH', path: '/app/rh', module: 'rh' },
      { icon: Truck, label: 'Frota', path: '/app/frota', module: 'frota' },
      { icon: LineChart, label: 'BI', path: '/app/bi', module: 'bi' },
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
