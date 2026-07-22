import { createFileRoute } from '@tanstack/react-router'

import { useState } from "react";
import { Trophy, Star, TrendingUp, Crown, Medal, TrendingDown, Sparkles, Info, X } from "lucide-react";
import { getToolsFn } from "../lib/api/tools.functions";

import { ProtectedRoute } from "../components/auth/route-guard";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Dynamic AI Rankings — Optima" },
      { name: "description", content: "Live leaderboards of the best AI tools by category, computed dynamically." },
    ],
    links: [{ rel: "canonical", href: "/rankings" }],
  }),
  loader: async () => {
    const tools = await getToolsFn();
    return { tools };
  },
  component: () => (
    <ProtectedRoute>
      <RankingsPage />
    </ProtectedRoute>
  ),
});

function RankingsPage() {
  const { tools: dbTools } = Route.useLoaderData();
  const [cat, setCat] = useState<string>("All");
  const [showMethodology, setShowMethodology] = useState(false);
  
  const categories = Array.from(new Set(dbTools.map(t => t.category)));
  
  const list = (cat === "All" ? dbTools : dbTools.filter((t) => t.category === cat))
    .slice()
    .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0));
    
  const hasPodium = list.length >= 3;
  const podium = hasPodium ? list.slice(0, 3) : [];
  const rest = hasPodium ? list.slice(3) : list;
  const restStartIndex = hasPodium ? 4 : 1;

  function renderTrend(trend: string) {
    switch(trend) {
      case 'rising': return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded"><TrendingUp className="h-3 w-3" /> Rising</span>;
      case 'declining': return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded"><TrendingDown className="h-3 w-3" /> Declining</span>;
      case 'new': return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded"><Sparkles className="h-3 w-3" /> New</span>;
      case 'hot': return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded"><Star className="h-3 w-3 fill-orange-500" /> Hot</span>;
      default: return null;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Dynamic Leaderboard</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">AI Rankings</h1>
        <p className="mt-3 text-muted-foreground">Computed dynamically using our Market Intelligence Engine.</p>
        
        <div className="mt-4 flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-card px-2 py-1 rounded border border-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Data Pipeline
          </span>
          <span>Last computed: {new Date().toLocaleTimeString()}</span>
          <button onClick={() => setShowMethodology(true)} className="flex items-center gap-1 text-brand hover:underline">
            <Info className="h-3.5 w-3.5" /> Methodology
          </button>
        </div>
      </header>

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowMethodology(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Info className="h-5 w-5 text-brand" /> Ranking Methodology</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our rankings are strictly data-driven. We do not accept payment for placement. The dynamic engine computes scores using a weighted algorithm:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center bg-muted p-2 rounded"><span className="font-medium">User Reviews & Sentiment</span> <span className="font-mono text-brand">40%</span></li>
              <li className="flex justify-between items-center bg-muted p-2 rounded"><span className="font-medium">Growth & Feature Velocity</span> <span className="font-mono text-brand">30%</span></li>
              <li className="flex justify-between items-center bg-muted p-2 rounded"><span className="font-medium">Market Popularity</span> <span className="font-mono text-brand">20%</span></li>
              <li className="flex justify-between items-center bg-muted p-2 rounded"><span className="font-medium">Reliability & Uptime</span> <span className="font-mono text-brand">10%</span></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              All data is validated against multiple official sources.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-10 w-full sm:w-64 rounded-xl border border-border bg-card/40 px-3 text-sm focus:border-brand outline-none transition-all"
        >
          {["All", ...categories].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {podium.length === 3 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[1, 0, 2].map((idx, pos) => {
            const t = podium[idx];
            const ranks = [
              { icon: Medal, label: "2nd", height: "h-56", grad: "from-[oklch(0.75_0.04_270)] to-[oklch(0.6_0.04_270)]" },
              { icon: Crown, label: "1st", height: "h-72", grad: "from-[oklch(0.72_0.2_295)] to-[oklch(0.78_0.18_340)]" },
              { icon: Medal, label: "3rd", height: "h-52", grad: "from-[oklch(0.7_0.12_60)] to-[oklch(0.55_0.12_40)]" },
            ][pos];
            const CardWrapper = t.website_url ? "a" : "div";
            return (
              <CardWrapper
                {...(t.website_url ? { href: t.website_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                key={t.name}
                className={`relative block flex ${ranks.height} flex-col justify-end overflow-hidden rounded-3xl glass-strong p-6 transition-transform hover:scale-[1.02] ${pos === 1 ? "ring-brand" : ""} text-foreground no-underline`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ranks.grad} opacity-20`} />
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-30" style={{ background: t.color }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br ${ranks.grad} px-2.5 py-1 text-xs font-medium text-brand-foreground shadow-glow`}>
                      <ranks.icon className="h-3 w-3" /> {ranks.label}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-3xl font-bold tabular-nums">{Number(t.overall_score).toFixed(1)}</span>
                      {renderTrend(t.trend_indicator)}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.vendor} · {t.category}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-brand transition-all duration-1000" style={{ width: `${t.overall_score}%` }} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    {t.website_url ? (
                      <span className="inline-flex h-8 items-center justify-center rounded-full bg-brand/20 px-4 text-xs font-medium text-brand hover:bg-brand/30 transition-colors">
                        Visit ↗
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">
                        You can search this AI tool
                      </span>
                    )}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-2xl glass">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-[40px_1fr_120px_100px_100px_140px] items-center gap-4 border-b border-border px-6 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <span>#</span><span>Tool</span><span className="hidden sm:block">Category</span><span>Price</span><span>Trend</span><span>Overall</span>
            </div>
            {rest.map((t, i) => {
              const RowWrapper = t.website_url ? "a" : "div";
              return (
                <RowWrapper
                  {...(t.website_url ? { href: t.website_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  key={t.name}
                  className="grid grid-cols-[40px_1fr_120px_100px_100px_140px] items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 hover:bg-accent/40 block text-foreground hover:text-foreground no-underline"
                >
                  <span className="font-mono text-sm text-muted-foreground">{String(i + restStartIndex).padStart(2, "0")}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${t.color}30`, color: t.color }}>
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.vendor}</p>
                    </div>
                  </div>
                  <span className="hidden sm:block text-sm text-muted-foreground">{t.category}</span>
                  <span className="text-sm text-foreground">{t.price}</span>
                  <div>
                    {renderTrend(t.trend_indicator)}
                  </div>
                  <div className="flex flex-col items-end justify-center w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-gradient-brand" style={{ width: `${t.overall_score}%` }} />
                      </div>
                      <span className="w-8 font-mono text-sm tabular-nums font-bold">{Number(t.overall_score).toFixed(1)}</span>
                    </div>
                    {!t.website_url && (
                      <span className="text-[9px] text-muted-foreground italic mt-1 w-full text-right">You can search this AI tool</span>
                    )}
                  </div>
                </RowWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
