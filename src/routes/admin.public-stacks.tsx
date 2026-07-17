import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, CheckCircle, XCircle, FileSearch, Database, RefreshCw } from "lucide-react";
import { ProtectedRoute } from "../components/auth/route-guard";

export const Route = createFileRoute("/admin/public-stacks")({
  head: () => ({
    meta: [{ title: "Stack Moderation Queue — Optima" }],
  }),
  component: () => (
    <ProtectedRoute>
      <AdminPublicStacks />
    </ProtectedRoute>
  ),
});

const PENDING_IMPORTS = [
  { id: "q1", title: "Automated Blog Post Generator", source: "github.com", confidence: 96, tools: ["Claude", "ChatGPT"], time: "2 hours ago" },
  { id: "q2", title: "AI Video Shorts Pipeline", source: "youtube.com", confidence: 88, tools: ["Gemini", "ElevenLabs", "Runway"], time: "4 hours ago" },
  { id: "q3", title: "Spam Link Generator", source: "unknown.xyz", confidence: 21, tools: ["Unknown"], time: "5 hours ago", warning: "Suspicious URL detected" }
];

function AdminPublicStacks() {
  const [queue, setQueue] = useState(PENDING_IMPORTS);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Public Stacks Moderation</h1>
        <p className="text-muted-foreground mt-2">Review, validate, and manage imported workflows from the AI intelligence crawler.</p>
      </header>

      {/* Analytics Row */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <Database className="h-6 w-6 text-brand mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Total Public Stacks</h3>
          <p className="text-2xl font-bold mt-1">500</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <RefreshCw className="h-6 w-6 text-emerald-500 mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Crawler Status</h3>
          <p className="text-xl font-bold mt-1 text-emerald-500">Active (12m ago)</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <FileSearch className="h-6 w-6 text-orange-500 mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
          <p className="text-2xl font-bold mt-1">{queue.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Moderation Queue</h2>
      
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border bg-card/30">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/50 mb-4" />
            <p className="text-muted-foreground">Inbox zero. All imports processed.</p>
          </div>
        ) : (
          queue.map(item => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.confidence > 85 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {item.confidence}% Confidence
                  </span>
                  <span className="text-xs text-muted-foreground">Source: {item.source}</span>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <div className="flex gap-2 mt-2">
                  {item.tools.map(t => (
                    <span key={t} className="text-[10px] bg-accent px-2 py-1 rounded text-foreground">{t}</span>
                  ))}
                </div>
                {item.warning && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-2"><ShieldAlert className="h-3 w-3" /> {item.warning}</p>
                )}
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleAction(item.id, "reject")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-sm font-semibold transition-colors">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
                <button onClick={() => handleAction(item.id, "approve")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold transition-colors">
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
