import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { PublicOnlyRoute } from "../components/auth/route-guard";
import { OptimaLogo } from "../components/site/OptimaLogo";
import { Eye, EyeOff, Loader2, AlertCircle, Check, ArrowLeft } from "lucide-react";

function ResetPasswordRoute() {
  return (
    <PublicOnlyRoute>
      <ResetPasswordPage />
    </PublicOnlyRoute>
  );
}

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordRoute,
});

function ResetPasswordPage() {
  const { verifyResetCode, confirmResetPassword } = useAuth();
  const navigate = useNavigate();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const oobCode = searchParams.get("oobCode") || searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");

  const reqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const strengthScore = Object.values(reqs).filter(Boolean).length;
  const isFormValid = strengthScore === 5 && password === confirmPassword;

  useEffect(() => {
    if (!oobCode) {
      setIsVerifying(false);
      return;
    }
    verifyResetCode(oobCode)
      .then((email) => {
        setEmailForReset(email);
        setIsValidCode(true);
      })
      .catch(() => {
        setIsValidCode(false);
      })
      .finally(() => setIsVerifying(false));
  }, [oobCode, verifyResetCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      await confirmResetPassword(password, oobCode);
      setStatus("success");
      setTimeout(() => navigate({ to: "/login", search: { reset: "true" } }), 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password.");
      setStatus("error");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand mb-4" />
          <p className="text-muted-foreground">Verifying secure link...</p>
        </div>
      </div>
    );
  }

  if (!oobCode || !isValidCode) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
        <div className="w-full max-w-[420px] text-center space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 shadow-elegant">
            <AlertCircle className="h-10 w-10 mx-auto text-rose-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
              Request a new link
            </Link>
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
          <h1 className="text-2xl font-bold tracking-tight">Create new password</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {emailForReset ? `For ${emailForReset}` : "Enter your new password below"}
          </p>
        </div>

        {status === "error" && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 shadow-elegant">
          {status === "success" ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Check className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Password reset successful</h3>
                <p className="text-sm text-muted-foreground mt-1">Redirecting you to sign in...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border border-border bg-background/60 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Checklist */}
                {password && (
                  <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/50 space-y-2">
                    <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`flex-1 ${i < strengthScore ? (strengthScore < 3 ? 'bg-rose-500' : strengthScore < 5 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-border'}`} />
                      ))}
                    </div>
                    <div className="text-xs space-y-1">
                      <div className={`flex items-center gap-1.5 ${reqs.length ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${reqs.length ? 'opacity-100' : 'opacity-30'}`} /> Minimum 8 characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${reqs.upper ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${reqs.upper ? 'opacity-100' : 'opacity-30'}`} /> One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${reqs.lower ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${reqs.lower ? 'opacity-100' : 'opacity-30'}`} /> One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${reqs.number ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${reqs.number ? 'opacity-100' : 'opacity-30'}`} /> One number
                      </div>
                      <div className={`flex items-center gap-1.5 ${reqs.special ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${reqs.special ? 'opacity-100' : 'opacity-30'}`} /> One special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm new password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  className={`w-full h-11 px-3.5 text-sm rounded-xl border bg-background/60 outline-none transition-all ${confirmPassword && password !== confirmPassword ? 'border-rose-500 focus:ring-1 focus:ring-rose-500/30' : 'border-border focus:border-brand focus:ring-1 focus:ring-brand/30'}`}
                />
              </div>
              
              <button
                type="submit"
                disabled={status === "loading" || !isFormValid}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
