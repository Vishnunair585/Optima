import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";

export function ProtectedRoute({ children, requireRole }: { children: ReactNode, requireRole?: string }) {
  const { isLoaded, isSignedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      navigate({ to: "/login" });
    } else if (user && !user.email_verified) {
      navigate({ to: "/verify-email" });
    } else if (user && !user.onboarded && location.pathname !== "/onboarding") {
      navigate({ to: "/onboarding" });
    } else if (requireRole && user?.role !== requireRole) {
      navigate({ to: "/" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, requireRole, user]);

  if (
    !isLoaded || 
    !isSignedIn || 
    (user && !user.email_verified) || 
    (user && !user.onboarded && location.pathname !== "/onboarding") || 
    (requireRole && user?.role !== requireRole)
  ) {
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

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || isAuthenticating) return;
    
    let timer: NodeJS.Timeout;
    if (isSignedIn) {
      // Add a small delay to prevent race conditions during OAuth signup flows
      // where the user is briefly signed in before being signed out if they already exist.
      timer = setTimeout(() => {
        if (!isAuthenticating) {
          navigate({ to: "/" });
        }
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoaded, isSignedIn, navigate, isAuthenticating]);

  if (!isLoaded) {
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

  // We do NOT block rendering of children when isSignedIn is true because of the debounce above.
  // If we block rendering immediately, the user will see a flash of "Loading Workspace" or blank screen
  // during the 500ms delay before navigating or being signed out.
  return <>{children}</>;
}
