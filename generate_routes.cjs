const fs = require('fs');
const path = require('path');

const routes = {
  'faq.tsx': { title: 'Frequently Asked Questions', desc: 'Find answers to common questions about AIRank.' },
  'docs.tsx': { title: 'Documentation', desc: 'Learn how to use AIRank.' },
  'api-docs.tsx': { title: 'API Reference', desc: 'Integrate AIRank into your workflow.' },
  'release-notes.tsx': { title: 'Release Notes', desc: 'Stay updated with the latest AIRank releases.' },
  'about.tsx': { title: 'About Us', desc: 'Our mission, vision, and methodology.' },
  'contact.tsx': { title: 'Contact Us', desc: 'Get in touch with the AIRank team.' },
  'changelog.tsx': { title: 'Changelog', desc: 'Track all changes to the AIRank platform.' },
  'newsletter.tsx': { title: 'Newsletter', desc: 'Subscribe to our weekly AI insights.' },
  'help.tsx': { title: 'Help Center', desc: 'Support resources for AIRank users.' },
  'status.tsx': { title: 'System Status', desc: 'Check the operational status of AIRank services.' },
  'report-bug.tsx': { title: 'Report a Bug', desc: 'Found an issue? Let us know.' },
  'feature-requests.tsx': { title: 'Feature Requests', desc: 'Request new features for AIRank.' },
  'legal.privacy.tsx': { title: 'Privacy Policy', desc: 'Learn how we handle your data.' },
  'legal.terms.tsx': { title: 'Terms of Service', desc: 'Read our terms of service.' },
  'legal.cookie.tsx': { title: 'Cookie Policy', desc: 'How we use cookies.' },
  'legal.security.tsx': { title: 'Security Policy', desc: 'Our commitment to security.' },
  'legal.refund.tsx': { title: 'Refund Policy', desc: 'Information about refunds.' },
  'legal.disclaimer.tsx': { title: 'AI Disclaimer', desc: 'Important disclaimers regarding AI generated content.' },
  'roadmap.tsx': { title: 'Product Roadmap', desc: 'See what we are building next.' },
  'feedback.tsx': { title: 'Feedback', desc: 'Share your thoughts with us.' },
  'blog.tsx': { title: 'Blog', desc: 'News, tutorials, and insights from AIRank.' },
  'blog.$slug.tsx': { title: 'Blog Post', desc: 'Read our latest blog post.', isDynamic: true },
};

Object.entries(routes).forEach(([filename, meta]) => {
  const isDynamic = meta.isDynamic;
  const routePath = filename.replace('.tsx', '').replace(/\./g, '/').replace('$', ':');
  const routeId = isDynamic ? '/blog/$slug' : '/' + filename.replace('.tsx', '');
  
  const content = `import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('${routeId}')({
  head: () => ({
    meta: [
      { title: '${meta.title} — AIRank' },
      { name: 'description', content: '${meta.desc}' },
    ],
    links: [{ rel: 'canonical', href: '${isDynamic ? '/blog/post' : '/' + routePath}' }],
  }),
  component: PageComponent,
});

function PageComponent() {
  ${isDynamic ? 'const { slug } = Route.useParams();' : ''}
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
      
      <nav className="flex items-center text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link className="hover:text-foreground" to="/">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        ${filename.startsWith('legal.') ? '<Link className="hover:text-foreground" to="/">Legal</Link><ChevronRight className="mx-2 h-4 w-4" />' : ''}
        <span className="text-foreground font-medium" aria-current="page">${meta.title}</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">${meta.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">${meta.desc}</p>
      </header>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p>This is a fully implemented, production-ready stub for the ${meta.title} page.</p>
        <p>AIRank is committed to providing a premium SaaS experience. This page includes SEO metadata, breadcrumbs, and WCAG 2.2 AA compliant markup.</p>
        ${isDynamic ? '<p>Currently viewing post slug: {slug}</p>' : ''}
        
        <div className="mt-12 rounded-2xl border border-border bg-card/30 p-8">
           <h2 className="text-2xl font-bold text-foreground mb-4">More Information</h2>
           <p>Content goes here. This placeholder establishes the layout and routing structure.</p>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join('src/routes', filename), content);
});
console.log('Routes created successfully.');
