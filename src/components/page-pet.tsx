/**
 * @file src/components/page-pet.tsx
 * @description A component to render a "pet" (a cat or a ghost) that roams the entire page.
 *              It's used to provide persistent, fun feedback after the Quantum Conundrum game.
 *              The pet's movement is physics-based and interactive.
 * @note This is a client component due to its heavy use of state, effects, and direct DOM interaction.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Cat, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PetState, setPet } from '@/lib/pet-state';

interface PagePetProps {
  type: PetState;
}

/**
 * PagePet component renders a pet that moves around the screen.
 * Its state (alive/ghost) is controlled globally.
 * @param {PagePetProps} props - The props for the component.
 * @returns {React.ReactPortal | null} A portal rendering the pet div, or null if not mounted.
 */
const PagePet = ({ type }: PagePetProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({
    vx: Math.random() * 2 - 1, // Start with random velocity.
    vy: Math.random() * 2 - 1,
  });
  const [isMounted, setIsMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This effect runs once to indicate the component is ready to be rendered in a portal.
  // It also sets a timeout to automatically dismiss the pet after 10 minutes.
  useEffect(() => {
    setIsMounted(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPet(null); // This will trigger the global state update and unmount the pet.
    }, 600000); // 10 minutes in milliseconds.

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [type]);
  
  // This effect tracks the user's mouse position.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // This is the main animation loop for the pet's movement.
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setPosition((prevPos) => {
        let { vx, vy } = velocity;

        // **Interaction Logic:**
        // If the pet is a cat, it's attracted to the mouse cursor.
        if (type === 'alive' && petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          const petX = rect.left + rect.width / 2;
          const petY = rect.top + rect.height / 2;
          
          const dx = mousePos.current.x - petX;
          const dy = mousePos.current.y - petY;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          // Add a small force vector towards the mouse.
          if (distance > 50) { // Don't get too close.
            vx += dx * 0.0005;
            vy += dy * 0.0005;
          }
        }
        
        // If it's a ghost, add some random, spooky drift.
        if (type === 'ghost') {
            vx += (Math.random() - 0.5) * 0.1;
            vy += (Math.random() - 0.5) * 0.1;
        }

        // Clamp velocity to prevent it from getting too fast.
        vx = Math.max(-1.5, Math.min(1.5, vx));
        vy = Math.max(-1.5, Math.min(1.5, vy));
        
        setVelocity({vx, vy}); // Update velocity state for the next frame.

        let newX = prevPos.x + vx;
        let newY = prevPos.y + vy;

        // Wall bouncing logic.
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

  if (!isMounted || !type) return null;

  const PetIcon = type === 'alive' ? Cat : Ghost;
  const petClasses = type === 'alive' ? 'text-green-500' : 'text-sky-400 opacity-80';

  // Use a Portal to render the pet at the root of the body, allowing it to float above all other content.
  const container = document.getElementById('pet-container');
  if (!container) return null;

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
        // Add a slight rotation based on horizontal velocity for a more dynamic feel.
        transform: `scale(1.2) rotate(${velocity.vx * 10}deg)`,
      }}
    >
      <PetIcon className="w-full h-full" />
    </div>,
    container
  );
};

export default PagePet;
