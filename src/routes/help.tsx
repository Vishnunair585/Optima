import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getHelpArticlesFn, getHelpCategoriesFn } from "../lib/api/helpcenter.functions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Search, BookOpen, Shield, CreditCard, Users, BarChart2, Code, Settings, HelpCircle, FileText, Clock, ArrowRight, Layers, Zap, MessageSquare, Bug, Activity } from "lucide-react";

const CATEGORIES = [
  { key: "authentication", label: "Authentication", icon: <Shield className="h-5 w-5" />, desc: "Login, signup, passwords, and sessions" },
  { key: "account", label: "Account", icon: <Users className="h-5 w-5" />, desc: "Profile, settings, and preferences" },
  { key: "billing", label: "Billing", icon: <CreditCard className="h-5 w-5" />, desc: "Plans, payments, and invoices" },
  { key: "rankings", label: "AI Rankings", icon: <BarChart2 className="h-5 w-5" />, desc: "How rankings work and methodology" },
  { key: "stacks", label: "Public Stacks", icon: <Layers className="h-5 w-5" />, desc: "Creating and sharing AI stacks" },
  { key: "search", label: "Search & Finder", icon: <Search className="h-5 w-5" />, desc: "Finding the right AI tool" },
  { key: "security", label: "Security", icon: <Shield className="h-5 w-5" />, desc: "Data protection and privacy" },
  { key: "troubleshooting", label: "Troubleshooting", icon: <Settings className="h-5 w-5" />, desc: "Common issues and solutions" },
  { key: "api", label: "API", icon: <Code className="h-5 w-5" />, desc: "API usage and endpoints" },
  { key: "analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5" />, desc: "Dashboard and insights" },
  { key: "premium", label: "Premium Features", icon: <Zap className="h-5 w-5" />, desc: "Pro and Business plans" },
  { key: "privacy", label: "Privacy", icon: <Shield className="h-5 w-5" />, desc: "Data handling and compliance" },
];

export const Route = createFileRoute("/help")({
  loader: async () => {
    const articles = await getHelpArticlesFn({ data: { limit: 20 } });
    const categories = await getHelpCategoriesFn();
    return { articles, categories };
  },
  component: HelpCenterPage,
});

function HelpCenterPage() {
  const { articles, categories } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search || activeCategory !== "all") {
        setLoading(true);
        try {
          const res = await getHelpArticlesFn({
            data: {
              category: activeCategory !== "all" ? activeCategory : undefined,
              search: search || undefined,
              limit: 50,
            }
          });
          setFilteredArticles(res);
        } catch { toast.error("Search failed"); }
        setLoading(false);
      } else {
        setFilteredArticles(articles);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Search */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
            <HelpCircle className="h-4 w-4" /> Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">How can we help?</h1>
          <p className="mt-4 text-muted-foreground text-lg">Search our documentation, FAQs, and guides.</p>
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search" placeholder="Search articles, guides, and FAQs..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-12 h-14 text-base bg-card border-border rounded-xl shadow-elegant"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant="outline" size="sm" className="gap-2 border-border" asChild>
            <Link to="/contact"><MessageSquare className="h-3.5 w-3.5" /> Contact Support</Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border" asChild>
            <Link to="/contact"><Bug className="h-3.5 w-3.5" /> Report a Bug</Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border" asChild>
            <Link to="/status"><Activity className="h-3.5 w-3.5" /> System Status</Link>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(activeCategory === cat.key ? "all" : cat.key)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${activeCategory === cat.key ? "bg-brand/10 border-brand/30" : "bg-card border-border hover:border-brand/20"}`}>
                <div className={`mt-0.5 ${activeCategory === cat.key ? "text-brand" : "text-muted-foreground"}`}>{cat.icon}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{cat.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                  {categories.find((c: any) => c.name === cat.key) && (
                    <span className="text-xs text-brand mt-1 inline-block">{categories.find((c: any) => c.name === cat.key)?.count} articles</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 className="text-xl font-bold mb-6">
            {activeCategory !== "all" ? `${CATEGORIES.find(c => c.key === activeCategory)?.label || activeCategory} Articles` : "Popular Articles"}
          </h2>
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Searching...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground text-sm">Try a different search term or browse categories above.</p>
              <Button variant="outline" className="mt-4" asChild><Link to="/contact">Contact Support</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article: any) => (
                <Card key={article.id} className="bg-card border-border transition-colors hover:border-brand/30 group cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="capitalize text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{article.read_time} min read</span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{new Date(article.updated_at).toLocaleDateString()}</span>
                      <span className="text-xs text-brand flex items-center gap-1 group-hover:gap-2 transition-all">Read article <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="text-xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "How does Optima determine rankings?", a: "Rankings are determined by a proprietary algorithm that factors in performance benchmarks, user reviews, feature completeness, pricing, and overall adoption." },
              { q: "Is Optima free to use?", a: "Yes! Optima offers a generous free tier. Premium plans unlock advanced features like unlimited comparisons, priority support, and analytics." },
              { q: "How do I create a Public Stack?", a: "Navigate to 'Public Stacks', click 'Create Stack', add your preferred AI tools, and publish. Your stack will be visible to everyone." },
              { q: "How can I report inaccurate information?", a: "Use the Contact page and select 'Report a Bug' category. Our team reviews all reports within 48 hours." },
              { q: "Can I export my data?", a: "Yes. Go to Settings > Data & Privacy > Export Data. You'll receive a download link within 24 hours." },
              { q: "How do I cancel my subscription?", a: "Go to Settings > Billing > Manage Subscription > Cancel. You'll retain access until the end of your billing period." },
            ].map((faq, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-5">
                  <h4 className="font-medium text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
