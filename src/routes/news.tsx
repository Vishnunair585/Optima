import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { getNewsArticlesFn } from '../lib/api/news.functions';

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "AI News Feed — Optima" },
      { name: "description", content: "Latest automated intelligence, releases, and updates in the AI ecosystem." },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news-articles'],
    queryFn: () => getNewsArticlesFn()
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Market Intelligence</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">AI News Feed</h1>
        <p className="mt-3 text-muted-foreground">Automated aggregation of official announcements, updates, and releases across the industry.</p>
      </header>

      <div className="mt-12 space-y-6">
        {isLoading ? (
          <div className="text-muted-foreground animate-pulse">Loading news updates...</div>
        ) : news.length === 0 ? (
          <div className="text-muted-foreground">No recent news available.</div>
        ) : (
          news.map(item => (
            <div key={item.id} className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all hover:bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">
                <Link to={`/blog/$slug`} params={{ slug: item.slug }} className="hover:underline">
                  {item.title}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{item.summary}</p>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground">{item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

