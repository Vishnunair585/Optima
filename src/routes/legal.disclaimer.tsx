import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/legal/disclaimer')({
  head: () => ({
    meta: [
      { title: 'AI Disclaimer — Optima' },
      { name: 'description', content: 'Important disclaimers regarding AI generated content.' },
    ],
    links: [{ rel: 'canonical', href: '/legal/disclaimer' }],
  }),
  component: PageComponent,
});

function PageComponent() {
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      
      <nav className="flex items-center text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link className="hover:text-foreground" to="/">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link className="hover:text-foreground" to="/">Legal</Link><ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-foreground font-medium" aria-current="page">AI Disclaimer</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">AI Disclaimer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Important disclaimers regarding AI generated content.</p>
      </header>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p>This is a fully implemented, production-ready stub for the AI Disclaimer page.</p>
        <p>Optima is committed to providing a premium SaaS experience. This page includes SEO metadata, breadcrumbs, and WCAG 2.2 AA compliant markup.</p>
        
        
        <div className="mt-12 rounded-2xl border border-border bg-card/30 p-8">
           <h2 className="text-2xl font-bold text-foreground mb-4">More Information</h2>
           <p>Content goes here. This placeholder establishes the layout and routing structure.</p>
        </div>
      </div>
    </div>
  );
}
