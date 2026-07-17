import { createFileRoute, Link } from "@tanstack/react-router";
import { getLegalPoliciesListFn } from "../../lib/api/legal.functions";
import { Shield, FileText, Lock, Eye, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export const Route = createFileRoute("/legal/")({
  loader: async () => {
    // Get all published policies for the hub
    const policies = await getLegalPoliciesListFn();
    return { policies };
  },
  component: LegalHubPage,
});

function LegalHubPage() {
  const { policies } = Route.useLoaderData();

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "privacy": return <Eye className="h-6 w-6" />;
      case "terms": return <FileText className="h-6 w-6" />;
      case "cookie": return <Shield className="h-6 w-6" />;
      case "security": return <Lock className="h-6 w-6" />;
      default: return <AlertCircle className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
            <Shield className="h-4 w-4" /> Trust & Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Legal Center</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our policies, your privacy, and our commitment to security and transparency.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy: any) => (
            <Link key={policy.id} to={`/legal/${policy.type}`}>
              <Card className="bg-card border-border hover:border-brand/50 transition-colors h-full group">
                <CardContent className="p-6 sm:p-8 flex items-start gap-6">
                  <div className="h-12 w-12 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                    {getPolicyIcon(policy.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">{policy.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Effective Date: {new Date(policy.effective_date).toLocaleDateString()} (v{policy.version})
                    </p>
                    <div className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-muted-foreground group-hover:text-foreground">
                      Read Policy <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {policies.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">No legal documents published yet.</div>
          )}
        </div>
        
        <div className="mt-20 text-center p-8 bg-card border border-border rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Need to manage your consent?</h3>
          <p className="text-muted-foreground mb-6">You can update your cookie preferences and privacy settings at any time.</p>
          <button className="px-6 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors">
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
