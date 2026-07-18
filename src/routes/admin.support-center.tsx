import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSessionFn } from '../lib/api/auth.functions';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const Route = createFileRoute('/admin/support-center')({
  beforeLoad: async () => {
    const session = await getSessionFn();
    // In a real app, verify admin claim
    if (!session?.uid || session.email !== 'optimainc2026@gmail.com') {
      throw redirect({ to: '/auth' });
    }
    return { session };
  },
  component: AdminSupportCenter
});

function AdminSupportCenter() {
  return (
    <div className="min-h-screen bg-[#0E1015] text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Center</h1>
            <p className="text-gray-400 mt-2">Manage customer support tickets, bug reports, and feature requests.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-brand/10 text-brand px-4 py-2 rounded-lg font-medium">
              0 Unread Tickets
            </div>
          </div>
        </div>
        
        <Card className="bg-[#161B22] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Admin table goes here. Connecting to the real DB via server fn */}
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-4xl">🗄️</span>
              <h3 className="text-xl font-medium text-white">No active tickets</h3>
              <p className="text-gray-400">You're all caught up! When users submit requests, they will appear here securely from Firestore.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
