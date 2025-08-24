/**
 * @file src/components/animated-background.tsx
 * @description A client component that renders a canvas-based animation inspired by Quantum Electrodynamics (QED).
 *              It features charged particles, photon exchanges, and vacuum fluctuations to create a dynamic,
 *              ambient background for the entire application.
 * @note This is a client component (`"use client"`) because it directly interacts with the DOM (canvas)
 *       and uses browser APIs for animation (`requestAnimationFrame`) and event handling.
 */
"use client";

import React, { useRef, useEffect } from 'react';

/**
 * AnimatedBackground component creates a dynamic, physics-based visual effect.
 * @returns {JSX.Element} A canvas element that fills the viewport.
 */
const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  /**
   * The `useEffect` hook runs the setup function once when the component mounts.
   * It returns the cleanup function to be executed when the component unmounts.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animation constants
    let lastFrameTime = 0;
    const targetFPS = 27; // Capped at 27 FPS for performance on all devices.
    const frameInterval = 1000 / targetFPS;

    // Simulation state variables
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Performance and density settings are adapted based on device screen size.
    const isMobile = width <= 768;
    let maxParticles = isMobile ? 20 : 30; // Fewer particles on mobile.
    let virtualPairSpawnRate = isMobile ? 0.15 : 0.25; // Slower spawn rate on mobile.

    const particlePool: Particle[] = [];
    const activeParticles: Particle[] = [];

    // --- Particle Class Definition ---
    // Represents a single point in the quantum field, either "real" or "virtual".
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      charge: 1 | -1; // Positive or negative charge, influencing interactions.
      color: string;
      auraRadius: number;
      auraPulse: number;
      auraMax: number;
      inUse: boolean = false; // Flag for object pooling.
      isVirtual: boolean; // Virtual particles have a limited lifespan.
      life: number = 1;

      constructor(isVirtual = false) {
        this.isVirtual = isVirtual;
        this.reset();
      }

      /**
       * Resets a particle's properties to new random values. Used for object pooling.
       * @param {number} [x] - Optional initial x position.
       * @param {number} [y] - Optional initial y position.
       * @param {1 | -1} [charge] - Optional charge.
       * @returns {this} The particle instance for chaining.
       */
      reset(x?: number, y?: number, charge?: 1 | -1) {
        this.x = x ?? Math.random() * width;
        this.y = y ?? Math.random() * height;
        this.vx = Math.random() * 0.4 - 0.2; // Slow, gentle drift.
        this.vy = Math.random() * 0.4 - 0.2;
        this.charge = charge ?? (Math.random() > 0.5 ? 1 : -1);
        this.radius = this.isVirtual ? 1.2 : Math.random() * 1.5 + 1;
        this.color = this.charge > 0 ? 'hsl(210, 100%, 75%)' : 'hsl(340, 100%, 75%)';
        
        // Aura properties for the glowing field effect.
        this.auraMax = this.isVirtual ? 0 : this.radius + 8;
        this.auraPulse = Math.random() * Math.PI * 2;
        this.auraRadius = this.auraMax / 2;

        this.life = this.isVirtual ? Math.random() * 0.6 + 0.3 : 1; // Virtual particles decay.
        this.inUse = true;
        return this;
      }
      
      /**
       * Updates the particle's state for the current frame.
       * @param {Particle[]} particles - The list of all active particles for interaction checks.
       */
      update(particles: Particle[]) {
        // Real particles interact with each other based on charge (attraction/repulsion).
        if (!this.isVirtual) {
          particles.forEach(other => {
            if (this === other || !other.inUse || other.isVirtual) return;
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 200 * 200) { // Check if within interaction range.
              const force = (this.charge * other.charge) / distSq;
              const angle = Math.atan2(dy, dx);
              this.vx -= Math.cos(angle) * force * 2.5;
              this.vy -= Math.sin(angle) * force * 2.5;
            }
          });
        }
        
        // Update position based on velocity.
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off the screen edges.
        if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
        
        // Animate the pulsing aura.
        this.auraPulse += 0.03;
        this.auraRadius = this.auraMax * (0.6 + Math.sin(this.auraPulse) * 0.4);

        // Decay the life of virtual particles.
        if (this.isVirtual) {
          this.life -= 0.01;
          if (this.life <= 0) {
            this.inUse = false; // Mark for removal from active list.
          }
        }
      }

      /**
       * Draws the particle and its aura onto the canvas.
       */
      draw() {
        if (!ctx) return;
        
        // Draw the soft outer aura using a radial gradient.
        const auraAlpha = this.isVirtual ? this.life * 0.25 : 0.15;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.auraRadius);
        gradient.addColorStop(0, `${this.color.slice(0, -1)}, ${auraAlpha})`);
        gradient.addColorStop(1, `hsla(0, 0%, 100%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw the bright inner core of the particle.
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const coreAlpha = this.isVirtual ? this.life * 0.9 : 1;
        ctx.fillStyle = `hsla(${this.charge > 0 ? 210 : 340}, 100%, 80%, ${coreAlpha})`;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for other elements.
      }
    }

    // --- Object Pooling Functions ---
    // For performance, we reuse old particle objects instead of creating new ones.
    const getParticle = (isVirtual = false) => {
        const available = particlePool.filter(p => !p.inUse && p.isVirtual === isVirtual);
        return available.length > 0 ? available[0].reset() : new Particle(isVirtual);
    }
    
    // --- Initialization ---
    // Populates the particle pools and sets the initial state.
    const init = () => {
      activeParticles.length = 0;
      particlePool.length = 0;
      for (let i = 0; i < maxParticles * 3; i++) { // Over-provision pool for virtual particles.
         particlePool.push(new Particle(i >= maxParticles));
      }
      for (let i = 0; i < maxParticles; i++) {
        activeParticles.push(getParticle(false));
      }
    }

    // --- Vacuum Fluctuations ---
    // Simulates the quantum foam by briefly spawning pairs of virtual particles.
    const spawnVirtualPair = () => {
        if (activeParticles.filter(p => p.isVirtual).length > 40) return; // Cap virtual particles.
        const x = Math.random() * width;
        const y = Math.random() * height;
        const p1 = getParticle(true).reset(x, y, 1);
        const p2 = getParticle(true).reset(x + Math.random()*10-5, y + Math.random()*10-5, -1);
        activeParticles.push(p1, p2);
    }

    // --- The Main Animation Loop ---
    const animate = (timestamp: number) => {
      // Keep the loop going, but only draw if enough time has passed to meet the target FPS.
      animationFrameId.current = requestAnimationFrame(animate);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval) {
        return; // Skip this frame.
      }
      lastFrameTime = timestamp - (elapsed % frameInterval);

      // Set the background color (a very light, almost white teal).
      ctx.fillStyle = 'hsl(180, 50%, 98%)';
      ctx.fillRect(0, 0, width, height);
      
      // Randomly trigger vacuum fluctuations.
      if (Math.random() < virtualPairSpawnRate) {
          spawnVirtualPair();
      }

      // Draw "Photon Exchange" Lines. This simulates interactions between real particles.
      for (let i = 0; i < activeParticles.length; i++) {
        for (let j = i + 1; j < activeParticles.length; j++) {
          const p1 = activeParticles[i];
          const p2 = activeParticles[j];
          if (!p1.inUse || !p2.inUse || p1.isVirtual || p2.isVirtual) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If particles are close, draw a prominent, wavy line between them.
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            // Use a quadratic curve to make the line wavy and organic.
            const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 20;
            const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 20;
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            // The line's visibility fades with distance.
            ctx.strokeStyle = `hsla(50, 100%, 70%, ${0.8 - dist / 130})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Update and Draw all active particles.
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        if (p.inUse) {
            p.update(activeParticles);
            p.draw();
        } else {
            // If a particle is no longer in use (e.g., a dead virtual particle), remove it.
            activeParticles.splice(i, 1);
        }
      }
    };

    // --- Event Listeners and Cleanup ---
    // Handles window resizing to make the canvas responsive.
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Readjust settings for the new screen size.
      const newIsMobile = width <= 768;
      maxParticles = newIsMobile ? 20 : 30;
      virtualPairSpawnRate = newIsMobile ? 0.15 : 0.25;
      init(); // Re-initialize the simulation.
    }
    
    window.addEventListener('resize', handleResize);
    
    init();
    animate(0); // Start the animation loop.

    // Cleanup function to remove event listeners when the component unmounts.
    const cleanup = () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    
    return cleanup;
  }, []);

  // Renders the canvas element, positioned fixed behind all other content.
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;
