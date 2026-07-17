import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getAdminHelpArticlesFn, createHelpArticleFn, updateHelpArticleFn } from "../../lib/api/helpcenter.functions";
import { getSessionFn } from "../../lib/api/auth.functions";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Save, BookOpen, CheckCircle, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/help-center")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session || session.user.role !== "Admin") throw redirect({ to: "/login" });
  },
  loader: async () => {
    const articles = await getAdminHelpArticlesFn({ data: {} });
    return { articles };
  },
  component: AdminHelpCenterDashboard,
});

function AdminHelpCenterDashboard() {
  const { articles: initialArticles } = Route.useLoaderData();
  const [articles, setArticles] = useState(initialArticles);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "", slug: "", summary: "", content: "", category: "authentication", status: "draft", read_time: 5
  });

  const handleNew = () => {
    setFormData({ title: "", slug: "", summary: "", content: "", category: "authentication", status: "draft", read_time: 5 });
    setIsEditing(true);
  };

  const handleEdit = (article: any) => {
    setFormData(article);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (formData.id) {
        await updateHelpArticleFn({ data: formData });
        toast.success("Article updated");
      } else {
        const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        await createHelpArticleFn({ data: { ...formData, slug } });
        toast.success("Article created");
      }
      setIsEditing(false);
      const res = await getAdminHelpArticlesFn({ data: {} });
      setArticles(res);
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div><h1 className="text-3xl font-bold">Help Center</h1><p className="text-muted-foreground mt-1">Manage articles and documentation.</p></div>
          {!isEditing && <Button onClick={handleNew} className="bg-gradient-brand text-brand-foreground"><Plus className="mr-2 h-4 w-4" /> New Article</Button>}
        </div>

        {isEditing ? (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50 flex flex-row justify-between items-center">
              <CardTitle>{formData.id ? "Edit Article" : "New Article"}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading} className="bg-gradient-brand text-brand-foreground"><Save className="mr-2 h-4 w-4" /> Save</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Title</label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-background border-border" placeholder="How to Reset Your Password" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Slug</label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-background border-border font-mono" placeholder="how-to-reset-password" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Category</label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent>
                    <SelectItem value="authentication">Authentication</SelectItem><SelectItem value="account">Account</SelectItem><SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="rankings">Rankings</SelectItem><SelectItem value="stacks">Stacks</SelectItem><SelectItem value="search">Search</SelectItem>
                    <SelectItem value="security">Security</SelectItem><SelectItem value="troubleshooting">Troubleshooting</SelectItem><SelectItem value="api">API</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="privacy">Privacy</SelectItem>
                  </SelectContent></Select></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Status</label>
                  <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Read Time (min)</label><Input type="number" value={formData.read_time} onChange={e => setFormData({...formData, read_time: parseInt(e.target.value) || 5})} className="bg-background border-border" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm text-muted-foreground">Summary</label><Textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="min-h-[80px] bg-background border-border" placeholder="Brief description..." /></div>
              <div className="space-y-2"><label className="text-sm text-muted-foreground">Content</label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="min-h-[300px] bg-background border-border font-mono text-sm" placeholder="Full article content..." /></div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border bg-card/50"><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand" /> Articles ({articles.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-border"><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {articles.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No articles yet</TableCell></TableRow> : articles.map((a: any) => (
                    <TableRow key={a.id} className="border-border hover:bg-accent/50">
                      <TableCell className="font-medium max-w-[250px] truncate">{a.title}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{a.category}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={a.status === "published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}>{a.status === "published" && <CheckCircle className="mr-1 h-3 w-3" />}{a.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground"><Eye className="h-3 w-3 inline mr-1" />{a.views_count}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(a.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleEdit(a)}><Edit className="h-4 w-4" /></Button></TableCell>
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
