import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { completeOnboardingFn, checkUsernameFn } from "../lib/api/onboarding.functions";
import {
  Sparkles,
  ArrowRight,
  Check,
  User,
  Camera,
  X,
} from "lucide-react";

import { ProtectedRoute } from "../components/auth/route-guard";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Complete Setup — Optima" },
      { name: "description", content: "Personalize your Optima experience." },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <OnboardingWizard />
    </ProtectedRoute>
  ),
});

function OnboardingWizard() {
  const { user, isLoaded, isSignedIn, refreshSession } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: "/login" });
    }
    if (isLoaded && isSignedIn && user?.onboarded) {
      navigate({ to: "/" });
    }
    if (user && !username && user.name) {
      const auto = user.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + Math.floor(Math.random() * 100);
      setUsername(auto);
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Debounced username check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setUsernameAvailable(false);
      return;
    }
    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const result = await checkUsernameFn({ data: { username } });
        setUsernameAvailable(result.available);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!username || usernameAvailable === false) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await completeOnboardingFn({
        data: {
          fullName: user?.name || "User",
          username,
          avatarUrl: avatarPreview || undefined,
          userType: "Other",
          experienceLevel: "Beginner",
          goals: [],
          favoriteTools: [],
          categories: [],
        },
      });

      await refreshSession();

      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[100px] mix-blend-screen" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-2/10 blur-[100px] mix-blend-screen" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-up">
        <div className="rounded-3xl glass-strong border border-border/50 p-8 sm:p-12 shadow-elegant overflow-hidden relative">

          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive animate-shake">
              <X className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="min-h-[340px] transition-all duration-300">
            {!loading && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center sm:text-left mb-8">
                  <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow mb-6">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-gradient">Set up your profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose your nickname and upload a profile picture.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                    <label className="relative h-28 w-28 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden group cursor-pointer hover:border-brand transition-colors bg-card/40">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-3xl font-bold text-white">
                          {username ? username.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                    <span className="text-xs text-muted-foreground">Upload photo</span>
                  </div>

                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Nickname</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-muted-foreground font-medium">@</span>
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          placeholder="preferred_nickname"
                          className={`h-11 w-full rounded-xl border bg-card/40 pl-9 pr-10 text-sm text-foreground outline-none transition-all ${
                            username
                              ? usernameAvailable === true
                                ? "border-emerald-500/50 focus:border-emerald-500"
                                : usernameAvailable === false
                                  ? "border-rose-500/50 focus:border-rose-500"
                                  : "border-border focus:border-brand"
                              : "border-border focus:border-brand"
                          }`}
                        />
                        {username && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {checkingUsername ? (
                              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                            ) : usernameAvailable === true ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : usernameAvailable === false ? (
                              <X className="h-4 w-4 text-rose-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {username && usernameAvailable === false && (
                        <p className="text-xs text-rose-500 mt-1">Nickname is taken or invalid.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-brand/30 blur-2xl animate-pulse-glow" />
                  <div className="h-20 w-20 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow relative z-10 animate-float">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-gradient">Your Optima workspace is ready.</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Personalizing your experience...
                </p>
                <div className="mt-8 flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-end">
              <button
                onClick={handleSubmit}
                disabled={!username || usernameAvailable !== true}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-brand-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                Enter App <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
