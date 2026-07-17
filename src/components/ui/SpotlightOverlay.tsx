import { useEffect, useState } from "react";

export function SpotlightOverlay() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 }); // Start off-screen
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.15) 0%, transparent 80%)`,
        mixBlendMode: "difference",
      }}
    />
  );
}
