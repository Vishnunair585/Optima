import { useState } from "react";
import { Chrome } from "lucide-react";
import { useAuthContext } from "./auth-provider";
import { useNavigate } from "@tanstack/react-router";

export function AuthButtons({ isSignUp = false }: { isSignUp?: boolean }) {
  const { loginWithGoogle } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (typeof result === "object" && result.success) {
        if (result.isNewUser) {
          navigate({ to: "/onboarding" });
        } else {
          navigate({ to: "/" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all disabled:opacity-50 font-medium shadow-sm group"
        aria-label="Continue with Google"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin"></div>
        ) : (
          <>
            <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
}
