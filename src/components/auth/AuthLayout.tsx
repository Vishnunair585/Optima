import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
  backLink,
  backLabel,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  backLink?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients and blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand/20 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-3/4 right-0 w-1/2 h-1/2 bg-brand/10 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center animate-fade-in-down mb-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 group-hover:border-brand/40 transition-colors shadow-elegant">
                <Sparkles className="h-5 w-5 text-brand" />
              </div>
              <span className="text-2xl font-bold font-display tracking-tight text-foreground">Optima</span>
            </Link>
          </div>

          {/* Title & Subtitle */}
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-foreground animate-fade-in">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground animate-fade-in animation-delay-100">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-card/40 backdrop-blur-xl py-8 px-4 shadow-2xl border border-border/50 sm:rounded-2xl sm:px-10 animate-fade-in-up animation-delay-200">
            {backLink && backLabel && (
              <div className="mb-6">
                <Link
                  to={backLink}
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Link>
              </div>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
