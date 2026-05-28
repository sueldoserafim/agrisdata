import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Hexagon, Loader2, ChevronRight } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  allMenuItems,
  filterMenu,
  isItemActive,
  isPathActive,
  MenuItemRaw,
} from '@/lib/menu-config'

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  const [modulos, setModulos] = useState<string[]>([])
  const [perfil, setPerfil] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState(0)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

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
        if (mounted && profile) setPerfil(profile.perfil)

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

          if (mounted && ['admin', 'admin_saas', 'gerente'].includes(profile.perfil || '')) {
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
  const visibleMenuItems = useMemo(() => {
    const items = filterMenu(allMenuItems, isAdmin, isManager, modulos)
    const hasVacaria = items.some((i) => i.label === 'Vacaria')
    if (!hasVacaria) {
      items.push({
        label: 'Vacaria',
        icon: Hexagon,
        subItems: [
          { label: 'Dashboard', path: '/app/vacaria' },
          { label: 'Rebanho', path: '/app/vacaria/rebanho' },
          { label: 'Produção', path: '/app/vacaria/producao' },
          { label: 'Reprodução', path: '/app/vacaria/reproducao' },
          { label: 'Saúde', path: '/app/vacaria/saude' },
        ],
      })
    }
    return items
  }, [isAdmin, isManager, modulos])

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev }
      let changed = false
      const checkGroups = (items: MenuItemRaw[]) => {
        items.forEach((item) => {
          if (item.subItems) {
            if (isItemActive(item, location.pathname) && !next[item.label]) {
              next[item.label] = true
              changed = true
            }
            checkGroups(item.subItems)
          }
        })
      }
      checkGroups(visibleMenuItems)
      return changed ? next : prev
    })
  }, [location.pathname, visibleMenuItems])

  const renderMenuItem = (item: MenuItemRaw, depth = 0) => {
    const isActive = isItemActive(item, location.pathname)
    const isLeafActive = item.path ? isPathActive(item.path, location.pathname) : false

    if (item.subItems) {
      const InnerCollapsible = (
        <Collapsible
          key={item.label}
          open={openGroups[item.label] || false}
          onOpenChange={(open) => setOpenGroups((prev) => ({ ...prev, [item.label]: open }))}
          className={cn(depth === 0 ? 'group/collapsible' : 'group/collapsible-sub')}
        >
          <CollapsibleTrigger asChild>
            {depth === 0 ? (
              <SidebarMenuButton
                tooltip={item.label}
                isActive={isActive && !openGroups[item.label]}
                className={cn(
                  'h-11 px-4 text-base font-medium rounded-xl transition-all',
                  isActive && !openGroups[item.label]
                    ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.icon && <item.icon className="size-5 mr-3" />}
                <span>{item.label}</span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuSubButton isActive={isActive && !openGroups[item.label]}>
                {item.icon && <item.icon className="size-4 mr-2" />}
                <span>{item.label}</span>
                <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible-sub:rotate-90" />
              </SidebarMenuSubButton>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => renderMenuItem(subItem, depth + 1))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )
      return depth === 0 ? (
        <SidebarMenuItem key={item.label}>{InnerCollapsible}</SidebarMenuItem>
      ) : (
        <SidebarMenuSubItem key={item.label}>{InnerCollapsible}</SidebarMenuSubItem>
      )
    }

    const LeafContent = (
      <Link to={item.path || '#'}>
        {item.icon && <item.icon className={depth === 0 ? 'size-5 mr-3' : 'size-4 mr-2'} />}
        <span>{item.label}</span>
        {item.badge === 'pendingApprovals' && pendingApprovals > 0 && (
          <div className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto animate-fade-in flex items-center justify-center">
            {pendingApprovals}
          </div>
        )}
      </Link>
    )

    if (depth === 0) {
      return (
        <SidebarMenuItem key={item.path || item.label}>
          <SidebarMenuButton
            asChild
            isActive={isLeafActive}
            tooltip={item.label}
            className={cn(
              'h-11 px-4 text-base font-medium rounded-xl transition-all',
              isLeafActive
                ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {LeafContent}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuSubItem key={item.path || item.label}>
        <SidebarMenuSubButton asChild isActive={isLeafActive}>
          {LeafContent}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-xl lg:shadow-none">
      <SidebarHeader className="p-4 md:p-6 border-b border-sidebar-border/50 bg-slate-50/30 dark:bg-slate-900/10">
        <Link
          to="/app"
          className="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity"
        >
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg p-1.5 shadow-md">
            <Hexagon className="size-6 md:size-7 fill-white text-white" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">AgriSaaS</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-primary size-6" />
          </div>
        ) : (
          <SidebarMenu className="gap-2">
            {visibleMenuItems.map((item) => renderMenuItem(item))}
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50 bg-slate-50/30 dark:bg-slate-900/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 px-4 text-sm md:text-base font-medium text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-destructive rounded-xl transition-all group cursor-pointer"
            >
              <button onClick={signOut} className="w-full flex justify-start items-center">
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
