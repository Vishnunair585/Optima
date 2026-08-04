import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";
import { Mail, RefreshCw, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user, isLoaded, resendOtp, refreshSession, logout } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      navigate({ to: "/login" });
    }
    if (isLoaded && user?.email_verified && !verified) {
      navigate({ to: user.onboarded ? "/dashboard" : "/onboarding" });
    }
  }, [user, isLoaded, navigate, verified]);

  const handleCheckVerified = async () => {
    setChecking(true);
    try {
      await refreshSession();
      setTimeout(() => {
        setChecking(false);
        toast.info("Checked verification status.");
      }, 1000);
    } catch {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await resendOtp(user.email);
    } finally {
      setResending(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
          <span className="text-sm text-muted-foreground animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  if (verified || user.email_verified) {
    return (
      <AuthLayout
        title="Email Verified!"
        subtitle="Redirecting you to your account..."
      >
        <div className="flex justify-center py-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-glow">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a verification link to ${user.email}`}
    >
      <div className="w-full space-y-6">
        <div className="flex justify-center animate-bounce-subtle">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20 shadow-glow">
            <Mail className="w-8 h-8 text-brand" />
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          Please check your inbox and click the link to verify your account before continuing.
        </p>
        
        <div className="flex items-start gap-2 p-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
          <Mail className="w-4 h-4 shrink-0 mt-0.5" />
          <p>If you don't see the email, please check your <strong>spam</strong> or <strong>junk</strong> folder. Depending on your email provider, it might take a minute to arrive.</p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleCheckVerified}
            disabled={checking}
            className="w-full h-11 text-base font-semibold bg-gradient-brand text-white shadow-lg hover:shadow-brand/25 transition-all"
          >
            {checking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> I have clicked the link</span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resending}
            className="w-full h-11 text-base font-medium"
          >
            {resending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Resend Verification Link</span>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => logout()}
            className="w-full h-11 text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" /> Use a different email
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
