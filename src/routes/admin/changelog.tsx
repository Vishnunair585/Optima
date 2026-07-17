import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getChangelogReleasesFn, createChangelogReleaseFn, updateChangelogReleaseFn } from "../../lib/api/changelog.functions";
import { getSessionFn } from "../../lib/api/auth.functions";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, GitBranch, Save, FileText, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/changelog")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session || session.user.role !== "Admin") {
      throw redirect({ to: "/login" });
    }
  },
  loader: async () => {
    const initialReleases = await getChangelogReleasesFn({ data: { status: "all", limit: 50 } });
    return { initialReleases };
  },
  component: AdminChangelogDashboard,
});

function AdminChangelogDashboard() {
  const { initialReleases } = Route.useLoaderData();
  const [releases, setReleases] = useState(initialReleases);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    version: "v1.0.0", release_name: "", release_date: new Date().toISOString().split("T")[0],
    type: "minor", impact: "low", status: "draft", overview: "", new_features: "", improvements: "", bug_fixes: "", breaking_changes: ""
  });

  const handleEdit = (release: any) => {
    setFormData({ ...release, release_date: new Date(release.release_date).toISOString().split("T")[0] });
    setIsEditing(true);
  };

  const handleNew = () => {
    setFormData({ version: `v${releases.length + 1}.0.0`, release_name: "", release_date: new Date().toISOString().split("T")[0], type: "minor", impact: "low", status: "draft", overview: "", new_features: "", improvements: "", bug_fixes: "", breaking_changes: "" });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (formData.id) {
        await updateChangelogReleaseFn({ data: formData });
        toast.success("Release updated");
      } else {
        await createChangelogReleaseFn({ data: formData });
        toast.success("Release created");
      }
      setIsEditing(false);
      const res = await getChangelogReleasesFn({ data: { status: "all", limit: 50 } });
      setReleases(res);
    } catch (err: any) { toast.error(err.message || "Failed to save release"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div><h1 className="text-3xl font-bold">Changelog Management</h1><p className="text-muted-foreground mt-1">Create, edit, and publish platform updates.</p></div>
          {!isEditing && <Button onClick={handleNew} className="bg-gradient-brand text-brand-foreground"><Plus className="mr-2 h-4 w-4" /> New Release</Button>}
        </div>

        {isEditing ? (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50 flex flex-row justify-between items-center">
              <CardTitle>{formData.id ? "Edit Release" : "Create New Release"}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading} className="bg-gradient-brand text-brand-foreground"><Save className="mr-2 h-4 w-4" /> Save</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Version</label><Input value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="bg-background border-border font-mono" placeholder="v2.5.0" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Release Name</label><Input value={formData.release_name} onChange={e => setFormData({...formData, release_name: e.target.value})} className="bg-background border-border" placeholder="The Speed Update" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Date</label><Input type="date" value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} className="bg-background border-border" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Type</label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="major">Major</SelectItem><SelectItem value="minor">Minor</SelectItem><SelectItem value="patch">Patch</SelectItem><SelectItem value="security">Security</SelectItem><SelectItem value="performance">Performance</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Impact</label>
                  <Select value={formData.impact} onValueChange={v => setFormData({...formData, impact: v})}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="breaking">Breaking</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Status</label>
                  <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-brand"/> Content</h3>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Overview <span className="text-red-500">*</span></label><Textarea value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} className="min-h-[100px] bg-background border-border font-mono text-sm" placeholder="High level overview..." /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">New Features</label><Textarea value={formData.new_features} onChange={e => setFormData({...formData, new_features: e.target.value})} className="min-h-[100px] bg-background border-border font-mono text-sm" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Improvements & Fixes</label><Textarea value={formData.improvements} onChange={e => setFormData({...formData, improvements: e.target.value})} className="min-h-[100px] bg-background border-border font-mono text-sm" /></div>
                <div className="space-y-2"><label className="text-sm text-rose-400 font-medium">Breaking Changes</label><Textarea value={formData.breaking_changes} onChange={e => setFormData({...formData, breaking_changes: e.target.value})} className="min-h-[100px] bg-background border-rose-500/30 font-mono text-sm" placeholder="Only if there are breaking changes..." /></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50"><CardTitle>Release History</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Version</TableHead><TableHead>Release Name</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {releases.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No releases found</TableCell></TableRow> : releases.map((release: any) => (
                    <TableRow key={release.id} className="border-border hover:bg-accent/50">
                      <TableCell className="font-mono text-sm text-brand font-semibold flex items-center gap-2"><GitBranch className="h-4 w-4 text-muted-foreground" /> {release.version}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{release.release_name}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(release.release_date).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{release.type}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`capitalize ${release.status === "published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}`}>{release.status === "published" && <CheckCircle className="mr-1 h-3 w-3" />}{release.status}</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleEdit(release)} className="hover:bg-accent"><Edit className="h-4 w-4" /></Button></TableCell>
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
