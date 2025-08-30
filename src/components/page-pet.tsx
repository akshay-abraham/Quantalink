/**
 * @file src/components/page-pet.tsx
 * @description A component to render a "pet" (a cat or a ghost) that roams the entire page.
 *              It's used to provide persistent, fun feedback after the Quantum Conundrum game.
 * @note This is a client component due to its heavy use of state, effects, and direct DOM interaction.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Cat, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';

type PetType = 'alive' | 'ghost';

interface PagePetProps {
  type: PetType;
  onReset: () => void;
}

const PagePet = ({ type, onReset }: PagePetProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
  });
  const [isMounted, setIsMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mount the component into a portal in the body
  useEffect(() => {
    setIsMounted(true);
    // Set a timeout to automatically reset the pet after 10 minutes (600,000 ms)
    timeoutRef.current = setTimeout(() => {
      onReset();
    }, 600000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onReset]);
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setPosition((prevPos) => {
        let { vx, vy } = velocity;

        // If it's a cat, it's attracted to the mouse cursor
        if (type === 'alive' && petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          const petX = rect.left + rect.width / 2;
          const petY = rect.top + rect.height / 2;
          
          const dx = mousePos.current.x - petX;
          const dy = mousePos.current.y - petY;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          // Add a force towards the mouse
          if (distance > 50) { // Don't get too close
            vx += dx * 0.0005;
            vy += dy * 0.0005;
          }
        }
        
        // Add some random drift for the ghost
        if (type === 'ghost') {
            vx += (Math.random() - 0.5) * 0.1;
            vy += (Math.random() - 0.5) * 0.1;
        }

        // Clamp velocity
        vx = Math.max(-1.5, Math.min(1.5, vx));
        vy = Math.max(-1.5, Math.min(1.5, vy));
        
        // Update velocity state for next frame
        setVelocity({vx, vy});

        let newX = prevPos.x + vx;
        let newY = prevPos.y + vy;

        // Wall bouncing logic
        if (newX <= 0 || newX >= window.innerWidth - 50) vx *= -1;
        if (newY <= 0 || newY >= window.innerHeight - 50) vy *= -1;
        
        newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 50, newY));

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [type, velocity]);

  if (!isMounted) return null;

  const PetIcon = type === 'alive' ? Cat : Ghost;
  const petClasses = type === 'alive' ? 'text-green-500' : 'text-sky-400 opacity-80';

  // Use a Portal to render the pet at the root of the body
  return ReactDOM.createPortal(
    <div
      ref={petRef}
      className={cn(
        "fixed w-12 h-12 z-[9999] pointer-events-none animate-fade-in",
        "transition-transform duration-500 ease-out",
        petClasses
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(1.2) rotate(${velocity.vx * 10}deg)`,
      }}
    >
      <PetIcon className="w-full h-full" />
    </div>,
    document.getElementById('pet-container')!
  );
};

export default PagePet;
