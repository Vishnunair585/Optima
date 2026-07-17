import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useAuth } from '../hooks/use-auth';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart, 
  Bug, 
  Lightbulb, 
  Activity,
  FileText,
  Newspaper
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/tools', label: 'AI Tools', icon: Activity },
  { to: '/admin/rankings', label: 'AI Rankings', icon: BarChart },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/support', label: 'Support', icon: FileText },
  { to: '/admin/bug-reports', label: 'Bug Reports', icon: Bug },
  { to: '/admin/feature-requests', label: 'Feature Requests', icon: Lightbulb },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/logs', label: 'Logs', icon: FileText },
];

function AdminLayout() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse-glow h-8 w-8 rounded-full bg-brand/30" />
      </div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-6xl font-bold text-destructive mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          You do not have permission to view this page. This area is restricted to administrators only.
        </p>
        <Link to="/" className="mt-8 rounded-full bg-brand px-6 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Hidden Admin Sidebar */}
      <aside className="w-64 flex-col border-r border-border bg-card/50 hidden md:flex">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <span className="font-display font-bold tracking-wider text-transparent bg-clip-text bg-gradient-brand">
            OPTIMA ADMIN
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {ADMIN_NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                  activeProps={{ className: 'bg-brand/10 text-brand' }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 md:hidden">
          <span className="font-bold text-brand">Admin Mode</span>
        </header>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
