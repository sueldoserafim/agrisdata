import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Factory,
  Package,
  Plane,
  DollarSign,
  Users,
  Truck,
  LineChart,
  LogOut,
  Hexagon,
  Loader2,
  Map,
  MapPin,
  Sprout,
  Leaf,
  Tractor,
  LifeBuoy,
  UserCog,
  ShoppingCart,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle } from 'lucide-react'

const allMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app', module: null },
  { icon: Map, label: 'Fazendas', path: '/app/fazendas', module: 'cadastros' },
  { icon: MapPin, label: 'Talhões', path: '/app/talhoes', module: 'cadastros' },
  { icon: Sprout, label: 'Culturas', path: '/app/culturas', module: 'cadastros' },
  { icon: Leaf, label: 'Cultivares/Variedades', path: '/app/cultivares', module: 'cadastros' },
  { icon: Package, label: 'Produtos e Insumos', path: '/app/produtos', module: 'estoque' },
  {
    icon: ShoppingCart,
    label: 'Solicitações de Compra',
    path: '/app/compras/requisicoes',
    module: 'estoque',
  },
  {
    icon: CheckCircle,
    label: 'Aprovações',
    path: '/app/compras/aprovacoes',
    module: 'estoque',
    managerOnly: true,
  },
  { icon: Tractor, label: 'Operações de Campo', path: '/app/operacoes', module: 'operacoes' },
  { icon: Factory, label: 'Produção', path: '/app/producao', module: 'producao' },
  { icon: Package, label: 'Packing', path: '/app/packing', module: 'packing' },
  { icon: Plane, label: 'Exportação', path: '/app/exportacao', module: 'exportacao' },
  { icon: DollarSign, label: 'Financeiro', path: '/app/financeiro', module: 'financeiro' },
  { icon: Users, label: 'RH', path: '/app/rh', module: 'rh' },
  { icon: Truck, label: 'Frota', path: '/app/frota', module: 'frota' },
  { icon: LineChart, label: 'BI', path: '/app/bi', module: 'bi' },
  { icon: LifeBuoy, label: 'Suporte', path: '/app/suporte', module: 'suporte' },
  { icon: UserCog, label: 'Usuários', path: '/app/usuarios', module: null, adminOnly: true },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [modulos, setModulos] = useState<string[]>([])
  const [perfil, setPerfil] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState(0)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id, perfil')
          .eq('id', user.id)
          .single()

        if (mounted && profile) {
          setPerfil(profile.perfil)
        }

        if (profile?.empresa_id) {
          const { data: empresa } = await supabase
            .from('empresas')
            .select('modulos_habilitados')
            .eq('id', profile.empresa_id)
            .single()

          if (mounted && empresa) {
            const loadedModulos = empresa.modulos_habilitados || []
            setModulos(loadedModulos.length > 0 ? loadedModulos : ['dashboard'])
          }

          if (
            mounted &&
            (profile.perfil === 'admin' ||
              profile.perfil === 'admin_saas' ||
              profile.perfil === 'gerente')
          ) {
            const { count } = await supabase
              .from('compras_requisicao')
              .select('*', { count: 'exact', head: true })
              .eq('empresa_id', profile.empresa_id)
              .eq('status', 'pendente')

            if (count) setPendingApprovals(count)

            const channel = supabase
              .channel('requisicoes_pendentes')
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'compras_requisicao',
                  filter: `empresa_id=eq.${profile.empresa_id}`,
                },
                (payload) => {
                  if (payload.new.status === 'pendente') {
                    toast({
                      title: 'Nova Aprovação Pendente',
                      description: `A requisição ${payload.new.numero_requisicao} precisa de aprovação.`,
                    })
                    setPendingApprovals((prev) => prev + 1)
                  }
                },
              )
              .subscribe()

            return () => {
              supabase.removeChannel(channel)
            }
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    const cleanup = loadData()
    return () => {
      mounted = false
      cleanup.then((fn) => fn && fn())
    }
  }, [user, toast])

  const isAdmin = perfil === 'admin' || perfil === 'admin_saas'
  const isManager = isAdmin || perfil === 'gerente'

  const visibleMenuItems = allMenuItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    if (item.managerOnly && !isManager) return false
    return isAdmin || item.module === null || modulos.includes(item.module)
  })

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6">
        <Link to="/app" className="flex items-center gap-2 text-primary">
          <Hexagon className="size-8 fill-primary text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">AgriSaaS</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-primary size-6" />
          </div>
        ) : (
          <SidebarMenu className="gap-2">
            {visibleMenuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/app' && location.pathname.startsWith(item.path))
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      'h-11 px-4 text-base font-medium rounded-xl transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Link to={item.path} className="flex items-center w-full justify-between">
                      <div className="flex items-center">
                        <item.icon className={cn('size-5 mr-3', isActive ? 'text-primary' : '')} />
                        <span>{item.label}</span>
                      </div>
                      {item.path === '/app/compras/aprovacoes' && pendingApprovals > 0 && (
                        <div className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center animate-fade-in">
                          {pendingApprovals}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 px-4 text-base font-medium text-destructive hover:bg-red-50 hover:text-destructive rounded-xl transition-all group cursor-pointer"
            >
              <button onClick={signOut}>
                <LogOut className="size-5 mr-3 group-hover:scale-110 transition-transform" />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
