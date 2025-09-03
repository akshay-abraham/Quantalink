/**
 * @file src/components/guided-tour.tsx
 * @description An advanced, non-intrusive guided tour for first-time visitors.
 *              It uses a cat mascot to provide contextual, auto-advancing tips,
 *              and can point to specific elements to guide user interaction.
 * @note This is a client component due to its heavy use of state, effects, and localStorage.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Cat, X, Github, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { tourSteps, TourStep } from '@/lib/tour-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export const TOUR_STORAGE_KEY = 'hasCompletedQuantumTour_v2';

type TourStatus = 'inactive' | 'running' | 'completed';
type TourDisplayState = 'closed' | 'open' | 'pointing' | 'minimized';

/**
 * A pointing arrow component to guide the user's attention.
 * @param {{ targetElementId: string }} props - Props for the component.
 * @returns {JSX.Element | null} The rendered arrow.
 */
const PointingArrow = ({ targetElementId }: { targetElementId: string }) => {
    const [position, setPosition] = useState<{ top: number, left: number } | null>(null);

    useEffect(() => {
        const target = document.getElementById(targetElementId);
        if (target) {
            const rect = target.getBoundingClientRect();
            setPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 10,
            });
        }
    }, [targetElementId]);

    if (!position) return null;

    return (
        <div 
            className="fixed z-[101] text-primary animate-point-and-blink"
            style={{ top: `${position.top}px`, left: `${position.left}px`, transform: 'translateY(-50%)' }}
        >
            <ArrowRight className="w-10 h-10" />
        </div>
    );
};

