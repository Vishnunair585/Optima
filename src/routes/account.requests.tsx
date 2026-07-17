import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserTicketsFn } from "../lib/api/support.functions";
import { ProtectedRoute } from "../components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MessageSquare, Calendar, Bug, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/account/requests")({
  component: () => (
    <ProtectedRoute>
      <UserRequestsPage />
    </ProtectedRoute>
  ),
});

function UserRequestsPage() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["user_tickets"],
    queryFn: () => getUserTicketsFn(),
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">New</Badge>;
      case 'open': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Open</Badge>;
      case 'investigating': return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Investigating</Badge>;
      case 'waiting_for_user': return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Waiting For You</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Resolved</Badge>;
      case 'closed': return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Requests</h1>
          <p className="text-muted-foreground">Track the status of your bug reports and feature requests.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/report-bug" className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium">Report Bug</Link>
          <Link to="/feature-requests" className="px-4 py-2 bg-brand text-brand-foreground hover:bg-brand/90 rounded-md text-sm font-medium">Request Feature</Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading your requests...</div>
      ) : tickets?.length === 0 ? (
        <Card className="bg-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No requests found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">You haven't submitted any bug reports or feature requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets?.map(ticket => (
            <Card key={ticket.id} className="hover:border-brand/50 transition-colors overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    {ticket.type === 'bug' ? (
                      <Bug className="h-6 w-6 text-brand" />
                    ) : (
                      <Lightbulb className="h-6 w-6 text-amber-500" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold truncate">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{ticket.description}</p>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {getStatusBadge(ticket.status)}
                  {ticket.priority === 'urgent' && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                </div>
                
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
