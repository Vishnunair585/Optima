import { Link, useRouterState } from "@tanstack/react-router";
import { 
  Home, Search, Compass, MessageSquare, Heart, PlusSquare, 
  User, Menu, GitCompare
} from "lucide-react";
import { OptimaLogo } from "../../site/OptimaLogo";

const SIDEBAR_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/finder", label: "Search", icon: Search },
  { to: "/compare", label: "Compare", icon: GitCompare },
  { to: "/rankings", label: "Rankings", icon: Compass },
  { to: "/help", label: "Messages", icon: MessageSquare },
  { to: "/news", label: "Notifications", icon: Heart },
  { to: "/stacks", label: "Create", icon: PlusSquare },
  { to: "/profile", label: "Profile", icon: User },
];

export function V3Sidebar() {
  const routerState = useRouterState();

  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-dvh w-[72px] lg:w-64 border-r border-border/20 bg-background pt-8 pb-5 px-3 lg:px-4 z-50 transition-all">
      {/* Logo */}
      <div className="mb-8 lg:mb-10 px-3 flex items-center justify-center lg:justify-start">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <OptimaLogo className="h-6 w-6" />
          <span className="hidden lg:block font-bold text-xl tracking-tight">Optima</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = routerState.location.pathname === item.to || 
                           (item.to !== "/" && routerState.location.pathname.startsWith(item.to));
          
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className={`group flex items-center lg:justify-start justify-center gap-4 p-3 rounded-lg text-base transition-all hover:bg-accent ${
                isActive ? "font-bold text-foreground" : "text-foreground font-normal hover:scale-105 active:scale-95"
              }`}
            >
              <item.icon className={`h-6 w-6 shrink-0 transition-transform ${isActive ? "stroke-[2.5px]" : "stroke-2 group-hover:scale-110"}`} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* More Button */}
      <div className="mt-auto w-full">
        <button className="w-full group flex items-center lg:justify-start justify-center gap-4 p-3 rounded-lg text-base transition-all hover:bg-accent text-foreground hover:scale-105 active:scale-95">
          <Menu className="h-6 w-6 shrink-0 stroke-2 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:block">More</span>
        </button>
      </div>
    </div>
  );
}
