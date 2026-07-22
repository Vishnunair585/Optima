import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteBottomNav } from "../components/site/SiteBottomNav";
import { AuthProvider } from "../hooks/use-auth";
import { Toaster } from "sonner";
import { GlobalLoader } from "../components/ui/GlobalLoader";
import { SpotlightOverlay } from "../components/ui/SpotlightOverlay";
import { NavigationProvider, useNavigation } from "../components/navigation/NavigationProvider";
import { V2Layout } from "../components/layout/v2/V2Layout";
import { V3Layout } from "../components/layout/v3/V3Layout";
import { toast } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Error 404</p>
        <h1 className="mt-4 text-7xl font-bold text-gradient">Lost in latent space</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          That route doesn't exist in our model. Try heading home.
        </p>
        <a href="/" className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-gradient-brand px-5 text-sm font-medium text-brand-foreground shadow-glow">
          Back to Optima
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">Refresh, or jump back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-brand px-5 text-sm font-medium text-brand-foreground shadow-glow"
          >Try again</button>
          <a href="/" className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-accent">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Optima — Find the Perfect AI Tool in Seconds" },
      { name: "description", content: "Optima is the AI Decision Engine. Compare AI models, build AI stacks, discover agents, and choose the right AI tools with data-driven recommendations." },
      { name: "author", content: "Optima" },
      { property: "og:title", content: "Optima — The AI Decision Engine" },
      { property: "og:description", content: "Compare AI models, build AI stacks, and find the perfect tool for your goal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0b0a14" },
      { httpEquiv: "Content-Security-Policy", content: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" },
      { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
      { httpEquiv: "X-Frame-Options", content: "DENY" },
      { httpEquiv: "Strict-Transport-Security", content: "max-age=31536000; includeSubDomains" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  pendingComponent: () => <GlobalLoader />,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}



function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationProvider>
          <RootLayout />
        </NavigationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootLayout() {
  const { version } = useNavigation();
  
  if (version === "v2") {
    return (
      <V2Layout>
        <Outlet />
        <Toaster theme="dark" position="top-center" />
      </V2Layout>
    );
  }

  if (version === "v3") {
    return (
      <V3Layout>
        <Outlet />
        <Toaster theme="dark" position="top-center" />
      </V3Layout>
    );
  }

  useEffect(() => {
    // Check if the user is on a mobile device and hasn't seen the warning yet
    const hasSeenMobileWarning = sessionStorage.getItem("mobile_desktop_warning");
    if (window.innerWidth < 768 && !hasSeenMobileWarning) {
      toast("For a better experience, please use Desktop mode.", {
        icon: "📱",
        duration: 5000,
      });
      sessionStorage.setItem("mobile_desktop_warning", "true");
    }
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <SpotlightOverlay />
      <SiteHeader />
      <main className="flex-1 lg:pb-0 pb-16"><Outlet /></main>
      <SiteFooter />
      <SiteBottomNav />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
