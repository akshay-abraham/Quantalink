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
import { PetState, setPet } from '@/lib/pet-state';

// Defines the ghost's possible movement states.
type GhostState = 'stalking' | 'swooshing' | 'hiding';

/** A speech bubble component for the cat's "Meow!". */
const MeowBubble = () => (
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-lg text-sm text-foreground shadow-lg whitespace-nowrap animate-fade-in">
    Meow!
  </div>
);

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
  const [isHovered, setIsHovered] = useState(false);
  
  // --- Ghost-specific state ---
  const [ghostState, setGhostState] = useState<GhostState>('stalking');
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
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /** Ghost AI: Manages state transitions for spooky behavior. */
  const runGhostAI = useCallback(() => {
    const changeState = () => {
      // Determine the next state
      const rand = Math.random();
      if (rand < 0.6) { // 60% chance to stalk
        setGhostState('stalking');
        setIsVisible(true);
        ghostStateTimeout.current = setTimeout(changeState, Math.random() * 4000 + 3000); // Stalk for 3-7s
      } else if (rand < 0.85) { // 25% chance to hide
        setGhostState('hiding');
        setIsVisible(false);
        ghostStateTimeout.current = setTimeout(changeState, Math.random() * 2000 + 1000); // Hide for 1-3s
      } else { // 15% chance to swoosh
        setGhostState('swooshing');
        setIsVisible(true);
        ghostStateTimeout.current = setTimeout(changeState, 700); // Swoosh is a short burst
      }
    };
    changeState();
  }, []);

  useEffect(() => {
    if (type === 'ghost' && !isAnimatingIn) {
      runGhostAI();
    }
    return () => {
      if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);
    };
  }, [type, isAnimatingIn, runGhostAI]);

  useEffect(() => {
    if (isAnimatingIn) return;

    const animate = () => {
      let { vx, vy } = velocity;
      
      if (petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          const petX = rect.left + rect.width / 2;
          const petY = rect.top + rect.height / 2;
          const dx = mousePos.current.x - petX;
          const dy = mousePos.current.y - petY;
          const distance = Math.sqrt(dx*dx + dy*dy);

          if (type === 'alive') {
            if (distance > 50) {
              vx += dx * 0.0005;
              vy += dy * 0.0005;
            }
          } else if (type === 'ghost') {
              if (distance < 150) { // Repel from cursor
                  vx -= dx * 0.0008;
                  vy -= dy * 0.0008;
              }
              if (ghostState === 'stalking') {
                  vx += (Math.random() - 0.5) * 0.1; // Slow drift
                  vy += (Math.random() - 0.5) * 0.1;
              } else if (ghostState === 'swooshing') {
                  vx += (Math.random() - 0.5) * 2; // FAST, erratic movement
                  vy += (Math.random() - 0.5) * 2;
              }
          }
      }
      
      // Apply friction/drag
      vx *= 0.98;
      vy *= 0.98;

      // Clamp velocity based on pet type and state
      const maxSpeed = type === 'ghost' && ghostState === 'swooshing' ? 8 : 1.5;
      vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
      vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));
      
      setVelocity({vx, vy});

      setPosition(prevPos => {
        let newX = prevPos.x + vx;
        let newY = prevPos.y + vy;
        
        // Wall bouncing logic
        if (newX <= 0 || newX >= window.innerWidth - 50) {
            vx *= -1;
            newX = prevPos.x + vx;
        }
        if (newY <= 0 || newY >= window.innerHeight - 50) {
            vy *= -1;
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
  }, [type, velocity, isAnimatingIn, ghostState]);

  if (!isMounted || !type) return null;

  const PetIcon = type === 'alive' ? Cat : Ghost;
  const petClasses = type === 'alive' 
    ? 'text-green-500' 
    : 'text-sky-400 opacity-80';

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
        pointerEvents: 'auto', // Allow hover events on the pet
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px) scale(1.2) rotate(${velocity.vx * 10}deg)`,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-in-out',
        opacity: isVisible ? (type === 'ghost' ? 0.8 : 1) : 0,
      };

  return ReactDOM.createPortal(
    <div
      ref={petRef}
      className={cn(
        petClasses,
        isAnimatingIn && 'animate-fly-in'
      )}
      style={style}
      onMouseEnter={() => type === 'alive' && setIsHovered(true)}
      onMouseLeave={() => type === 'alive' && setIsHovered(false)}
      onClick={() => setPet(null)} // Click to dismiss
      title="Click to dismiss"
    >
      {isHovered && type === 'alive' && <MeowBubble />}
      <PetIcon className="w-full h-full" />
    </div>,
    container
  );
};

export default PagePet;

    