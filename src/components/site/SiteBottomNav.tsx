import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Trophy, GitCompare, Layers, Bot, Terminal, Calculator } from "lucide-react";
import { useState } from "react";

export function SiteBottomNav() {
  const location = useLocation();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/finder", icon: Compass, label: "AI Finder" },
    { to: "/rankings", icon: Trophy, label: "Rankings" },
    { to: "/compare", icon: GitCompare, label: "Compare" },
    { to: "/stacks", icon: Layers, label: "Stacks" },
    { to: "/agents", icon: Bot, label: "Agents" },
    { to: "/prompts", icon: Terminal, label: "Prompts" },
    { to: "/calculator", icon: Calculator, label: "Cost Calculator" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-2 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => {
              setActiveTooltip(item.label);
              setTimeout(() => setActiveTooltip(null), 1500);
            }}
            className={`group relative flex flex-col items-center justify-center h-full flex-1 gap-1 transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={item.label}
          >
            <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:-translate-y-0.5"}`} />
            
            {/* Tooltip */}
            <span className={`absolute -top-11 rounded-md bg-accent/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-foreground shadow-elegant transition-all duration-200 ease-out whitespace-nowrap pointer-events-none border border-border/50 ${
              activeTooltip === item.label ? "scale-100 opacity-100" : "scale-95 opacity-0 lg:group-hover:scale-100 lg:group-hover:opacity-100"
            }`}>
              {item.label}
            </span>
            
            <span className="sr-only">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
