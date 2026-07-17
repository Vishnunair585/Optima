import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAdminTicketsFn, updateTicketStatusFn, replyToTicketFn } from "../lib/api/support.functions";
import { useAuthContext } from "../components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, LifeBuoy, Filter, Search, Tag, Bug, Lightbulb, Clock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupportDashboard,
});

function AdminSupportDashboard() {
  const { user } = useAuthContext();
  const [filterType, setFilterType] = useState<"all" | "bug" | "feature" | "help">("all");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["admin_tickets", filterType],
    queryFn: async () => {
      return getAdminTicketsFn({ data: { type: filterType === "all" ? undefined : filterType } });
    },
  });

  const updateStatus = useMutation({
    mutationFn: (data: { ticket_id: string, status: string }) => updateTicketStatusFn({ data }),
    onSuccess: () => {
      toast.success("Ticket status updated");
      refetch();
      setSelectedTicket((prev: any) => ({ ...prev, status: status }));
    }
  });

  const reply = useMutation({
    mutationFn: (data: { ticket_id: string, message: string }) => replyToTicketFn({ data }),
    onSuccess: () => {
      toast.success("Reply sent to user");
      setReplyMessage("");
      refetch();
    }
  });

  const filteredTickets = tickets?.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'open': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'resolved': case 'closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading tickets...</div>;

  return (
    <div className="flex h-screen bg-[#0E1015] text-gray-200 overflow-hidden pt-16">
      {/* Sidebar / Queue */}
      <div className="w-1/3 min-w-[350px] max-w-[450px] border-r border-gray-800 flex flex-col bg-[#161B22]">
        <div className="p-4 border-b border-gray-800 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-lg text-white">
            <LifeBuoy className="h-5 w-5 text-brand" />
            Support Inbox
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search ID, Subject, Email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-[#0D1117] border-gray-700 text-sm focus-visible:ring-brand" 
            />
          </div>
          <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)} className="w-full">
            <TabsList className="w-full bg-[#0D1117] border border-gray-800 p-1">
              <TabsTrigger value="all" className="flex-1 text-xs data-[state=active]:bg-gray-800">All</TabsTrigger>
              <TabsTrigger value="bug" className="flex-1 text-xs data-[state=active]:bg-gray-800">Bugs</TabsTrigger>
              <TabsTrigger value="feature" className="flex-1 text-xs data-[state=active]:bg-gray-800">Features</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredTickets?.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">No tickets found.</div>
          )}
          {filteredTickets?.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-gray-800 border-l-2 border-l-brand' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <h3 className="font-medium text-sm text-gray-200 line-clamp-1 mb-1">{ticket.subject}</h3>
              <div className="flex justify-between items-center mt-3">
                <Badge variant="outline" className={`text-[10px] ${getStatusColor(ticket.status)}`}>{ticket.status}</Badge>
                <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Ticket View */}
      <div className="flex-1 flex flex-col bg-[#0D1117] overflow-hidden">
        {selectedTicket ? (
          <>
            <div className="p-6 border-b border-gray-800 bg-[#161B22] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300">
                    {selectedTicket.type === 'bug' ? <Bug className="h-3 w-3 mr-1"/> : <Lightbulb className="h-3 w-3 mr-1"/>}
                    {selectedTicket.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-mono text-gray-500">{selectedTicket.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                <div className="text-sm text-gray-400 mt-2 flex items-center gap-4">
                  <span>From: {selectedTicket.email}</span>
                  <span>Category: {selectedTicket.category}</span>
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <Select 
                  value={selectedTicket.status} 
                  onValueChange={v => {
                    updateStatus.mutate({ ticket_id: selectedTicket.id, status: v });
                    setSelectedTicket({...selectedTicket, status: v});
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-[#0D1117] border-gray-700 h-9 text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161B22] border-gray-800">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="waiting_for_user">Waiting for User</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <Card className="bg-[#161B22] border-gray-800">
                <CardHeader className="pb-3 border-b border-gray-800/50">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </CardContent>
              </Card>

              {/* Reply Section */}
              <Card className="bg-[#161B22] border-gray-800">
                <CardHeader className="pb-3 border-b border-gray-800/50">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Send Reply
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <Textarea 
                    placeholder="Type your reply to the user... (This will send an email)" 
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    className="bg-[#0D1117] border-gray-700 min-h-[100px] focus-visible:ring-brand text-sm"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => reply.mutate({ ticket_id: selectedTicket.id, message: replyMessage })}
                      disabled={reply.isPending || !replyMessage}
                      className="bg-brand text-white"
                    >
                      {reply.isPending ? "Sending..." : "Send Reply & Email"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="h-12 w-12 text-gray-700 mb-4" />
            <p className="text-lg">Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
