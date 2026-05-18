"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  angle: number;
  velocity: number;
}

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // ✅ PERFORMANCE: Disable on mobile/low-end devices entirely
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReduced) return;

    setIsEnabled(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ['#ff3b3b', '#8b5cf6', '#3b82f6', '#ec4899', '#6366f1'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // ✅ PERFORMANCE: Reduced from 250 to 80 particles on desktop
      const count = 80;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x, y, baseX: x, baseY: y,
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          velocity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    let lastTime = 0;
    const TARGET_FPS = 30; // ✅ Throttle to 30fps instead of 60fps
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const drawParticles = (time: number) => {
      animationFrameId = requestAnimationFrame(drawParticles);

      // Throttle to 30fps
      if (time - lastTime < FRAME_INTERVAL) return;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += 0.008;
        const fluidX = Math.cos(p.angle) * 1.5;
        const fluidY = Math.sin(p.angle) * 1.5;

        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distSq = dx * dx + dy * dy; // ✅ Avoid sqrt when not needed
        const maxDistSq = 200 * 200;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const force = (200 - dist) / 200;
          p.x -= (dx / dist) * force * 30;
          p.y -= (dy / dist) * force * 30;
        } else {
          p.x += (p.baseX + fluidX - p.x) * 0.03;
          p.y += (p.baseY + fluidY - p.y) * 0.03;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.18;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    resizeCanvas();
    animationFrameId = requestAnimationFrame(drawParticles);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
