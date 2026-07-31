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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-react';
import { Cat, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PetState } from '@/lib/pet-state';

/**
 * Easy-to-edit display sizes for the pets. Increase `alive` if the cat should
 * be larger; movement bounds automatically use the matching size.
 */
export const PET_SIZE = {
  alive: 250,
  ghost: 75,
} as const;

const PET_PADDING = 12;
const CAT_MIN_SPEED = 0.45;
const CAT_MAX_SPEED = 1.8;

/** A speech bubble component for the cat's "Meow!". */
const MeowBubble = () => (
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-lg text-sm text-foreground shadow-lg whitespace-nowrap animate-fade-in">
    Meow!
  </div>
);

type GhostState = 'stalking' | 'hiding' | 'swooshing';

/** Renders a Lottie pet and falls back to its Lucide icon if it cannot load. */
const LottiePet = ({
  src,
  className,
  fallback,
  ariaLabel,
}: {
  src: string;
  className: string;
  fallback: React.ReactNode;
  ariaLabel: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  useEffect(() => {
    if (!dotLottie) return;

    const handleError = () => setHasError(true);
    dotLottie.addEventListener('loadError', handleError);
    dotLottie.addEventListener('renderError', handleError);

    return () => {
      dotLottie.removeEventListener('loadError', handleError);
      dotLottie.removeEventListener('renderError', handleError);
    };
  }, [dotLottie]);

  if (hasError) return fallback;

  return (
    <DotLottieReact
      src={src}
      loop
      autoplay
      className={className}
      dotLottieRefCallback={setDotLottie}
      onError={() => setHasError(true)}
      aria-label={ariaLabel}
    />
  );
};

const GhostPet = ({ className }: { className: string }) => (
  <LottiePet
    src="/spooky_floating_ghost.lottie"
    className={className}
    fallback={<Ghost className={className} />}
    ariaLabel="Ghost pet"
  />
);

const CatPet = ({ className }: { className: string }) => (
  <LottiePet
    src="/Space%20Cat.lottie"
    className={className}
    fallback={<Cat className={className} />}
    ariaLabel="Space cat pet"
  />
);

/**
 * PagePet component renders a pet that moves around the screen.
 * Its state (alive/ghost) is controlled globally.
 * @param {PetState} props - The props for the component, containing type and start coordinates.
 * @returns {React.ReactPortal | null} A portal rendering the pet div, or null if not mounted.
 */
const PagePet = ({ type, startX, startY }: PetState) => {
  const [position, setPosition] = useState({
    x: startX ?? 50,
    y: startY ?? 50,
  });
  const positionRef = useRef({
    x: startX ?? 50,
    y: startY ?? 50,
  });
  const velocityRef = useRef({
    vx: Math.random() * 1.2 - 0.6,
    vy: Math.random() * 1.2 - 0.6,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [showMeow, setShowMeow] = useState(false);

  // --- Ghost-specific state ---
  const [isVisible, setIsVisible] = useState(true);
  const ghostStateTimeout = useRef<NodeJS.Timeout | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const hasMousePosition = useRef(false);
  const petRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const catTarget = useRef({ x: 0, y: 0 });
  const [initialRandomPosition, setInitialRandomPosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    setIsMounted(true);
    const size = PET_SIZE[type ?? 'ghost'];
    setInitialRandomPosition({
      x: PET_PADDING + Math.random() * Math.max(1, window.innerWidth - size - PET_PADDING * 2),
      y: PET_PADDING + Math.random() * Math.max(1, window.innerHeight - size - PET_PADDING * 2),
    });

    // The initial "fly-in" animation. After it completes, the physics-based
    // or AI-based animations take over.
    const animTimeout = setTimeout(() => {
      if (petRef.current) {
        const rect = petRef.current.getBoundingClientRect();
        const nextPosition = { x: rect.left, y: rect.top };
        positionRef.current = nextPosition;
        setPosition(nextPosition);
      }
      setIsAnimatingIn(false);
    }, 1000);

    // Cleanup function to clear all timers and animation frames when the pet is despawned.
    return () => {
      clearTimeout(animTimeout);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (ghostStateTimeout.current) clearTimeout(ghostStateTimeout.current);
    };
  }, [type]);

  // Track the mouse position globally.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      hasMousePosition.current = true;
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
      if (state === 'hiding') {
        setIsVisible(false);
        // After hiding, teleport to a new spot and transition to the next state.
        ghostStateTimeout.current = setTimeout(() => {
          const size = PET_SIZE.ghost;
          const newX = Math.random() * Math.max(1, window.innerWidth - size);
          const newY = Math.random() * Math.max(1, window.innerHeight - size);
          const nextPosition = { x: newX, y: newY };
          positionRef.current = nextPosition;
          setPosition(nextPosition);
          setIsVisible(true);
          runGhostAI();
        }, 1500); // 1.5s invisible time
        return;
      }

      // Common movement logic for 'stalking' and 'swooshing'
      setIsVisible(true);
      const size = PET_SIZE.ghost;
      const targetX = Math.random() * Math.max(1, window.innerWidth - size);
      const targetY = Math.random() * Math.max(1, window.innerHeight - size);

      // 'Swooshing' uses high acceleration and low friction for a fast dash.
      // 'Stalking' uses very low acceleration for a slow drift.
      const isSwooshing = state === 'swooshing';
      const acceleration = isSwooshing ? 0.05 : 0.0005;
      const friction = isSwooshing ? 0.98 : 0.94; // Lower friction for swoosh to glide more.
      const maxSpeed = isSwooshing ? 10 : 0.5;

      let { vx, vy } = { vx: 0, vy: 0 };

      const startTime = performance.now();
      const move = (currentTime: number) => {
        // When the state's duration is up, cancel this animation and start the next AI cycle.
        if (currentTime - startTime > stateDuration) {
          cancelAnimationFrame(animId);
          runGhostAI();
          return;
        }

        setPosition((prevPos) => {
          const dx = targetX - prevPos.x;
          const dy = targetY - prevPos.y;

          vx += dx * acceleration;
          vy += dy * acceleration;

          vx *= friction;
          vy *= friction;

          vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
          vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));

          const newX = prevPos.x + vx;
          const newY = prevPos.y + vy;

          return { x: newX, y: newY };
        });
        animationFrameId.current = requestAnimationFrame(move);
      };
      const animId = requestAnimationFrame(move);
      animationFrameId.current = animId;
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
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [type, isAnimatingIn, runGhostAI]);

  // Autonomous, bounded animation loop for the alive cat.
  useEffect(() => {
    if (isAnimatingIn || type !== 'alive') return;

    const chooseTarget = () => {
      const maxX = Math.max(PET_PADDING, window.innerWidth - PET_SIZE.alive - PET_PADDING);
      const maxY = Math.max(PET_PADDING, window.innerHeight - PET_SIZE.alive - PET_PADDING);
      catTarget.current = {
        x: PET_PADDING + Math.random() * Math.max(1, maxX - PET_PADDING),
        y: PET_PADDING + Math.random() * Math.max(1, maxY - PET_PADDING),
      };
    };

    chooseTarget();
    const targetTimer = window.setInterval(chooseTarget, 4500);

    const animate = () => {
      let { vx, vy } = velocityRef.current;
      const size = PET_SIZE.alive;
      const maxX = Math.max(PET_PADDING, window.innerWidth - size - PET_PADDING);
      const maxY = Math.max(PET_PADDING, window.innerHeight - size - PET_PADDING);

      if (petRef.current && hasMousePosition.current) {
        const rect = petRef.current.getBoundingClientRect();
        const petX = rect.left + rect.width / 2;
        const petY = rect.top + rect.height / 2;
        const dx = mousePos.current.x - petX;
        const dy = mousePos.current.y - petY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only follow the cursor if it's far away, making it feel more independent.
        if (distance > 50) {
          vx += dx * 0.00015;
          vy += dy * 0.00015;
        }
      }

      // Always steer toward a changing target, including on touch devices.
      vx +=
        (catTarget.current.x - positionRef.current.x) * 0.00045 +
        (Math.random() - 0.5) * 0.012;
      vy +=
        (catTarget.current.y - positionRef.current.y) * 0.00045 +
        (Math.random() - 0.5) * 0.012;

      // Keep the pet away from viewport edges instead of allowing corner drift.
      if (positionRef.current.x < PET_PADDING) vx += 0.08;
      if (positionRef.current.x > maxX) vx -= 0.08;
      if (positionRef.current.y < PET_PADDING) vy += 0.08;
      if (positionRef.current.y > maxY) vy -= 0.08;

      vx *= 0.985;
      vy *= 0.985;

      const speed = Math.hypot(vx, vy);
      if (speed > CAT_MAX_SPEED) {
        vx = (vx / speed) * CAT_MAX_SPEED;
        vy = (vy / speed) * CAT_MAX_SPEED;
      } else if (speed < CAT_MIN_SPEED) {
        const angle = Math.atan2(vy || Math.random() - 0.5, vx || Math.random() - 0.5);
        vx = Math.cos(angle) * CAT_MIN_SPEED;
        vy = Math.sin(angle) * CAT_MIN_SPEED;
      }

      velocityRef.current = { vx, vy };

      setPosition((prevPos) => {
        const nextPosition = {
          x: Math.min(maxX, Math.max(PET_PADDING, prevPos.x + vx)),
          y: Math.min(maxY, Math.max(PET_PADDING, prevPos.y + vy)),
        };
        positionRef.current = nextPosition;
        return nextPosition;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      window.clearInterval(targetTimer);
    };
  }, [type, isAnimatingIn]);

  useEffect(() => {
    if (showMeow) {
      const timer = setTimeout(() => {
        setShowMeow(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showMeow]);

  if (!isMounted || !type) return null;

  const petClasses =
    type === 'alive' ? 'animate-cat-colors' : 'animate-ghost-colors';

  const container = document.getElementById('pet-container');
  if (!container) return null;

  const petSize = PET_SIZE[type];
  const style: React.CSSProperties & Record<`--${string}`, string> =
    isAnimatingIn
      ? {
          position: 'fixed',
          width: `${petSize}px`,
          height: `${petSize}px`,
          zIndex: 9999,
          pointerEvents: 'none',
          '--start-x': `${startX ?? position.x}px`,
          '--start-y': `${startY ?? position.y}px`,
          '--final-x': `${initialRandomPosition.x}px`,
          '--final-y': `${initialRandomPosition.y}px`,
          top: 0,
          left: 0,
        }
      : {
          position: 'fixed',
          width: `${petSize}px`,
          height: `${petSize}px`,
          zIndex: 9999,
          pointerEvents: 'auto',
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
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
      className={cn(petClasses, isAnimatingIn && 'animate-fly-in')}
      style={style}
      onClick={handlePetInteraction}
      onMouseEnter={handlePetInteraction}
      title={type === 'ghost' ? 'A vengeful spirit' : 'A friendly cat'}
    >
      {showMeow && type === 'alive' && <MeowBubble />}
      <div className="relative w-full h-full">
        {type === 'alive' ? (
          <CatPet className="w-full h-full" />
        ) : (
          <GhostPet className="w-full h-full" />
        )}
      </div>
    </div>,
    container
  );
};

export default PagePet;