export default function GuidedTour() {
  const [status, setStatus] = useState<TourStatus>('inactive');
  const [displayState, setDisplayState] = useState<TourDisplayState>('closed');
  const [stepIndex, setStepIndex] = useState(0);
  const [targetElementId, setTargetElementId] = useState<string | null>(null);
  
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameActiveRef = useRef<boolean>(false);
  const gameContainerObserver = useRef<MutationObserver>();

  const currentStep: TourStep | null = tourSteps[stepIndex] || null;

  // Cleanup function to clear all timers and observers.
  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (gameContainerObserver.current) gameContainerObserver.current.disconnect();
  }, []);

  const advanceTour = useCallback((forceNextStep?: number) => {
    cleanup();
    const nextStepIndex = typeof forceNextStep === 'number' ? forceNextStep : stepIndex + 1;
    
    if (nextStepIndex >= tourSteps.length) {
      setStatus('completed');
      setDisplayState('minimized');
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      } catch (error) { console.error("Could not write to localStorage:", error); }
    } else {
      setStepIndex(nextStepIndex);
    }
  }, [stepIndex, cleanup]);
  
  const handleAction = useCallback((action?: TourStep['action']) => {
    if (!action) {
      advanceTour();
      return;
    }

    if (action.type === 'scroll_to') {
      const element = document.getElementById(action.elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      setTimeout(() => {
          if (action.pointTo) {
            setTargetElementId(action.pointTo);
            setDisplayState('pointing');
          }
      }, 700); // Wait for scroll to finish
    }
  }, [advanceTour]);
  
  const restartTour = () => {
    cleanup();
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY);
    } catch (error) { console.error("Could not write to localStorage:", error); }
    setStatus('running');
    setDisplayState('open');
    setStepIndex(0);
  };

  // Main effect to control tour logic based on the current step
  useEffect(() => {
    if (status !== 'running' || !currentStep) return;

    setDisplayState('open');

    // Auto-advance logic
    if (currentStep.autoAdvanceAfter) {
      timerRef.current = setTimeout(() => {
        advanceTour();
      }, currentStep.autoAdvanceAfter);
    }

    // Listener logic
    if (currentStep.awaits === 'click') {
      const targetId = currentStep.action?.pointTo;
      if (!targetId) return;

      const target = document.getElementById(targetId);
      const listener = () => {
        setDisplayState('minimized');
        setTargetElementId(null);
        if (currentStep.advancesAfter) {
            timerRef.current = setTimeout(() => {
                advanceTour();
            }, currentStep.advancesAfter);
        }
      };
      
      target?.addEventListener('click', listener, { once: true });
      return () => target?.removeEventListener('click', listener);
    }

    // Game completion listener
    if (currentStep.awaits === 'game_completion') {
        const listener = () => {
            advanceTour();
        };
        window.addEventListener('gameCompleted', listener, { once: true });
        return () => window.removeEventListener('gameCompleted', listener);
    }
    
    // Path change listener
    if (currentStep.awaits === 'path_change') {
      if(pathname === currentStep.action?.path) {
        if (currentStep.advancesAfter) {
          timerRef.current = setTimeout(() => {
              advanceTour();
          }, currentStep.advancesAfter);
        }
      }
    }

  }, [status, currentStep, advanceTour, pathname]);


  // Initial check on mount
  useEffect(() => {
    try {
      const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
      if (hasCompletedTour) {
        setStatus('completed');
        setDisplayState('minimized');
      } else {
        const startTimeout = setTimeout(() => {
          setStatus('running');
          setDisplayState('open');
        }, 1500); // Initial delay to let page load
        return () => clearTimeout(startTimeout);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  // Observer to hide widget during game
  useEffect(() => {
    const gameContainer = document.getElementById('quantum-conundrum-section');
    if (!gameContainer) return;
    
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          gameActiveRef.current = target.classList.contains('fixed');
          // This forces a re-render to hide/show the widget
          setDisplayState(d => d); 
        }
      }
    });

    observer.observe(gameContainer, { attributes: true });
    gameContainerObserver.current = observer;

    return () => observer.disconnect();
  }, []);

  const handleClose = () => {
    cleanup();
    advanceTour(tourSteps.length); // Advance to end
  };

  // Don't render anything if the tour is inactive or closed.
  if (status === 'inactive' || displayState === 'closed') {
    return null;
  }
  
  if (gameActiveRef.current && displayState === 'minimized') {
      return null;
  }

  // Minimized state / Completed state
  if (displayState === 'minimized' || status === 'completed') {
    return (
        <div className="fixed bottom-4 left-4 z-[100]">
             <Button
                variant="outline"
                size="icon"
                className="rounded-full h-14 w-14 bg-card/70 backdrop-blur-md border-border/60 shadow-lg"
                onClick={() => setDisplayState('open')}
              >
                <Cat className="h-7 w-7 text-primary" />
                <span className="sr-only">Restart Tour</span>
            </Button>
        </div>
    );
  }
  
  // Pointing state
  if (displayState === 'pointing' && targetElementId) {
      return <PointingArrow targetElementId={targetElementId} />;
  }

  // Open state (main tour window)
  if (displayState === 'open' && currentStep) {
     const isLastStep = stepIndex === tourSteps.length - 1;
     return (
      <div 
        className={cn(
          "fixed bottom-4 left-4 z-[100] w-full max-w-sm rounded-xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-and-left data-[state=closed]:slide-out-to-bottom-and-left"
        )}
        data-state={displayState === 'open' ? 'open' : 'closed'}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Cat className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-grow space-y-3">
            <h3 className="font-bold text-primary">{currentStep.title}</h3>
            <div className="text-sm text-foreground/80 leading-relaxed">
              {currentStep.content}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-foreground/60">
                {stepIndex + 1} / {tourSteps.length}
              </span>
               {currentStep.action ? (
                <Button onClick={() => handleAction(currentStep.action)} size="sm">
                  {currentStep.action.label}
                </Button>
              ) : !currentStep.autoAdvanceAfter ? (
                <Button onClick={() => advanceTour()} size="sm">
                  {isLastStep ? 'Finish Tour' : 'Next'}
                </Button>
              ) : null}
            </div>
             {status === 'completed' && (
                <Button onClick={restartTour} size="sm" variant="outline" className="w-full mt-2">
                  Restart Tour
                </Button>
             )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-card/80 hover:bg-muted"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close Tour</span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
