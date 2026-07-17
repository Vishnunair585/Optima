import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { toast } from "sonner";
import { GlobalLoader } from "../components/ui/GlobalLoader";
export const Route = createFileRoute("/auth-callback")({
  component: OAuthCallbackPage,
});

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        const error = params.get("error");

        if (error) {
          toast.error(error || "Authentication failed.");
          navigate({ to: "/login" });
          return;
        }

        // Handle OAuth callback - provider session is set via cookie
        await refreshSession();

        const safeRedirect = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
        if (safeRedirect) {
          navigate({ to: safeRedirect });
        } else {
          navigate({ to: "/" });
        }
      } catch (err: any) {
        toast.error(err.message || "Authentication callback failed.");
        navigate({ to: "/login" });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, refreshSession]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GlobalLoader text={message} />
      </div>
    );
  }

  return null;
}
