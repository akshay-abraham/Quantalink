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
    
    // The initial "fly-in" animation. After it completes, the physics-based
    // or AI-based animations take over.
    const animTimeout = setTimeout(() => {
      if (petRef.current) {
        const rect = petRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
      setIsAnimatingIn(false);
    }, 1000); 

    // Cleanup function to clear all timers and animation frames when the pet is despawned.
    return () => {
      clearTimeout(animTimeout);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Track the mouse position globally.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /** Ghost AI: A state machine for unpredictable behavior. */
  const runGhostAI = useCallback(() => {
    if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);

    // The sequence of states is more deliberate now: Swoosh -> Hide -> Stalk
    const states: GhostState[] = ['swooshing', 'hiding', 'stalking'];
    const nextState = states[Math.floor(Math.random() * states.length)];
    
    // Define durations for each state for more controlled behavior.
    const stateDuration = {
      swooshing: 3000, // A long, graceful, and unsettling dash.
      hiding: 1500, // A brief, jarring disappearance.
      stalking: 8000 + Math.random() * 7000, // A long, slow, menacing drift (8-15 seconds).
    }[nextState];

    const executeState = (state: GhostState) => {
      let animId: number;
      
      if (state === 'hiding') {
        setIsVisible(false);
        // After hiding, teleport to a new spot and transition to the next state.
        ghostStateTimeout.current = setTimeout(() => {
          const newX = Math.random() * (window.innerWidth - 60);
          const newY = Math.random() * (window.innerHeight - 60);
          setPosition({ x: newX, y: newY });
          setIsVisible(true);
          runGhostAI();
        }, 1500); // 1.5s invisible time
        return;
      }
      
      // Common movement logic for 'stalking' and 'swooshing'
      setIsVisible(true);
      const targetX = Math.random() * (window.innerWidth - 60);
      const targetY = Math.random() * (window.innerHeight - 60);
      
      // 'Swooshing' uses high acceleration and low friction for a fast dash.
      // 'Stalking' uses very low acceleration for a slow drift.
      const isSwooshing = state === 'swooshing';
      const acceleration = isSwooshing ? 0.05 : 0.0005;
      const friction = isSwooshing ? 0.98 : 0.94; // Lower friction for swoosh to glide more.
      const maxSpeed = isSwooshing ? 10 : 0.5;

      let { vx, vy } = { vx: 0, vy: 0 };
      
      let startTime = performance.now();
      const move = (currentTime: number) => {
        // When the state's duration is up, cancel this animation and start the next AI cycle.
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
    };

    executeState(nextState);
  }, []);

  // Run the AI for the ghost when it spawns.
  useEffect(() => {
    if (type === 'ghost' && !isAnimatingIn) {
      runGhostAI();
    }
    // Cleanup for ghost AI
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
         <PetIcon className="w-full h-full" />
      </div>
    </div>,
    container
  );
};

export default PagePet;
