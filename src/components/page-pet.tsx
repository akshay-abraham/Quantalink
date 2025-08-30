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
  const mousePos = useRef({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This effect runs once to indicate the component is ready to be rendered in a portal.
  // It also sets a timeout to automatically dismiss the pet after 2 minutes.
  useEffect(() => {
    setIsMounted(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPet(null); // This will trigger the global state update and unmount the pet.
    }, 120000); // 2 minutes in milliseconds.
    
    // Disable the intro animation after it has played.
    const animTimeout = setTimeout(() => setIsAnimatingIn(false), 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(animTimeout);
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
    if (isAnimatingIn) return; // Don't apply physics during the fly-in animation.

    let animationFrameId: number;

    const animate = () => {
      setPosition((prevPos) => {
        let { vx, vy } = velocity;
        
        if (petRef.current) {
            const rect = petRef.current.getBoundingClientRect();
            const petX = rect.left + rect.width / 2;
            const petY = rect.top + rect.height / 2;
            const dx = mousePos.current.x - petX;
            const dy = mousePos.current.y - petY;
            const distance = Math.sqrt(dx*dx + dy*dy);

            // **Interaction Logic:**
            // The live cat is attracted to the cursor.
            if (type === 'alive') {
              if (distance > 50) { // Don't get too close.
                vx += dx * 0.0005;
                vy += dy * 0.0005;
              }
            // The ghost is repelled by the cursor.
            } else if (type === 'ghost') {
                if (distance < 150) { // Only when cursor is near.
                    vx -= dx * 0.0008;
                    vy -= dy * 0.0008;
                }
                // Add some random, spooky drift.
                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;
            }
        }
        
        // Clamp velocity to prevent it from getting too fast.
        vx = Math.max(-1.5, Math.min(1.5, vx));
        vy = Math.max(-1.5, Math.min(1.5, vy));
        
        setVelocity({vx, vy}); // Update velocity state for the next frame.

        let newX = prevPos.x + vx;
        let newY = prevPos.y + vy;

        // Wall bouncing logic.
        if (newX <= 0 || newX >= window.innerWidth - 50) {
            vx *= -1;
            newX = prevPos.x + vx;
        }
        if (newY <= 0 || newY >= window.innerHeight - 50) {
            vy *= -1;
            newY = prevPos.y + vy;
        }
        
        newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 50, newY));

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [type, velocity, isAnimatingIn]);

  if (!isMounted || !type) return null;

  const PetIcon = type === 'alive' ? Cat : Ghost;
  const petClasses = type === 'alive' ? 'text-green-500' : 'text-sky-400 opacity-80';

  // Use a Portal to render the pet at the root of the body, allowing it to float above all other content.
  const container = document.getElementById('pet-container');
  if (!container) return null;

  const initialRandomX = Math.random() * (window.innerWidth - 100) + 50;
  const initialRandomY = Math.random() * (window.innerHeight - 100) + 50;
  
  const style: React.CSSProperties = {
    position: 'fixed',
    width: '48px',
    height: '48px',
    zIndex: 9999,
    pointerEvents: 'none',
    '--start-x': `${startX}px`,
    '--start-y': `${startY}px`,
    '--end-x': `${position.x}px`,
    '--end-y': `${position.y}px`,
    '--final-x': `${initialRandomX}px`,
    '--final-y': `${initialRandomY}px`,
    top: 0,
    left: 0,
    transform: `translate(${position.x}px, ${position.y}px) scale(1.2) rotate(${velocity.vx * 10}deg)`,
    transition: 'transform 0.5s ease-out',
  };


  return ReactDOM.createPortal(
    <div
      ref={petRef}
      className={cn(
        petClasses,
        isAnimatingIn && 'animate-fly-in'
      )}
      style={style}
      onAnimationEnd={() => {
        setPosition({x: initialRandomX, y: initialRandomY})
        setIsAnimatingIn(false);
      }}
    >
      <PetIcon className="w-full h-full" />
    </div>,
    container
  );
};

export default PagePet;
