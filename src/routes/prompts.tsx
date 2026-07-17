import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Bookmark, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "../components/auth/route-guard";
import { PROMPTS } from "../lib/data/prompts";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Library — Optima" },
      { name: "description", content: "Curated, copy-ready prompts for coding, research, marketing, content, business, and productivity." },
      { property: "og:title", content: "Prompt Library — Optima" },
      { property: "og:description", content: "Curated AI prompts for every use case." },
    ],
    links: [{ rel: "canonical", href: "/prompts" }],
  }),
  component: () => (
    <ProtectedRoute>
      <PromptsPage />
    </ProtectedRoute>
  ),
});

const CATS = Array.from(new Set(PROMPTS.map(p => p.cat))).slice(0, 30);

function PromptsPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("saved_prompts") ?? "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const list = PROMPTS.filter((p) =>
    (cat === "All" || p.cat === cat) &&
    (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.body.toLowerCase().includes(q.toLowerCase()))
  );

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success("Prompt copied to clipboard!"))
        .catch(() => {
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      toast.success("Prompt copied to clipboard!");
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
    document.body.removeChild(el);
  };

  const handleSave = (title: string) => {
    let updated: string[];
    if (saved.includes(title)) {
      updated = saved.filter((t) => t !== title);
      toast.success("Removed from saved prompts.");
    } else {
      updated = [...saved, title];
      toast.success("Prompt saved successfully!");
    }
    setSaved(updated);
    localStorage.setItem("saved_prompts", JSON.stringify(updated));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Prompt Library</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Prompts that actually work</h1>
        <p className="mt-3 text-muted-foreground">Curated by power users. Copy, remix, save.</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prompts..."
            className="h-11 w-full rounded-full border border-border bg-card/40 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-brand"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", ...CATS].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${cat === c ? "border-brand bg-brand/15" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"}`}
          >{c}</button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {list.map((p, i) => (
          <div key={i} className="group rounded-2xl glass p-6 transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-brand" /> {p.cat}
              </span>
              <div className="flex gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                <button 
                  onClick={() => handleCopy(p.body)} 
                  className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" 
                  aria-label="Copy"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => handleSave(p.title)} 
                  className={`grid h-7 w-7 place-items-center rounded-full border transition-all ${saved.includes(p.title) ? "border-brand bg-brand/15 text-brand" : "border-border text-muted-foreground hover:text-foreground"}`} 
                  aria-label="Save"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${saved.includes(p.title) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
            <pre className="mt-3 max-h-32 overflow-hidden whitespace-pre-wrap rounded-xl border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground">{p.body}</pre>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No prompts match. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
