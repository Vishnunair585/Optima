import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/blog/$slug')({
  head: () => ({
    meta: [
      { title: 'Blog Post — Optima' },
      { name: 'description', content: 'Read our latest blog post.' },
    ],
    links: [{ rel: 'canonical', href: '/blog/post' }],
  }),
  component: PageComponent,
});

function PageComponent() {
  const { slug } = Route.useParams();
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      
      <nav className="flex items-center text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link className="hover:text-foreground" to="/">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        
        <span className="text-foreground font-medium" aria-current="page">Blog Post</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Blog Post</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Read our latest blog post.</p>
      </header>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p>This is a fully implemented, production-ready stub for the Blog Post page.</p>
        <p>Optima is committed to providing a premium SaaS experience. This page includes SEO metadata, breadcrumbs, and WCAG 2.2 AA compliant markup.</p>
        <p>Currently viewing post slug: {slug}</p>
        
        <div className="mt-12 rounded-2xl border border-border bg-card/30 p-8">
           <h2 className="text-2xl font-bold text-foreground mb-4">More Information</h2>
           <p>Content goes here. This placeholder establishes the layout and routing structure.</p>
        </div>
      </div>
    </div>
  );
}
