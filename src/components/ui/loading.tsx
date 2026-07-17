import React from "react";

export function LoadingAnimation({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-6">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 rounded-full border-t-2 border-brand/80 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border-r-2 border-brand/60 animate-[spin_2s_linear_infinite_reverse]" />
        <div className="absolute inset-4 rounded-full border-b-2 border-brand/40 animate-[spin_1.5s_linear_infinite]" />
        
        {/* Inner pulsing core */}
        <div className="absolute inset-6 rounded-full bg-gradient-brand animate-pulse blur-[2px]" />
        <div className="absolute inset-6 rounded-full bg-gradient-brand shadow-[0_0_15px_rgba(var(--brand-rgb),0.5)]" />
        
        {/* Floating particles */}
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-75" />
        <div className="absolute bottom-2 left-1 w-2 h-2 bg-brand rounded-full animate-bounce delay-150" />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-brand font-medium tracking-widest text-sm uppercase animate-pulse">
          {text}
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand/40 animate-[bounce_1s_infinite_0ms]" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand/60 animate-[bounce_1s_infinite_200ms]" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand/80 animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
}
