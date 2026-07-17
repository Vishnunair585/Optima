import { Link } from "@tanstack/react-router";
import { Moon, Sun, ArrowUp, ShieldCheck } from "lucide-react";
import { OptimaLogo } from "./OptimaLogo";
import { useState, useEffect } from "react";

const FOOTER_LINKS = {
  Product: [
    { label: "AI Finder", href: "/finder" },
    { label: "Rankings", href: "/rankings" },
    { label: "Compare", href: "/compare" },
  ],
  Discover: [
    { label: "Agent Hub", href: "/agents" },
    { label: "App Builders", href: "/app-builders" },
    { label: "Cost Calculator", href: "/calculator" },
    { label: "Prompt Library", href: "/prompts" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Report a Bug", href: "/report-bug" },
    { label: "Feature Requests", href: "/feature-requests" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
  ]
};

export function SiteFooter() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    setTheme(newTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-32 border-t border-border bg-background" aria-label="Site Footer">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Optima",
            "url": "https://optima.com",
            "logo": "https://optima.com/logo.png",
            "sameAs": []
          })
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-border/40 pb-12">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Go to homepage">
              <OptimaLogo className="h-8 w-8" />
              <span className="font-display text-xl font-bold tracking-tight">Optima</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              The AI Decision Engine. Find, compare, and build with the best AI tools — backed by data, not vibes.
            </p>

          </div>
        </div>

        {/* Navigation Links Grid */}
        <nav className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-5" aria-label="Footer Navigation">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">{category}</h3>
              <ul className="mt-6 space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href as any} 
                      className="text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm px-1 -mx-1 py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Optima Inc. All rights reserved. Version 2.0.1
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Optima is committed to accessibility. We strive to meet WCAG 2.2 AA standards. <Link to="/contact" className="hover:underline">Report an issue</Link>.
            </p>
          </div>

          <div className="flex items-center gap-4">


            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground hidden sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> SOC2 Compliant
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <button 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button 
              onClick={scrollToTop} 
              aria-label="Back to top"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
