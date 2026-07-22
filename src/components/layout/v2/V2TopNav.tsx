import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ChevronRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../../../hooks/use-auth";
import { GlobalSearch } from "../../ui/v2/GlobalSearch";

export function V2TopNav() {
  const router = useRouterState();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = router.location.pathname;

  // Simple breadcrumb generator
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const to = `/${paths.slice(0, index + 1).join("/")}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    return { to, label };
  });

  return (
    <>
      <header className="h-14 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        {/* Left side: Breadcrumbs (Desktop) or Logo (Mobile - handled in layout maybe, but let's do breadcrumbs) */}
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground shrink-0 hidden md:block">
            Home
          </Link>
          {breadcrumbs.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 hidden md:block" />}
          
          <div className="flex items-center gap-2 truncate md:flex-row flex-row">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.to} className="flex items-center gap-2 shrink-0">
                <Link 
                  to={crumb.to} 
                  className={`text-sm font-medium hover:text-foreground truncate max-w-[120px] sm:max-w-xs ${i === breadcrumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {crumb.label}
                </Link>
                {i < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
              </div>
            ))}
          </div>
          {breadcrumbs.length === 0 && <span className="text-sm font-medium text-foreground md:hidden block">Optima</span>}
        </div>

        {/* Right side: Search & Profile */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-full bg-accent/50 hover:bg-accent border border-border/50 text-muted-foreground text-sm transition-colors md:w-64"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:block flex-1 text-left">Search anything...</span>
            <span className="hidden md:flex items-center justify-center w-5 h-5 rounded bg-background border border-border text-[10px] font-medium font-mono shrink-0">/</span>
          </button>

          {user ? (
            <Link to="/profile" className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-[10px] font-bold text-brand-foreground shadow-glow overflow-hidden border border-border shrink-0">
              {user.avatar && user.avatar.startsWith('data:') ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase()}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="h-8 inline-flex items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background shrink-0 hover:bg-foreground/90 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </header>
      
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
