import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, GitCompare, PlusSquare, UserCircle } from "lucide-react";
import { useAuth } from "../../../hooks/use-auth";

const BOTTOM_NAV_ITEMS = [
  { to: "/", icon: Home },
  { to: "/finder", icon: Compass },
  { to: "/stacks", icon: PlusSquare },
  { to: "/compare", icon: GitCompare },
];

export function V3BottomNav() {
  const routerState = useRouterState();
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background border-t border-border/20 z-50 flex items-center justify-between px-6 pb-safe">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = routerState.location.pathname === item.to || 
                         (item.to !== "/" && routerState.location.pathname.startsWith(item.to));
        
        return (
          <Link
            key={item.to}
            to={item.to as any}
            className="flex flex-col items-center justify-center h-full w-12 transition-transform active:scale-95"
          >
            <item.icon className={`h-6 w-6 ${isActive ? "stroke-[2.5px] text-foreground" : "stroke-2 text-muted-foreground"}`} />
          </Link>
        );
      })}

      {/* Profile Icon (Special Case) */}
      <Link
        to="/profile"
        className="flex flex-col items-center justify-center h-full w-12 transition-transform active:scale-95"
      >
        <div className={`h-7 w-7 rounded-full overflow-hidden ${routerState.location.pathname.startsWith("/profile") ? "border-[2px] border-foreground p-[1px]" : "border border-border/50"}`}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover rounded-full" />
          ) : (
            <UserCircle className="h-full w-full text-muted-foreground bg-accent" />
          )}
        </div>
      </Link>
    </div>
  );
}
