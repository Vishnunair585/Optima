import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { submitSupportTicketFn } from "../lib/api/support.functions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Bug, Lightbulb, HelpCircle, Briefcase, FileText, Activity } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketNum, setTicketNum] = useState("");
  const [category, setCategory] = useState("help");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await submitSupportTicketFn({
        data: {
          type: category === 'bug' ? 'bug' : category === 'feature' ? 'feature' : 'help',
          category: category,
          first_name: formData.get("firstName") as string,
          last_name: formData.get("lastName") as string,
          email: formData.get("email") as string,
          subject: formData.get("subject") as string,
          description: formData.get("message") as string,
        }
      });

      setSuccess(true);
      setTicketNum(res.ticket_id);
      toast.success("Message sent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/30">
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gradient">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Questions, feedback, partnerships, bug reports, or feature ideas — we'd love to hear from you.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow" asChild>
              <a href="#contact-form"><Bug className="mr-2 h-5 w-5" /> Report a Bug</a>
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-card/50 hover:bg-accent text-muted-foreground" asChild>
              <a href="#contact-form"><Lightbulb className="mr-2 h-5 w-5" /> Request a Feature</a>
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-card/50 hover:bg-accent text-muted-foreground" asChild>
              <Link to="/help"><HelpCircle className="mr-2 h-5 w-5" /> Help Center</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8" id="contact-form">
            {success ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Message Received</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Thank you for reaching out. Your request has been assigned ticket number <strong className="text-foreground">{ticketNum}</strong>. We typically respond within 24-48 business hours.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="border-border text-muted-foreground">
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border overflow-hidden shadow-elegant">
                <CardHeader className="border-b border-border bg-card/50 pb-8">
                  <CardTitle className="text-2xl">Contact Us</CardTitle>
                  <CardDescription className="text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">First Name <span className="text-red-500">*</span></label>
                        <Input name="firstName" required className="bg-background border-border" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Last Name <span className="text-red-500">*</span></label>
                        <Input name="lastName" required className="bg-background border-border" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address <span className="text-red-500">*</span></label>
                        <Input type="email" name="email" required className="bg-background border-border" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Company (Optional)</label>
                        <Input name="company" className="bg-background border-border" placeholder="Acme Inc." />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Category <span className="text-red-500">*</span></label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="business">Business Inquiry</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="media">Media & Press</SelectItem>
                          <SelectItem value="bug">Report a Bug</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="billing">Billing Issue</SelectItem>
                          <SelectItem value="abuse">Report Abuse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Subject <span className="text-red-500">*</span></label>
                      <Input name="subject" required minLength={5} maxLength={200} className="bg-background border-border" placeholder="How can we help?" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Message <span className="text-red-500">*</span></label>
                      <Textarea name="message" required minLength={10} maxLength={5000} className="min-h-[150px] bg-background border-border" placeholder="Please provide as much detail as possible..." />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-gradient-brand text-brand-foreground shadow-glow px-8">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border transition-colors hover:border-brand/30">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4 text-brand">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Business & Partnerships</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We partner with AI companies, API providers, and educational institutions. Select "Partnership" in the form.
                </p>
              </CardContent>
            </Card>



            <Card className="bg-card border-border transition-colors hover:border-brand/30">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">System Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check current operational status of the Optima platform.
                </p>
                <div className="flex items-center text-sm font-medium text-emerald-500">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  All Systems Operational
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
