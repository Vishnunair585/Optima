import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicketDetailsFn, replyToTicketFn, updateTicketStatusFn } from '../lib/api/support.functions';
import { useState } from 'react';
import { ProtectedRoute } from '../components/auth/route-guard';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export const Route = createFileRoute('/account/requests/$id')({
  component: () => (
    <ProtectedRoute>
      <UserTicketDetail />
    </ProtectedRoute>
  ),
});

function UserTicketDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketDetailsFn({ data: { ticketId: id } }),
  });

  const replyMutation = useMutation({
    mutationFn: () => replyToTicketFn({ data: { ticketId: id, message: replyText } }),
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    }
  });

  const closeMutation = useMutation({
    mutationFn: () => updateTicketStatusFn({ data: { ticketId: id, status: 'closed' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['user_tickets'] });
    }
  });

  if (isLoading) return <div className="p-12 text-center">Loading ticket details...</div>;
  if (!data?.ticket) return <div className="p-12 text-center text-destructive">Ticket not found</div>;

  const { ticket, replies, attachments } = data;

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/account/requests" className="text-brand hover:underline text-sm mb-2 inline-block">&larr; Back to Requests</Link>
          <h1 className="text-3xl font-bold">{ticket.subject}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <Badge variant="outline">{ticket.id}</Badge>
            <span>{new Date(ticket.created_at).toLocaleString()}</span>
            <Badge variant={ticket.status === 'closed' ? 'secondary' : 'default'}>{ticket.status}</Badge>
          </div>
        </div>
        {ticket.status !== 'closed' && (
          <button 
            onClick={() => closeMutation.mutate()}
            disabled={closeMutation.isPending}
            className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-md text-sm transition-colors"
          >
            {closeMutation.isPending ? 'Closing...' : 'Close Ticket'}
          </button>
        )}
      </div>

      <Card className="mb-8 bg-card">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Messages</h2>
      
      <div className="space-y-4 mb-8">
        {replies.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No replies yet.</p>
        ) : (
          replies.map((reply: any) => (
            <Card key={reply.id} className={reply.is_admin_reply ? 'border-primary/50 bg-primary/5' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{reply.is_admin_reply ? 'Support Team' : 'You'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(reply.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {ticket.status !== 'closed' && (
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Add a Reply</h3>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full bg-background border border-border rounded-md p-3 text-sm min-h-[120px] focus:outline-none focus:border-brand"
              placeholder="Type your message here..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => replyMutation.mutate()}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="px-6 py-2 bg-brand text-brand-foreground rounded-md text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
              >
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
