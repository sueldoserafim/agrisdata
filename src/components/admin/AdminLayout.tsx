import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Layers,
  Receipt,
  LifeBuoy,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const navItems = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { title: 'Empresas', path: '/admin/empresas', icon: Building2 },
  { title: 'Planos', path: '/admin/planos', icon: Layers },
  { title: 'Faturamento', path: '/admin/faturamento', icon: Receipt },
  { title: 'Suporte', path: '/admin/suporte', icon: LifeBuoy },
  { title: 'Configurações', path: '/admin/configuracoes', icon: Settings },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-muted/20">
        <Sidebar className="border-r">
          <SidebarHeader className="h-16 flex items-center px-4 border-b">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                S
              </div>
              Sigma SaaS
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full ml-2">
                Admin
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.path ||
                      (location.pathname.startsWith(item.path) && item.path !== '/admin')
                    }
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm overflow-hidden">
                <span className="font-medium truncate">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Super Admin</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0">
            <div className="font-medium text-muted-foreground capitalize">
              {location.pathname.split('/').filter(Boolean).join(' / ') || 'Admin Dashboard'}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
