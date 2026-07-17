import { createFileRoute, Link } from '@tanstack/react-router';
import { MailX } from 'lucide-react';

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({
    meta: [
      { title: 'Unsubscribe — Optima' },
    ],
    links: [{ rel: 'canonical', href: '/unsubscribe' }],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 animate-fade-in text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <MailX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">You've been unsubscribed</h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          We're sorry to see you go. You will no longer receive our newsletter emails.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-xl bg-card border border-border px-6 py-3 font-semibold text-foreground hover:bg-accent transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
