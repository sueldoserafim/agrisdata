import { Search, Bell } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/patients': 'Patients',
  '/messages': 'Messages',
  '/appointments': 'Appointments',
  '/records': 'Medical Records',
  '/analytics': 'Analytics',
  '/billing': 'Billing & Plans',
  '/settings': 'Settings',
}

export function Header() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 lg:hidden" />
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-6 max-w-md">
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything here ..."
            className="w-full rounded-full bg-white pl-10 pr-4 shadow-sm border-0 focus-visible:ring-primary/20 h-11"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-warning ring-2 ring-background" />
          </button>

          <Avatar className="size-10 border border-border shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10"
              alt="Doctor"
            />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
