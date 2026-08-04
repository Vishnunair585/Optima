import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { PublicOnlyRoute } from "../components/auth/route-guard";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Loader2, AlertCircle, Mail, RefreshCw, Edit2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { z } from "zod";
import { forgotPasswordSchema } from "../components/auth/validation";

export const Route = createFileRoute("/forgot-password")({
  component: () => (
    <PublicOnlyRoute>
      <ForgotPasswordPage />
    </PublicOnlyRoute>
  ),
});

function ForgotPasswordPage() {
  const { sendResetLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0 || status === "loading") return;

    try {
      setStatus("loading");
      setErrorMessage("");
      forgotPasswordSchema.parse({ email });

      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      };
      
      await sendResetLink(email, actionCodeSettings);
      setStatus("success");
      setCooldown(60);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrorMessage(err.errors[0].message);
        setStatus("error");
      } else if (err.message && err.message.includes("Too many")) {
        setErrorMessage(err.message);
        setStatus("error");
      } else {
        setStatus("success");
        setCooldown(60);
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setStatus("loading");
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      };
      await sendResetLink(email, actionCodeSettings);
      setCooldown(60);
      setStatus("success");
    } catch (err) {
      setCooldown(60);
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We've sent a password reset link to ${email}`}
        backLink="/login"
        backLabel="Back to Login"
      >
        <div className="w-full space-y-6">
          <div className="flex justify-center animate-bounce-subtle">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-glow">
              <Mail className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={cooldown > 0 || status === "loading"}
              className="w-full h-11 text-base font-semibold bg-gradient-brand text-white shadow-lg hover:shadow-brand/25 transition-all"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Resend Link</span>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setCooldown(0);
              }}
              className="w-full h-11 text-base font-medium"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Change Email
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
      backLink="/login"
      backLabel="Back to Login"
    >
      <div className="w-full space-y-6">
        {status === "error" && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive-foreground font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={status === "loading" || cooldown > 0}
            className="w-full h-11 text-base font-semibold bg-gradient-brand text-white shadow-lg hover:shadow-brand/25 transition-all mt-2"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : cooldown > 0 ? (
              `Wait ${cooldown}s`
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
