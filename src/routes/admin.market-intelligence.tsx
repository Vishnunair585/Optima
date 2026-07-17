import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, CheckCircle, XCircle, Search, RefreshCw, BarChart2 } from "lucide-react";
import { ProtectedRoute } from "../components/auth/route-guard";
import { MOCK_DB } from "../lib/data/mock-intelligence";

export const Route = createFileRoute("/admin/market-intelligence")({
  head: () => ({
    meta: [{ title: "Market Intelligence Admin — Optima" }],
  }),
  component: () => (
    <ProtectedRoute>
      <AdminMarketIntelligence />
    </ProtectedRoute>
  ),
});

function AdminMarketIntelligence() {
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "rejected" | "system">("pending");
  const [updates, setUpdates] = useState(MOCK_DB.pending_updates);

  const handleAction = (id: string, action: "verify" | "reject") => {
    setUpdates(prev => prev.filter(u => u.id !== id));
    // In production, update Supabase `market_updates` status
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Market Intelligence Engine</h1>
        <p className="text-muted-foreground mt-2">Automated pipeline review and dynamic ranking administration.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {(["pending", "verified", "rejected", "system"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === "pending" && `(${updates.length})`}
          </button>
        ))}
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-border bg-card/30">
              <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">No pending updates detected.</p>
            </div>
          ) : (
            updates.map(update => (
              <div key={update.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand/20 text-brand px-2 py-0.5 rounded text-xs font-mono font-bold uppercase">{update.update_type}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${update.confidence_score > 90 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {update.confidence_score}% Confidence
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{update.tool_name}</h3>
                  <pre className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded max-w-xl overflow-x-auto">
                    {update.raw_data}
                  </pre>
                  <a href={update.source_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-2 inline-block">View Source</a>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAction(update.id, "reject")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-sm font-semibold transition-colors">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => handleAction(update.id, "verify")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-semibold transition-colors">
                    <CheckCircle className="h-4 w-4" /> Verify & Merge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "system" && (
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <RefreshCw className="h-8 w-8 text-brand mb-4" />
            <h3 className="text-lg font-bold">Update Pipeline</h3>
            <p className="text-sm text-muted-foreground mt-1">Worker ran successfully 12 mins ago.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <BarChart2 className="h-8 w-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold">Dynamic Rankings</h3>
            <p className="text-sm text-muted-foreground mt-1">Recalculated 2 hours ago using v1.2 algorithm.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Search className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold">Sources Tracked</h3>
            <p className="text-sm text-muted-foreground mt-1">156 verified blogs, changelogs, and APIs.</p>
          </div>
        </div>
      )}
    </div>
  );
}
