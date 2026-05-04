"use client";

import React, { useEffect, useRef } from 'react';

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
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    // Colors from the Antigravity screenshot
    const colors = ['#ff3b3b', '#8b5cf6', '#3b82f6', '#ec4899', '#6366f1'];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numberOfParticles = 250; // Dense enough for the effect
      
      for (let i = 0; i < numberOfParticles; i++) {
        // Create organic distribution
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particles.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          velocity: Math.random() * 0.5 + 0.2
        });
      }
    };

    const drawParticles = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid motion - Floating like water
        p.angle += 0.01;
        const fluidX = Math.cos(p.angle) * 2;
        const fluidY = Math.sin(p.angle) * 2;

        // Mouse Ripple Interaction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250; // Ripple radius

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          // Displacement like a wave
          const directionX = (dx / distance) * force * 50;
          const directionY = (dy / distance) * force * 50;
          
          p.x -= directionX;
          p.y -= directionY;
        } else {
          // Smoothly return to base position + fluid drift
          p.x += (p.baseX + fluidX - p.x) * 0.03;
          p.y += (p.baseY + fluidY - p.y) * 0.03;
        }

        // Pulse size like breathing
        const pulse = Math.sin(time * 0.002 + i) * 0.5 + 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Subtle opacity
        ctx.globalAlpha = distance < maxDist ? 0.5 : 0.2;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    requestAnimationFrame(drawParticles);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};
