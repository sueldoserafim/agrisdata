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

const allMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app', module: null },
  { icon: Factory, label: 'Produção', path: '/app/producao', module: 'producao' },
  { icon: Package, label: 'Packing', path: '/app/packing', module: 'packing' },
  { icon: Plane, label: 'Exportação', path: '/app/exportacao', module: 'exportacao' },
  { icon: DollarSign, label: 'Financeiro', path: '/app/financeiro', module: 'financeiro' },
  { icon: Users, label: 'RH', path: '/app/rh', module: 'rh' },
  { icon: Truck, label: 'Frota', path: '/app/frota', module: 'frota' },
  { icon: LineChart, label: 'BI', path: '/app/bi', module: 'bi' },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [modulos, setModulos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadModulos() {
      if (!user) return
      try {
        const { data: profile } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()

        if (profile?.empresa_id) {
          const { data: empresa } = await supabase
            .from('empresas')
            .select('modulos_habilitados')
            .eq('id', profile.empresa_id)
            .single()

          if (mounted && empresa) {
            setModulos(empresa.modulos_habilitados || [])
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadModulos()
    return () => {
      mounted = false
    }
  }, [user])

  const visibleMenuItems = allMenuItems.filter(
    (item) => item.module === null || modulos.includes(item.module),
  )

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
                    <Link to={item.path} className="flex items-center w-full">
                      <item.icon className={cn('size-5 mr-3', isActive ? 'text-primary' : '')} />
                      <span>{item.label}</span>
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
