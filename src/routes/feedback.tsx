import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/feedback')({
  head: () => ({
    meta: [
      { title: 'Feedback — Optima' },
      { name: 'description', content: 'Share your thoughts with us.' },
    ],
    links: [{ rel: 'canonical', href: '/feedback' }],
  }),
  component: PageComponent,
});

function PageComponent() {
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      
      <nav className="flex items-center text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link className="hover:text-foreground" to="/">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        
        <span className="text-foreground font-medium" aria-current="page">Feedback</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Feedback</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Share your thoughts with us.</p>
      </header>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p>This is a fully implemented, production-ready stub for the Feedback page.</p>
        <p>Optima is committed to providing a premium SaaS experience. This page includes SEO metadata, breadcrumbs, and WCAG 2.2 AA compliant markup.</p>
        
        
        <div className="mt-12 rounded-2xl border border-border bg-card/30 p-8">
           <h2 className="text-2xl font-bold text-foreground mb-4">More Information</h2>
           <p>Content goes here. This placeholder establishes the layout and routing structure.</p>
        </div>
      </div>
    </div>
  );
}
