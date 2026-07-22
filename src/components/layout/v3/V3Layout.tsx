import { ReactNode } from "react";
import { V3Sidebar } from "./V3Sidebar";
import { V3RightSidebar } from "./V3RightSidebar";
import { V3TopHeader } from "./V3TopHeader";
import { V3BottomNav } from "./V3BottomNav";

export function V3Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground flex justify-center">
      
      {/* Mobile Top Header (only visible on small screens) */}
      <V3TopHeader />

      <div className="w-full max-w-[1200px] flex justify-between">
        
        {/* Left Sidebar (Desktop/Tablet only) */}
        <V3Sidebar />
        
        {/* Main Feed Content Area */}
        <main className="flex-1 w-full max-w-[600px] mx-auto min-h-dvh pt-14 pb-16 md:pt-0 md:pb-0 md:ml-[72px] lg:ml-64 border-x border-border/20 md:border-transparent">
          {children}
        </main>

        {/* Right Sidebar (Desktop only) */}
        <V3RightSidebar />

      </div>

      {/* Mobile Bottom Nav (only visible on small screens) */}
      <V3BottomNav />
    </div>
  );
}
