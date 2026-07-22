import { Link, useRouterState } from "@tanstack/react-router";
import { 
  Home, Compass, Trophy, GitCompare, Layers, Bot, Calculator, 
  BookOpen, Newspaper, GraduationCap, Star, Bookmark,
  MessageSquare, Settings, User
} from "lucide-react";
import { OptimaLogo } from "../../site/OptimaLogo";

const SIDEBAR_SECTIONS = [
  {
    title: "Discover",
    items: [
      { to: "/finder", label: "AI Finder", icon: Compass },
      { to: "/rankings", label: "Rankings", icon: Trophy },
      { to: "/compare", label: "Compare", icon: GitCompare },
    ]
  },
  {
    title: "Resources",
    items: [
      { to: "/prompts", label: "Prompt Library", icon: BookOpen },
      { to: "/news", label: "AI News", icon: Newspaper },
      { to: "/about", label: "Learning", icon: GraduationCap },
    ]
  },
  {
    title: "Workspace",
    items: [
      { to: "/profile", label: "Favorites", icon: Star },
      { to: "/stacks", label: "Saved Stacks", icon: Layers },
      { to: "/calculator", label: "Cost Calculator", icon: Calculator },
    ]
  },
  {
    title: "Community",
    items: [
      { to: "/feedback", label: "Reviews", icon: MessageSquare },
      { to: "/help", label: "Discussions", icon: Bot },
    ]
  }
];

export function V2Sidebar() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  return (
    <aside className="hidden md:flex flex-col w-64 h-dvh bg-background border-r border-border shrink-0 fixed top-0 left-0 z-40 overflow-y-auto">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-6 shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2.5">
          <OptimaLogo className="h-6 w-6" />
          <span className="font-sans text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0066ff] via-[#6600ff] to-[#b300ff]">
            Optima
          </span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-6">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 mb-2">
              {section.title}
            </h3>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-brand/10 text-brand" 
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-brand" : "text-muted-foreground/70"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Account / Bottom Section */}
      <div className="p-3 border-t border-border mt-auto">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <User className="h-4 w-4 text-muted-foreground/70" />
          Profile
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Settings className="h-4 w-4 text-muted-foreground/70" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
