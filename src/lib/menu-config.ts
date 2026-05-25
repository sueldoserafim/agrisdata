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
      { label: 'Almoxarifado', path: '/app/estoque/almoxarifado', module: 'estoque' },
      { label: 'Produtos', path: '/app/produtos', module: 'estoque' },
      { label: 'Insumos', path: '/app/insumos', module: 'estoque' },
      {
        label: 'Requisições Internas',
        path: '/app/estoque/requisicoes-internas',
        module: 'estoque',
      },
      {
        icon: ShoppingCart,
        label: 'Compras',
        subItems: [
          { label: 'Solicitações', path: '/app/compras/requisicoes', module: 'estoque' },
          {
            label: 'Aprovações',
            path: '/app/compras/aprovacoes',
            module: 'estoque',
            managerOnly: true,
            badge: 'pendingApprovals',
          },
          { label: 'Cotações', path: '/app/compras/cotacoes', module: 'estoque' },
          { label: 'Pedidos', path: '/app/compras/pedidos', module: 'estoque' },
          { label: 'Recebimentos', path: '/app/compras/recebimentos/novo', module: 'estoque' },
        ],
      },
    ],
  },
  {
    icon: Factory,
    label: 'Operacional',
    subItems: [
      { label: 'Operações de Campo', path: '/app/operacoes', module: 'operacoes' },
      { label: 'Produção', path: '/app/producao', module: 'producao' },
      { label: 'Packing', path: '/app/packing', module: 'packing' },
      { label: 'Exportação', path: '/app/exportacao', module: 'exportacao' },
    ],
  },
  {
    icon: Briefcase,
    label: 'Gestão & BI',
    subItems: [
      { label: 'Financeiro', path: '/app/financeiro', module: 'financeiro' },
      { label: 'RH', path: '/app/rh', module: 'rh' },
      { label: 'Frota', path: '/app/frota', module: 'frota' },
      { label: 'BI', path: '/app/bi', module: 'bi' },
    ],
  },
  {
    icon: Settings,
    label: 'Configurações',
    subItems: [
      { label: 'Usuários', path: '/app/usuarios', module: null, adminOnly: true },
      {
        label: 'Configurações do Sistema',
        path: '/app/configuracoes',
        module: null,
        adminOnly: true,
      },
      { label: 'Suporte', path: '/app/suporte', module: 'suporte' },
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
