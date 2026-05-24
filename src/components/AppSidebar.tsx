import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  LineChart,
  CreditCard,
  Settings,
  LogOut,
  Hexagon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patient', path: '/patients' },
  { icon: MessageSquare, label: 'Message', path: '/messages', badge: '120' },
  { icon: Calendar, label: 'Appointment', path: '/appointments' },
  { icon: FileText, label: 'Medical Record', path: '/records' },
  { icon: LineChart, label: 'Analytics', path: '/analytics' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Hexagon className="size-8 fill-primary text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">Xenityhealth</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    'h-11 px-4 text-base font-medium rounded-xl transition-all',
                    isActive
                      ? 'bg-blue-50 text-primary hover:bg-blue-50 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Link to={item.path} className="flex items-center w-full">
                    <item.icon className={cn('size-5 mr-3', isActive ? 'text-primary' : '')} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge className="bg-warning text-white rounded-full px-2 py-0.5 text-xs font-bold right-4">
                    {item.badge}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 px-4 text-base font-medium text-destructive hover:bg-red-50 hover:text-destructive rounded-xl transition-all group"
            >
              <button onClick={() => console.log('logout')}>
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
