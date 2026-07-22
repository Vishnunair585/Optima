import { Link } from "@tanstack/react-router";
import { useAuth } from "../../../hooks/use-auth";
import { AI_TOOLS } from "../../../lib/data/tools";
import { UserCircle } from "lucide-react";

export function V3RightSidebar() {
  const { user } = useAuth();
  const suggestedTools = [...AI_TOOLS].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div className="hidden lg:block w-[320px] pt-12 pr-4 sticky top-0 h-dvh overflow-y-auto hide-scrollbar">
      {/* Current User */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/profile" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-full bg-accent border border-border/50 grid place-items-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserCircle className="h-full w-full text-muted-foreground/50 p-1" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-muted-foreground transition-colors">
              {user?.displayName?.replace(/\s+/g, '_').toLowerCase() || "optimist_user"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.displayName || "Optima User"}
            </p>
          </div>
        </Link>
        <button className="text-xs font-semibold text-brand hover:text-brand/80">Switch</button>
      </div>

      {/* Suggested for you */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-muted-foreground">Suggested for you</p>
        <Link to="/finder" className="text-xs font-semibold hover:text-muted-foreground">See All</Link>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {suggestedTools.map((tool) => (
          <div key={tool.name} className="flex items-center justify-between">
            <Link to="/compare" className="flex items-center gap-3 group overflow-hidden">
              <div className="h-8 w-8 rounded-full border border-border/50 grid place-items-center shrink-0" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                {tool.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-muted-foreground transition-colors">{tool.name.toLowerCase()}_ai</p>
                <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
              </div>
            </Link>
            <button className="text-xs font-semibold text-brand hover:text-brand/80 ml-2">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground/60 leading-relaxed max-w-[280px]">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          <Link to="/" className="hover:underline">About</Link>
          <Link to="/" className="hover:underline">Help</Link>
          <Link to="/" className="hover:underline">Press</Link>
          <Link to="/" className="hover:underline">API</Link>
          <Link to="/" className="hover:underline">Jobs</Link>
          <Link to="/" className="hover:underline">Privacy</Link>
          <Link to="/" className="hover:underline">Terms</Link>
          <Link to="/" className="hover:underline">Locations</Link>
          <Link to="/" className="hover:underline">Language</Link>
        </div>
        <p>© 2026 OPTIMA FROM MAKERS</p>
      </div>
    </div>
  );
}
