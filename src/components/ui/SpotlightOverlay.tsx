import { useEffect, useRef } from "react";

export function SpotlightOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (overlayRef.current) {
          overlayRef.current.style.background = `radial-gradient(circle 400px at ${e.clientX}px ${e.clientY}px, rgba(255, 255, 255, 0.15) 0%, transparent 80%)`;
        }
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 400px at -1000px -1000px, rgba(255, 255, 255, 0.15) 0%, transparent 80%)`,
        mixBlendMode: "difference",
      }}
    />
  );
}
