import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getHelpArticleBySlugFn } from "../lib/api/helpcenter.functions";
import { OptimaLogo } from "../components/site/OptimaLogo";
import { Badge } from "../components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export const Route = createFileRoute("/help_/articles/$slug")({
  loader: async ({ params }) => {
    try {
      const article = await getHelpArticleBySlugFn({ data: { slug: params.slug } });
      return { article };
    } catch (e) {
      throw notFound();
    }
  },
  component: HelpArticlePage,
});

function HelpArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative pt-32 pb-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/help" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Help Center
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="capitalize">{article.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> {article.read_time} min read
            </span>
            <span className="text-sm text-muted-foreground">
              • Last updated {new Date(article.updated_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4">{article.title}</h1>
          <p className="text-xl text-muted-foreground">{article.summary}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-brand max-w-none">
          <ReactMarkdown>{article.content || "No content available."}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
