import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Header } from '@/components/Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background overflow-hidden flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in bg-slate-50/50 dark:bg-background">
          <div className="mx-auto max-w-7xl w-full flex flex-col gap-4 md:gap-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
