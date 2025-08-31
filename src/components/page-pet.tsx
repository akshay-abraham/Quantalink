/**
 * @file src/components/page-pet.tsx
 * @description A component to render a "pet" (a cat or a ghost) that roams the entire page.
 *              It's used to provide persistent, fun feedback after the Quantum Conundrum game.
 *              The pet's movement is physics-based and interactive.
 * @note This is a client component due to its heavy use of state, effects, and direct DOM interaction.
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Cat, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PetState } from '@/lib/pet-state';
import { FunParticles } from './easter-egg';

/** A speech bubble component for the cat's "Meow!". */
const MeowBubble = () => (
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-lg text-sm text-foreground shadow-lg whitespace-nowrap animate-fade-in">
    Meow!
  </div>
);

type GhostState = 'stalking' | 'hiding' | 'swooshing';

/**
 * PagePet component renders a pet that moves around the screen.
 * Its state (alive/ghost) is controlled globally.
 * @param {PetState} props - The props for the component, containing type and start coordinates.
 * @returns {React.ReactPortal | null} A portal rendering the pet div, or null if not mounted.
 */
const PagePet = ({ type, startX, startY }: PetState) => {
  const [position, setPosition] = useState({ x: startX || 50, y: startY || 50 });
  const [velocity, setVelocity] = useState({
    vx: Math.random() * 2 - 1, // Start with random velocity.
    vy: Math.random() * 2 - 1,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [showMeow, setShowMeow] = useState(false);
  
  // --- Ghost-specific state ---
  const [isVisible, setIsVisible] = useState(true);
  const ghostStateTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    setIsMounted(true);
    
    const animTimeout = setTimeout(() => {
      if (petRef.current) {
        const rect = petRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
      setIsAnimatingIn(false);
    }, 1000); 

    return () => {
      clearTimeout(animTimeout);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /** Ghost AI: A more aggressive state machine. */
  const runGhostAI = useCallback(() => {
    if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);

    // New aggressive state order
    const states: GhostState[] = ['swooshing', 'hiding', 'stalking'];
    const nextState = states[Math.floor(Math.random() * states.length)];
    
    // Stalking is short, others are longer
    const stateDuration = nextState === 'stalking' 
        ? 2000 // Very short 2s stalk
        : Math.random() * 7000 + 8000; // 8-15s for swoosh/hide


    const executeState = (state: GhostState) => {
      let animId: number;
      
      if (state === 'hiding') { // Teleport logic
        setIsVisible(false);
        ghostStateTimeout.current = setTimeout(() => {
          const newX = Math.random() * (window.innerWidth - 60);
          const newY = Math.random() * (window.innerHeight - 60);
          setPosition({ x: newX, y: newY });
          setIsVisible(true);
          ghostStateTimeout.current = setTimeout(runGhostAI, stateDuration);
        }, 1500); // 1.5s invisible
        return;
      }
      
      // Movement logic for 'stalking' and 'swooshing'
      setIsVisible(true);
      const targetX = Math.random() * (window.innerWidth - 60);
      const targetY = Math.random() * (window.innerHeight - 60);
      
      const isSwooshing = state === 'swooshing';
      const acceleration = isSwooshing ? 0.05 : 0.002;
      const friction = isSwooshing ? 0.99 : 0.96;
      const maxSpeed = isSwooshing ? 10 : 1;

      let { vx, vy } = { vx: 0, vy: 0 };
      
      let startTime = performance.now();
      const move = (currentTime: number) => {
        if (currentTime - startTime > stateDuration) {
            cancelAnimationFrame(animId);
            runGhostAI();
            return;
        }

        setPosition(prevPos => {
          const dx = targetX - prevPos.x;
          const dy = targetY - prevPos.y;
          
          vx += dx * acceleration;
          vy += dy * acceleration;
          
          vx *= friction;
          vy *= friction;

          vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
          vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));
          
          let newX = prevPos.x + vx;
          let newY = prevPos.y + vy;

          return { x: newX, y: newY };
        });
        animId = requestAnimationFrame(move);
      };
      animId = requestAnimationFrame(move);
      
      // Safety net to transition state, though the frame check should handle it.
      ghostStateTimeout.current = setTimeout(() => {
          cancelAnimationFrame(animId);
          runGhostAI();
      }, stateDuration + 100);
    };

    executeState(nextState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (type === 'ghost' && !isAnimatingIn) {
      // Start with an aggressive swoosh
      let animId: number;
      const targetX = Math.random() * (window.innerWidth - 60);
      const targetY = Math.random() * (window.innerHeight - 60);
      let { vx, vy } = { vx: 0, vy: 0 };
      const move = () => {
          setPosition(prevPos => {
            const dx = targetX - prevPos.x;
            const dy = targetY - prevPos.y;
            vx += dx * 0.05;
            vy += dy * 0.99;
            vx = Math.max(-10, Math.min(10, vx));
            vy = Math.max(-10, Math.min(10, vy));
            return { x: prevPos.x + vx, y: prevPos.y + vy };
          });
          animId = requestAnimationFrame(move);
        };
      animId = requestAnimationFrame(move);

      const swooshTimeout = setTimeout(() => {
        cancelAnimationFrame(animId);
        runGhostAI();
      }, 3000); // 3-second initial swoosh.

      return () => clearTimeout(swooshTimeout);
    }
    return () => {
      if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [type, isAnimatingIn, runGhostAI]);

  // Physics-based animation loop for the 'alive' cat.
  useEffect(() => {
    if (isAnimatingIn || type !== 'alive') return;

    const animate = () => {
      let { vx, vy } = velocity;
      
      if (petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          const petX = rect.left + rect.width / 2;
          const petY = rect.top + rect.height / 2;
          const dx = mousePos.current.x - petX;
          const dy = mousePos.current.y - petY;
          const distance = Math.sqrt(dx*dx + dy*dy);

          // Only follow the cursor if it's far away, making it feel more independent.
          if (distance > 50) {
            vx += dx * 0.0005; 
            vy += dy * 0.0005;
          }
      }
      
      vx *= 0.98; // Friction
      vy *= 0.98;

      const maxSpeed = 1.5;
      vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
      vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));
      
      setVelocity({vx, vy});

      setPosition(prevPos => {
        let newX = prevPos.x + vx;
        let newY = prevPos.y + vy;
        
        // Bounce off edges to stay within view
        if (newX <= 0 || newX >= window.innerWidth - 48) {
            vx *= -1.1; // Add a little extra push on bounce
            newX = prevPos.x + vx;
        }
        if (newY <= 0 || newY >= window.innerHeight - 48) {
            vy *= -1.1;
            newY = prevPos.y + vy;
        }
        
        return { x: newX, y: newY };
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [type, velocity, isAnimatingIn]);
  
  useEffect(() => {
    if (showMeow) {
      const timer = setTimeout(() => {
        setShowMeow(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showMeow]);

  if (!isMounted || !type) return null;

  const PetIcon = type === 'alive' ? Cat : Ghost;
  const petClasses = type === 'alive' 
    ? 'animate-cat-colors' 
    : 'animate-ghost-colors';

  const container = document.getElementById('pet-container');
  if (!container) return null;

  const initialRandomX = Math.random() * (window.innerWidth - 100) + 50;
  const initialRandomY = Math.random() * (window.innerHeight - 100) + 50;
  
  const style: React.CSSProperties = isAnimatingIn
    ? {
        position: 'fixed',
        width: '48px',
        height: '48px',
        zIndex: 9999,
        pointerEvents: 'none',
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--final-x': `${initialRandomX}px`,
        '--final-y': `${initialRandomY}px`,
        top: 0,
        left: 0,
      }
    : {
        position: 'fixed',
        width: '48px',
        height: '48px',
        zIndex: 9999,
        pointerEvents: 'auto',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px) scale(1.2) rotate(${velocity.vx * 10}deg)`,
        transition: 'opacity 0.75s ease-in-out',
        opacity: isVisible ? 1 : 0,
      };

  const handlePetInteraction = () => {
    if (type === 'alive') {
      setShowMeow(true);
    }
  };

  return ReactDOM.createPortal(
    <div
      ref={petRef}
      className={cn(
        petClasses,
        isAnimatingIn && 'animate-fly-in'
      )}
      style={style}
      onClick={handlePetInteraction}
      onMouseEnter={handlePetInteraction}
      title={type === 'ghost' ? "A vengeful spirit" : "A friendly cat"}
    >
      {showMeow && type === 'alive' && <MeowBubble />}
      <div className="relative w-full h-full">
         <FunParticles type={type === 'alive' ? 'ambient_cat' : 'ambient_ghost'} count={5} />
         <PetIcon className="w-full h-full" />
      </div>
    </div>,
    container
  );
};

export default PagePet;
