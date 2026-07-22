import { Link } from "@tanstack/react-router";
import { Heart, Search, ChevronDown } from "lucide-react";
import { OptimaLogo } from "../../site/OptimaLogo";

export function V3TopHeader() {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border/20 z-50 flex items-center justify-between px-4">
      {/* Logo Dropdown (Instagram Style) */}
      <Link to="/" className="flex items-center gap-1 group">
        <OptimaLogo className="h-6 w-6 mr-1" />
        <span className="font-bold text-lg tracking-tight">Optima</span>
        <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-foreground transition-colors" />
      </Link>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search" 
            className="hidden sm:block w-48 h-9 bg-accent rounded-lg pl-9 pr-3 text-sm border-none outline-none focus:ring-1 ring-border/50" 
          />
          <Search className="sm:absolute sm:left-3 sm:top-1/2 sm:-translate-y-1/2 h-6 w-6 sm:h-4 sm:w-4 text-foreground sm:text-muted-foreground" />
        </div>
        <button className="relative transition-transform active:scale-95">
          <Heart className="h-6 w-6 text-foreground stroke-2" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-background"></span>
        </button>
      </div>
    </div>
  );
}
