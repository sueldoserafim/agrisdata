import { Search, Bell, LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 md:h-20 items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur shadow-sm transition-all">
      <div className="flex items-center gap-3 md:gap-4">
        <SidebarTrigger className="-ml-2 lg:hidden" />
        <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 md:gap-6 max-w-md">
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything here ..."
            className="w-full rounded-full bg-slate-100 dark:bg-slate-900 pl-10 pr-4 shadow-inner border-transparent focus-visible:ring-primary/20 h-10 transition-all focus:bg-white dark:focus:bg-slate-950"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="size-5 md:size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 md:size-10 border-2 border-primary/10 shadow-sm cursor-pointer hover:opacity-90 hover:scale-105 transition-all">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10"
                  alt={user?.email || 'User'}
                />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
