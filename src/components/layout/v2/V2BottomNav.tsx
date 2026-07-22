import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, GitCompare, Calculator, User } from "lucide-react";

const BOTTOM_NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/finder", label: "Discover", icon: Compass },
  { to: "/compare", label: "Compare", icon: GitCompare },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/profile", label: "Profile", icon: User },
];

export function V2BottomNav() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t border-border z-40 px-2 pb-safe">
      <div className="flex items-center justify-around h-full">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-brand fill-brand/20" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? "text-brand" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
