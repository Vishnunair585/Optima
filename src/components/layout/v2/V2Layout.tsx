import { ReactNode } from "react";
import { V2Sidebar } from "./V2Sidebar";
import { V2TopNav } from "./V2TopNav";
import { V2BottomNav } from "./V2BottomNav";
import { SpotlightOverlay } from "../../ui/SpotlightOverlay";

export function V2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground selection:bg-brand/30">
      <SpotlightOverlay />
      
      {/* Sidebar - Desktop Only */}
      <V2Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-dvh md:pl-64 pb-16 md:pb-0 transition-all">
        <V2TopNav />
        <main className="flex-1 relative">
          {children}
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <V2BottomNav />
    </div>
  );
}
