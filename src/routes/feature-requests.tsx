import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { submitSupportTicketFn } from "../lib/api/support.functions";
import { useAuthContext } from "../components/auth/auth-provider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { Lightbulb, UploadCloud, X, File, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/card";

export const Route = createFileRoute("/feature-requests")({
  component: FeatureRequestPage,
});

function FeatureRequestPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    problem: "",
    suggested_solution: "",
    business_impact: "",
    severity: "normal", // For priority in base ticket
  });

  const [attachments, setAttachments] = useState<Array<{file_url: string, file_type: string, file_name: string}>>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 10MB limit.`);
          continue;
        }

        const data = new FormData();
        data.append("file", file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }

        const result = await res.json();
        setAttachments(prev => [...prev, {
          file_url: result.file_url,
          file_type: result.file_type,
          file_name: result.file_name
        }]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a feature request.");
    
    setLoading(true);
    try {
      const res = await submitSupportTicketFn({ 
        data: {
          type: 'feature',
          subject: formData.title,
          category: formData.category,
          description: `Problem:\n${formData.problem}\n\nSolution:\n${formData.suggested_solution}\n\nBusiness Value:\n${formData.business_impact}`,
          problem: formData.problem,
          suggested_solution: formData.suggested_solution,
          business_impact: formData.business_impact,
          severity: formData.severity, // We map severity to priority
          email: user.email,
          attachments: attachments
        }
      });
      setSuccess(res.ticket_id);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feature request.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Request Submitted</h1>
          <p className="text-muted-foreground">Your feature request has been received. Ticket ID: <strong>{success}</strong>.</p>
          <p className="text-sm text-muted-foreground">A confirmation email has been sent. You can track this request in your account dashboard.</p>
          <Button onClick={() => window.location.href = "/"} className="bg-brand text-brand-foreground w-full">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1015] text-gray-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-md"><Lightbulb className="h-5 w-5" /></div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Feature Request</h1>
          </div>
          <p className="text-gray-400">Help us shape Optima. Tell us what you want to see built next.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-[#161B22] border-gray-800 p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Title <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    placeholder="E.g., Add Dark Mode toggle for Data tables" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="bg-[#0D1117] border-gray-700 text-white placeholder:text-gray-600 focus-visible:ring-amber-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">What is the problem you're trying to solve? <span className="text-red-500">*</span></label>
                  <Textarea 
                    required 
                    placeholder="Describe the friction or pain point in your current workflow..." 
                    value={formData.problem} 
                    onChange={e => setFormData({...formData, problem: e.target.value})} 
                    className="bg-[#0D1117] border-gray-700 text-white placeholder:text-gray-600 min-h-[120px] focus-visible:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Suggested Solution</label>
                  <Textarea 
                    placeholder="How would you like us to solve this?" 
                    value={formData.suggested_solution} 
                    onChange={e => setFormData({...formData, suggested_solution: e.target.value})} 
                    className="bg-[#0D1117] border-gray-700 text-white placeholder:text-gray-600 min-h-[100px] focus-visible:ring-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Business Value</label>
                  <Textarea 
                    placeholder="How does this help you or your team? (e.g. saves 5 hours a week)" 
                    value={formData.business_impact} 
                    onChange={e => setFormData({...formData, business_impact: e.target.value})} 
                    className="bg-[#0D1117] border-gray-700 text-white placeholder:text-gray-600 min-h-[80px] focus-visible:ring-amber-500"
                  />
                </div>
              </Card>

              {/* Attachments Section */}
              <Card className="bg-[#161B22] border-gray-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Attachments (Mockups, examples, etc.)</label>
                  <span className="text-xs text-gray-500">Max 10MB per file</span>
                </div>
                
                <div 
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#0D1117] hover:border-amber-500/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept=".png,.jpg,.jpeg,.webp,.pdf,.zip"
                  />
                  <UploadCloud className="h-10 w-10 text-gray-500 mb-3" />
                  <p className="text-sm text-gray-400">
                    <span className="text-amber-500 font-medium">Click to upload</span> or drag and drop
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#0D1117] border border-gray-800 rounded-md">
                        <div className="flex items-center gap-3">
                          {file.file_type.includes("image") ? <File className="text-blue-400 h-5 w-5" /> : <FileText className="text-orange-400 h-5 w-5" />}
                          <span className="text-sm truncate max-w-[200px]">{file.file_name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400" onClick={() => removeAttachment(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {uploading && <p className="text-sm text-amber-500 animate-pulse">Uploading...</p>}
              </Card>
            </div>

            {/* Sidebar properties */}
            <div className="space-y-6">
              <Card className="bg-[#161B22] border-gray-800 p-6 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Properties</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">Priority <span className="text-red-500">*</span></label>
                  <Select required value={formData.severity} onValueChange={v => setFormData({...formData, severity: v})}>
                    <SelectTrigger className="bg-[#0D1117] border-gray-700"><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent className="bg-[#161B22] border-gray-700">
                      <SelectItem value="urgent">Critical (Blocker)</SelectItem>
                      <SelectItem value="high">High (Need this soon)</SelectItem>
                      <SelectItem value="normal">Normal (Nice to have)</SelectItem>
                      <SelectItem value="low">Low (Whenever)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">Category <span className="text-red-500">*</span></label>
                  <Select required value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger className="bg-[#0D1117] border-gray-700"><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent className="bg-[#161B22] border-gray-700">
                      <SelectItem value="Dashboard">Dashboard</SelectItem>
                      <SelectItem value="AI Tools">AI Tools</SelectItem>
                      <SelectItem value="Integrations">Integrations</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Mobile">Mobile Experience</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </Card>

              <Button 
                type="submit" 
                disabled={loading || !user || uploading} 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 h-12 rounded-lg"
              >
                {loading ? "Submitting..." : "Submit Feature Request"}
              </Button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}
