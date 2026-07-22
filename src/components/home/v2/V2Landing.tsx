import { Link } from "@tanstack/react-router";
import { Compass, Calculator, Newspaper, BookOpen, Clock, Zap, Star, TrendingUp, ChevronRight, GitCompare, Box, Bot, Layers } from "lucide-react";
import { AI_TOOLS } from "../../../lib/data/tools";

export function V2Landing() {
  const topTools = [...AI_TOOLS].sort((a, b) => b.score - a.score).slice(0, 6);
  const trendingTools = [...AI_TOOLS].filter(t => ["ChatGPT", "Claude", "Midjourney", "Perplexity", "Cursor", "GitHub Copilot"].includes(t.name)).slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-8 w-full flex flex-col gap-10">
      {/* Header section */}
      <section className="pt-4 pb-2 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Good morning.
        </h1>
        <p className="text-muted-foreground mt-2">What would you like to do today?</p>
      </section>

      {/* Quick Actions (Phase 6) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <QuickActionButton to="/finder" icon={Compass} label="Find Best AI" color="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" />
        <QuickActionButton to="/compare" icon={GitCompare} label="Compare Models" color="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" />
        <QuickActionButton to="/calculator" icon={Calculator} label="Estimate Costs" color="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" />
        <QuickActionButton to="/rankings" icon={TrendingUp} label="Explore Trending" color="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" />
        <QuickActionButton to="/prompts" icon={BookOpen} label="Browse Prompts" color="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20" />
        <QuickActionButton to="/news" icon={Newspaper} label="Read AI News" color="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" />
      </section>

      {/* Spotify-style Discoverability Cards (Phase 3) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <DiscoverCard to="/finder" icon={Compass} label="Find Best AI Tool" color="bg-blue-500" />
        <DiscoverCard to="/compare" icon={GitCompare} label="Compare AI Models" color="bg-purple-500" />
        <DiscoverCard to="/rankings" icon={TrendingUp} label="Trending AI" color="bg-orange-500" />
        <DiscoverCard to="/news" icon={Newspaper} label="AI News" color="bg-cyan-500" />
        <DiscoverCard to="/prompts" icon={BookOpen} label="Prompt Library" color="bg-pink-500" />
        <DiscoverCard to="/calculator" icon={Calculator} label="Cost Calculator" color="bg-emerald-500" />
        <DiscoverCard to="/agents" icon={Bot} label="Agents" color="bg-indigo-500" />
        <DiscoverCard to="/stacks" icon={Box} label="Saved Tools" color="bg-rose-500" />
        <DiscoverCard to="/profile" icon={Star} label="Favorites" color="bg-amber-500" />
        <DiscoverCard to="/search" icon={Compass} label="Recent Searches" color="bg-slate-500" />
        <DiscoverCard to="/stacks" icon={Layers} label="Community Picks" color="bg-teal-500" />
        <DiscoverCard to="/finder" icon={Zap} label="Recommended" color="bg-fuchsia-500" />
      </section>

      {/* Recommended For You */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recommended for You</h2>
          <Link to="/finder" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {topTools.map(tool => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      {/* Trending Models */}
      <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending Models</h2>
          <Link to="/rankings" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            Live Leaderboard <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trendingTools.map(tool => (
            <ToolRowCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DiscoverCard({ to, icon: Icon, label, color }: { to: string, icon: any, label: string, color: string }) {
  return (
    <Link 
      to={to as any}
      className={`group relative overflow-hidden flex items-center gap-3 p-3 rounded-lg bg-card/60 hover:bg-card border border-border/50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md`}
    >
      <div className={`w-10 h-10 shrink-0 rounded shadow-inner grid place-items-center text-white ${color} bg-opacity-90`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-semibold leading-tight text-foreground group-hover:text-foreground/90">{label}</span>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${color}`} />
    </Link>
  );
}

function QuickActionButton({ to, icon: Icon, label, color }: { to: string, icon: any, label: string, color: string }) {
  return (
    <Link 
      to={to}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${color.replace('bg-', 'hover:border-').split(' ')[0]}`}
    >
      <div className={`w-12 h-12 rounded-full grid place-items-center mb-3 transition-colors ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-xs font-semibold text-center leading-tight text-foreground">{label}</span>
    </Link>
  );
}

function ToolCard({ tool }: { tool: any }) {
  return (
    <Link 
      to="/compare" 
      className="group relative flex flex-col p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-all overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
      
      <div 
        className="w-12 h-12 rounded-xl mb-4 grid place-items-center shadow-sm"
        style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
      >
        <Zap className="h-6 w-6" />
      </div>
      
      <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
        {tool.category}
      </p>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs mt-auto">
        <span className="font-medium">{tool.price}</span>
        <div className="flex items-center gap-1 text-brand">
          <Star className="h-3 w-3 fill-brand" /> {tool.score}
        </div>
      </div>
    </Link>
  );
}

function ToolRowCard({ tool }: { tool: any }) {
  return (
    <Link 
      to="/compare" 
      className="group flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:bg-accent transition-all"
    >
      <div 
        className="w-12 h-12 rounded-lg grid place-items-center shrink-0"
        style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
      >
        <TrendingUp className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-background border border-border grid place-items-center shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors">
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
