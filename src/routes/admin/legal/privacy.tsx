import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getAdminPoliciesFn, updateLegalPolicyFn } from "../../../lib/api/legal.functions";
import { getSessionFn } from "../../../lib/api/auth.functions";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { Shield, FileText, Plus, Save, History, Eye, Settings } from "lucide-react";

export const Route = createFileRoute("/admin/legal/privacy")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session || session.user.role !== "Admin") throw redirect({ to: "/login" });
  },
  loader: async () => {
    const policies = await getAdminPoliciesFn();
    return { initialPolicies: policies };
  },
  component: AdminLegalPrivacy,
});

function AdminLegalPrivacy() {
  const { initialPolicies } = Route.useLoaderData();
  const [policies, setPolicies] = useState(initialPolicies);
  const [activePolicy, setActivePolicy] = useState<any>(policies.find((p: any) => p.type === 'privacy') || policies[0] || null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!activePolicy) return;
    setSaving(true);
    try {
      await updateLegalPolicyFn({ data: {
        id: activePolicy.id,
        type: activePolicy.type,
        title: activePolicy.title,
        content: activePolicy.content,
        version: activePolicy.version,
        status: activePolicy.status
      } });
      toast.success("Policy saved successfully!");
      const updated = await getAdminPoliciesFn();
      setPolicies(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to save policy");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-brand" /> Legal CMS
          </h1>
          <p className="text-sm text-muted-foreground">Manage compliance documents</p>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Documents</div>
          {policies.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setActivePolicy(p)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activePolicy?.id === p.id ? 'bg-brand/10 text-brand font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{p.title}</span>
              {p.status === 'draft' && <div className="h-2 w-2 rounded-full bg-yellow-500 ml-auto shrink-0" />}
            </button>
          ))}
          <Button variant="outline" className="w-full justify-start mt-4 border-dashed"><Plus className="h-4 w-4 mr-2" /> New Document</Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 max-w-5xl">
        {activePolicy ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-bold">{activePolicy.title} Editor</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={activePolicy.status === 'published' ? 'default' : 'secondary'}>{activePolicy.status}</Badge>
                  <span className="text-sm text-muted-foreground">v{activePolicy.version} • Last updated {new Date(activePolicy.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><History className="h-4 w-4 mr-2" /> History</Button>
                <Button variant="outline" size="sm" asChild><a href={`/legal/${activePolicy.type}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4 mr-2" /> Preview</a></Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="bg-brand text-brand-foreground"><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Publish Changes'}</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-0">
                    <Textarea 
                      value={activePolicy.content}
                      onChange={(e) => setActivePolicy({...activePolicy, content: e.target.value})}
                      className="min-h-[70vh] border-0 rounded-none bg-background/50 font-mono text-sm leading-relaxed p-6 resize-y focus-visible:ring-0"
                      placeholder="# Markdown Content Here"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-card border-border shadow-sm">
                  <div className="p-4 border-b border-border bg-muted/30 font-semibold flex items-center gap-2"><Settings className="h-4 w-4" /> Metadata</div>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Document Title</label>
                      <Input value={activePolicy.title} onChange={e => setActivePolicy({...activePolicy, title: e.target.value})} className="h-8 text-sm bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">URL Slug (Type)</label>
                      <Input value={activePolicy.type} onChange={e => setActivePolicy({...activePolicy, type: e.target.value})} className="h-8 text-sm bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Version Number</label>
                      <Input value={activePolicy.version} onChange={e => setActivePolicy({...activePolicy, version: e.target.value})} className="h-8 text-sm bg-background" />
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-medium text-muted-foreground">Status</label>
                      <select 
                        value={activePolicy.status} 
                        onChange={e => setActivePolicy({...activePolicy, status: e.target.value})}
                        className="w-full h-8 text-sm bg-background border border-border rounded-md px-2"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border shadow-sm border-brand/20 bg-brand/5">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-brand mb-2">Consent Tracking</h4>
                    <p className="text-xs text-muted-foreground mb-4">When you increment the major version number, users will be required to re-accept this document upon their next login.</p>
                    <Button variant="outline" size="sm" className="w-full text-xs">View Consent Logs</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-muted-foreground">
            <Shield className="h-16 w-16 mb-4 opacity-20" />
            <p>Select a document to edit</p>
          </div>
        )}
      </div>
    </div>
  );
}
