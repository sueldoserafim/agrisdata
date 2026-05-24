import { Outlet, Link } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 w-full border-b bg-slate-900 text-slate-50">
        <div className="container flex h-16 items-center px-4">
          <Link to="/admin" className="flex items-center space-x-2 font-semibold">
            SaaS Admin Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
