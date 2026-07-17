import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getToolsFn, addToolFn, deleteToolFn } from "../lib/api/tools.functions";
import { ProtectedRoute } from "../components/auth/route-guard";
import { Plus, Trash, Search, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/tools")({
  loader: async () => {
    const tools = await getToolsFn();
    return { tools };
  },
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminToolsPage />
    </ProtectedRoute>
  ),
});

function AdminToolsPage() {
  const { tools } = Route.useLoaderData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tool?")) {
      try {
        await deleteToolFn({ data: { id } });
        toast.success("Tool deleted");
        router.invalidate();
      } catch (err) {
        toast.error("Failed to delete tool");
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addToolFn({
        data: {
          name: formData.get("name") as string,
          vendor: formData.get("vendor") as string,
          category: formData.get("category") as string,
          price: formData.get("price") as string,
          has_free_tier: formData.get("has_free_tier") === "true",
          review_score: Number(formData.get("review_score")),
          popularity_score: Number(formData.get("popularity_score")),
          growth_score: Number(formData.get("growth_score")),
          reliability_score: Number(formData.get("reliability_score")),
          trend_indicator: formData.get("trend_indicator") as string,
          color: "oklch(0.7 0.15 250)",
          last_verified_at: new Date().toISOString()
        }
      });
      toast.success("Tool added successfully!");
      setIsAdding(false);
      router.invalidate();
    } catch (err) {
      toast.error("Failed to add tool");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Tools Database</h1>
          <p className="text-muted-foreground mt-1">Manage the {tools.length} AI tools shown on the Rankings page.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Tool
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border p-6 rounded-xl mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Add New Tool</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">Name</label><Input name="name" required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Vendor</label><Input name="vendor" required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Category</label><Input name="category" required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Price</label><Input name="price" required /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Has Free Tier</label>
              <select name="has_free_tier" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Trend Indicator</label>
              <select name="trend_indicator" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="hot">Hot</option><option value="rising">Rising</option><option value="stable">Stable</option><option value="declining">Declining</option><option value="new">New</option>
              </select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Review Score (1-100)</label><Input type="number" name="review_score" required min="1" max="100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Growth Score (1-100)</label><Input type="number" name="growth_score" required min="1" max="100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Popularity Score (1-100)</label><Input type="number" name="popularity_score" required min="1" max="100" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Reliability Score (1-100)</label><Input type="number" name="reliability_score" required min="1" max="100" /></div>
            
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Save Tool</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tools..." className="pl-9 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredTools.length} tools</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border font-mono text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Tool</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTools.map(tool => (
                <tr key={tool.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tool.color }}></span>
                    {tool.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{tool.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tool.vendor}</td>
                  <td className="px-4 py-3 font-mono font-bold text-brand">{Number(tool.overall_score).toFixed(1)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tool.price}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(tool.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No tools found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
