import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  delay: number;
  opacity: number;
  active: boolean;
}

export function ParticleCanvas({ trigger = true }: { trigger?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#ec4899', '#f59e0b'];
    let mouse = { x: -1000, y: -1000 };
    let startTime = Date.now();
    let hasTriggered = false;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < numParticles; i++) {
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height;
        
        particles.push({
          x: canvas.width / 2, // Start from center
          y: canvas.height / 2,
          targetX,
          targetY,
          size: Math.random() * 2.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2000, // Stagger up to 2 seconds
          opacity: 0,
          active: false
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (trigger && !hasTriggered) {
        hasTriggered = true;
        startTime = Date.now();
      }

      const elapsed = hasTriggered ? Date.now() - startTime : 0;

      particles.forEach(p => {
        if (hasTriggered && elapsed > p.delay) {
          p.active = true;
        }

        if (p.active) {
          // Fade in
          if (p.opacity < 1) {
            p.opacity += 0.02;
            if (p.opacity > 1) p.opacity = 1;
          }

          // Move towards target initially (entry animation)
          const dxTarget = p.targetX - p.x;
          const dyTarget = p.targetY - p.y;
          const distToTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);
          
          if (distToTarget > 2) {
             p.x += dxTarget * 0.05;
             p.y += dyTarget * 0.05;
          } else {
             // Normal drift after reaching target
             p.x += p.vx;
             p.y += p.vy;

             if (p.x < 0) p.x = canvas.width;
             if (p.x > canvas.width) p.x = 0;
             if (p.y < 0) p.y = canvas.height;
             if (p.y > canvas.height) p.y = 0;
          }

          // Mouse interaction
          const dxMouse = mouse.x - p.x;
          const dyMouse = mouse.y - p.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          const maxDist = 200;

          if (distMouse < maxDist) {
            const force = (maxDist - distMouse) / maxDist;
            p.x -= (dxMouse / distMouse) * force * 4;
            p.y -= (dyMouse / distMouse) * force * 4;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          
          // Apply opacity to color
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-80"
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
