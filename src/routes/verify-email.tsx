import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";
import { Mail, RefreshCw, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OptimaLogo } from "../components/site/OptimaLogo";

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
      // user state will automatically update because of the context
      // if not immediately updated in context, we could check auth.currentUser directly, 
      // but relying on context is cleaner.
      setTimeout(() => {
        setChecking(false);
        // The useEffect will catch the updated user.email_verified
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-16 w-16 animate-[spin_4s_linear_infinite] rounded-full border-2 border-brand/20 border-t-brand border-r-brand/60" />
            <div className="absolute h-10 w-10 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-brand/30 border-b-brand/80 border-l-brand" />
            <div className="h-4 w-4 rounded-full bg-brand shadow-[0_0_15px_rgba(102,51,255,0.7)] animate-pulse" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  if (verified || user.email_verified) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
        <div className="w-full max-w-[420px] text-center">
          <div className="rounded-2xl border border-emerald-500/20 bg-card/50 backdrop-blur-sm p-8 shadow-elegant space-y-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Email verified!</h2>
            <p className="text-sm text-muted-foreground">Redirecting you to your account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <OptimaLogo className="h-12 w-12" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 shadow-elegant text-center space-y-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 border border-brand/20 text-brand">
            <Mail className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">Verify your email</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We've sent a verification link to{" "}
              <span className="font-semibold text-foreground">{user.email}</span>. 
              Please check your inbox and click the link to verify your account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleCheckVerified}
              disabled={checking}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {checking ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Checking...</>
              ) : (
                <><CheckCircle className="h-4 w-4" /> I have clicked the link</>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 text-sm font-semibold hover:bg-accent hover:text-foreground transition-all disabled:opacity-50 cursor-pointer"
            >
              {resending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                <><RefreshCw className="h-4 w-4" /> Resend Verification Link</>
              )}
            </button>

            <button
              onClick={() => logout()}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Use a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
