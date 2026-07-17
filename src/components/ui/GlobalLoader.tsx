import React from "react";
import { cn } from "../../lib/utils";

interface GlobalLoaderProps {
  className?: string;
  text?: string;
}

export function GlobalLoader({ className, text = "Initializing Model..." }: GlobalLoaderProps) {
  return (
    <div className={cn("flex min-h-[300px] w-full flex-col items-center justify-center space-y-6", className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute h-24 w-24 animate-[spin_4s_linear_infinite] rounded-full border-2 border-brand/20 border-t-brand border-r-brand/60" />
        
        {/* Inner reverse ring */}
        <div className="absolute h-16 w-16 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-brand/30 border-b-brand/80 border-l-brand" />
        
        {/* Center core */}
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-brand/40" />
          <div className="h-4 w-4 rounded-full bg-brand shadow-[0_0_15px_rgba(102,51,255,0.7)]" />
        </div>
      </div>
      
      {/* Loading text with animated dots */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center text-sm font-medium uppercase tracking-[0.2em] text-brand">
          <span className="bg-gradient-to-r from-brand via-primary to-brand bg-clip-text text-transparent animate-pulse">
            {text}
          </span>
          <span className="inline-flex w-4 ml-1">
            <span className="animate-[bounce_1.4s_infinite] mx-[1px]">.</span>
            <span className="animate-[bounce_1.4s_infinite_0.2s] mx-[1px]">.</span>
            <span className="animate-[bounce_1.4s_infinite_0.4s] mx-[1px]">.</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground animate-pulse">Optima Decision Engine</p>
      </div>
    </div>
  );
}
