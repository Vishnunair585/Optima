import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getAdminPoliciesFn, updateLegalPolicyFn } from "../../lib/api/legal.functions";
import { getSessionFn } from "../../lib/api/auth.functions";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Plus, Save, Edit, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/legal")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session || session.user.role !== "Admin") throw redirect({ to: "/login" });
  },
  loader: async () => {
    const policies = await getAdminPoliciesFn();
    return { policies };
  },
  component: AdminLegalDashboard,
});

function AdminLegalDashboard() {
  const { policies: initialPolicies } = Route.useLoaderData();
  const [policies, setPolicies] = useState(initialPolicies);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({ type: "privacy", title: "", content: "", version: "1.0", status: "draft" });

  const handleNew = () => {
    setFormData({ type: "", title: "", content: "", version: "1.0", status: "draft" });
    setIsEditing(true);
  };

  const handleEdit = (policy: any) => {
    setFormData(policy);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateLegalPolicyFn({ data: formData });
      toast.success("Policy saved successfully");
      setIsEditing(false);
      const res = await getAdminPoliciesFn();
      setPolicies(res);
    } catch (err: any) { toast.error(err.message || "Failed to save policy"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div><h1 className="text-3xl font-bold">Legal Center CMS</h1><p className="text-muted-foreground mt-1">Manage platform policies and compliance documents.</p></div>
          {!isEditing && <Button onClick={handleNew} className="bg-gradient-brand text-brand-foreground"><Plus className="mr-2 h-4 w-4" /> New Policy</Button>}
        </div>

        {isEditing ? (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50 flex flex-row justify-between items-center">
              <CardTitle>{formData.id ? "Edit Policy" : "New Policy"}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading} className="bg-gradient-brand text-brand-foreground"><Save className="mr-2 h-4 w-4" /> Save</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Type (Unique ID)</label>
                  <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={!!formData.id} placeholder="e.g. privacy, terms, cookie" className="font-mono" />
                </div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Display Title</label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Privacy Policy" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Version</label>
                  <Input value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="1.0" />
                </div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Status</label>
                  <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><label className="text-sm text-muted-foreground">Content (Markdown)</label>
                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="min-h-[400px] font-mono text-sm" placeholder="## 1. Information We Collect..." />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50"><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-brand" /> Active Policies</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead>Effective Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {policies.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.type}</TableCell>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>{p.version}</TableCell>
                      <TableCell><Badge variant="outline" className={p.status === "published" ? "bg-emerald-500/10 text-emerald-500" : ""}>{p.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.effective_date ? new Date(p.effective_date).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
