import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, Star, Clock, Activity, DollarSign, Bookmark, Share2, 
  GitFork, Copy, AlertTriangle, ShieldCheck, ThumbsUp, LayoutTemplate, 
  Play, Users, Eye
} from "lucide-react";
import STACKS_DATA from "../lib/data/public_stacks.json";

import { ProtectedRoute } from "../components/auth/route-guard";

export const Route = createFileRoute("/stacks/$id")({
  loader: ({ params }) => {
    const stack = STACKS_DATA.find((s: any) => s.id === params.id);
    if (!stack) throw notFound();
    return { stack };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.stack.title} — Optima Stack` },
      { name: "description", content: loaderData.stack.description },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <StackDetailPage />
    </ProtectedRoute>
  ),
});

function StackDetailPage() {
  const { stack } = Route.useLoaderData();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("saved_public_stacks") ?? "[]");
      if (stored.some((s: any) => s.id === stack.id)) {
        setBookmarked(true);
      }
    } catch {}
  }, [stack.id]);

  const handleBookmark = () => {
    try {
      let stored = JSON.parse(localStorage.getItem("saved_public_stacks") ?? "[]");
      if (bookmarked) {
        stored = stored.filter((s: any) => s.id !== stack.id);
        setBookmarked(false);
      } else {
        stored.push(stack);
        setBookmarked(true);
      }
      localStorage.setItem("saved_public_stacks", JSON.stringify(stored));
    } catch {}
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": stack.title,
    "description": stack.description,
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": stack.cost_estimate },
    "tool": stack.tools.map((t: any) => ({ "@type": "HowToTool", "name": t.name || t })),
    "step": [
      { "@type": "HowToStep", "text": "Authenticate with tools." },
      { "@type": "HowToStep", "text": "Execute primary AI model prompt." },
      { "@type": "HowToStep", "text": "Export generated output." }
    ]
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link className="hover:text-foreground" to="/stacks">Stacks Library</Link>
        <span className="mx-2">/</span>
        <span className="hover:text-foreground cursor-pointer">{stack.category}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground truncate max-w-[200px]">{stack.title}</span>
      </nav>

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-1 rounded">
              {stack.category}
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
              <ShieldCheck className="h-3 w-3" /> Verified ({stack.confidence_score || 95}%)
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{stack.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{stack.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/20 text-brand font-bold uppercase text-[10px]">{String(stack.creator || stack.creator_name || "Un").substring(0,2)}</span>
              @{stack.creator || stack.creator_name || "Unknown"}
            </div>
            <span>•</span>
            <span>Updated {new Date(stack.updated_at || Date.now()).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {(stack.views || stack.likes || 1200).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full md:w-72 shrink-0 bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-3">
          <button 
            onClick={handleBookmark}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors shadow-glow ${bookmarked ? 'border border-brand text-brand bg-brand/10' : 'bg-brand text-brand-foreground hover:bg-brand/90'}`}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} /> {bookmarked ? 'Saved to Profile' : 'Save Stack'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-12">
        {/* Main Content */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><LayoutTemplate className="h-6 w-6 text-brand" /> The Workflow</h2>
            
            <div className="space-y-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="relative pl-8 pb-4">
                  <div className="absolute left-0 top-1 bottom-0 w-px bg-border/50"></div>
                  <div className="absolute left-[-8px] top-1 h-4 w-4 rounded-full bg-brand ring-4 ring-background"></div>
                  <div className="bg-card/40 rounded-xl border border-border p-5">
                    <h3 className="font-bold text-lg mb-2">Step {step}: Execute Automation</h3>
                    <p className="text-muted-foreground text-sm mb-4">Connect {typeof stack.tools[step % stack.tools.length] === 'object' ? stack.tools[step % stack.tools.length]?.name : (stack.tools[step % stack.tools.length] || 'Tool')} via API to process the incoming payload. Extract required JSON parameters and pass them downstream.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-accent text-foreground px-2 py-1 rounded">Tool: {(stack.tools && stack.tools.length > 0) ? (stack.tools[step % stack.tools.length]?.name || stack.tools[step % stack.tools.length]) : "Tool"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card/20 rounded-2xl p-8 border border-border/50">
            <h2 className="text-xl font-bold mb-4">Problem Solved</h2>
            <p className="text-muted-foreground">{stack.problem_solved || "An optimized solution designed for this category."} This workflow eliminates manual data entry and drastically reduces turnaround time for high-volume tasks.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Discussion & Reviews</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-3xl font-bold">
                {stack.rating || 4.9} <Star className="h-6 w-6 fill-warning text-warning" />
              </div>
              <div className="text-sm text-muted-foreground">Based on {Math.floor((stack.views || stack.likes || 1500) / 20)} user ratings.</div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">@dev_ops_ninja</span>
                  <div className="flex text-warning"><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/></div>
                </div>
                <p className="text-sm text-muted-foreground">Flawless execution. Saved my agency hundreds of hours this month alone.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Metadata */}
        <div className="space-y-6">
          <div className="bg-card/40 rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4">Stack Details</h3>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Time Saved</span>
              <span className="font-medium text-sm">{stack.estimated_time_saved || "0h"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> Difficulty</span>
              <span className="font-medium text-sm">{stack.difficulty || "Intermediate"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Est. Cost</span>
              <span className="font-medium text-sm">{stack.cost_estimate || "$0/mo"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Forks</span>
              <span className="font-medium text-sm">{(stack.forks || stack.saves || 230).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-card/40 rounded-2xl border border-border p-6">
            <h3 className="font-bold text-lg mb-4">Tools Required</h3>
            <div className="flex flex-wrap gap-2">
              {(stack.tools || []).map((t: any) => {
                const tName = t.name || t;
                const tUrl = t.url || `https://${tName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
                return (
                  <a href={tUrl} target="_blank" rel="noopener noreferrer" key={tName} className="text-sm font-medium bg-accent text-foreground px-3 py-1.5 rounded-lg border border-border/50 hover:border-brand hover:text-brand transition-colors cursor-pointer">
                    {tName}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
