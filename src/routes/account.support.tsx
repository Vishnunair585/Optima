import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getSessionFn } from '../lib/api/auth.functions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/account/support')({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session?.uid) {
      throw redirect({ to: '/auth' });
    }
    return { session };
  },
  component: UserSupportDashboard
});

function UserSupportDashboard() {
  const { session } = Route.useRouteContext();
  // Here we would typically fetch the tickets from the backend via a tRPC or server function.
  // We'll mock the data for now until the backend fetch is implemented.
  const [tickets, setTickets] = useState([]);
  
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Support Requests</h1>
          <p className="text-muted-foreground mt-2">Manage your bug reports, feature requests, and support tickets.</p>
        </div>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>You have no open tickets at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* The table will render tickets here when available */}
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-muted p-4 rounded-full">
                <span className="text-3xl">🎫</span>
              </div>
              <h3 className="text-lg font-medium">No tickets found</h3>
              <p className="text-muted-foreground">If you encounter an issue or have an idea, let us know!</p>
              <div className="flex gap-4 mt-4">
                <Button variant="outline" onClick={() => window.location.href='/report-bug'}>Report Bug</Button>
                <Button variant="outline" onClick={() => window.location.href='/feature-requests'}>Request Feature</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
