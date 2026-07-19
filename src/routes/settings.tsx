import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/auth/route-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, Shield } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});

function SettingsPage() {
  const { user } = useAuth();

  const handleExportData = () => {
    try {
      const data = {
        profile: user,
        saved_prompts: JSON.parse(localStorage.getItem(`saved_prompts_${user.id}`) || "[]"),
        saved_public_stacks: JSON.parse(localStorage.getItem(`saved_public_stacks_${user.id}`) || "[]"),
        saved_perfect_ai_stacks: JSON.parse(localStorage.getItem(`saved_perfect_ai_stacks_${user.id}`) || "[]"),
        export_date: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `optima_export_${user?.name?.replace(/\s+/g, '_') || 'data'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully!");
    } catch (e) {
      toast.error("Failed to export data.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
      <header className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account preferences and data.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-brand">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Data & Privacy</h2>
        </div>

        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download a complete JSON archive of your account data, including your profile information, saved prompts, and saved AI stacks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
              <Download className="h-4 w-4" /> Export My Data
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
