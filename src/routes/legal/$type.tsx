import { createFileRoute, Link } from "@tanstack/react-router";
import { getLegalPolicyFn } from "../../lib/api/legal.functions";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Clock, Printer } from "lucide-react";

export const Route = createFileRoute("/legal/$type")({
  loader: async ({ params }) => {
    const policy = await getLegalPolicyFn({ data: { type: params.type } });
    return { policy };
  },
  component: LegalPolicyPage,
});

function LegalPolicyPage() {
  const { policy } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" className="-ml-4 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/legal"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Legal Center</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden sm:flex gap-2 print:hidden">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>

        <header className="mb-12 pb-8 border-b border-border">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{policy.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant="outline" className="font-mono">v{policy.version}</Badge>
            <div className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Effective Date: {new Date(policy.effective_date).toLocaleDateString()}</div>
            <div className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last Updated: {new Date(policy.updated_at).toLocaleDateString()}</div>
          </div>
        </header>

        <article className="prose prose-invert prose-brand max-w-none prose-headings:font-bold prose-a:text-brand hover:prose-a:text-brand-foreground bg-card/30 p-8 sm:p-12 rounded-2xl border border-border shadow-elegant">
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
            {policy.content}
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm mb-4">Have questions about this policy?</p>
          <Button variant="outline" asChild><Link to="/contact">Contact Legal Team</Link></Button>
        </div>
      </div>
    </div>
  );
}
