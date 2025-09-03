/**
 * @file src/components/guided-tour.tsx
 * @description An advanced, non-intrusive guided tour for first-time visitors.
 *              It uses a cat mascot to provide contextual, auto-advancing tips,
 *              and can highlight specific elements to guide user interaction.
 * @note This is a client component due to its heavy use of state, effects, and localStorage.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Cat, X, Github } from 'lucide-react';
import { Button } from './ui/button';
import { tourSteps, TourStep } from '@/lib/tour-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

export const TOUR_STORAGE_KEY = 'hasCompletedQuantumTour_v2';

type TourStatus = 'inactive' | 'running' | 'completed';
type TourDisplayState = 'closed' | 'open' | 'pointing';

export default function GuidedTour() {
  const [status, setStatus] = useState<TourStatus>('inactive');
  const [displayState, setDisplayState] = useState<TourDisplayState>('closed');
  const [stepIndex, setStepIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const posthog = usePostHog();

  const currentStep: TourStep | null = tourSteps[stepIndex] || null;

  // Cleanup function to clear all timers.
  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const highlightedElement = document.querySelector('.animate-button-glow');
    highlightedElement?.classList.remove('animate-button-glow');
  }, []);

  const advanceTour = useCallback((forceNextStep?: number) => {
    cleanup();
    const nextStepIndex = typeof forceNextStep === 'number' ? forceNextStep : stepIndex + 1;
    
    if (nextStepIndex >= tourSteps.length) {
      setStatus('completed');
      setDisplayState('closed'); // Close it, but it will be rendered as the minimized icon
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        posthog.capture('tour_completed');
      } catch (error) { console.error("Could not write to localStorage:", error); }
    } else {
      setStepIndex(nextStepIndex);
    }
  }, [stepIndex, cleanup, posthog]);
  
  const handleAction = useCallback((action?: TourStep['action']) => {
    if (!action) {
      advanceTour();
      return;
    }

    if (action.type === 'scroll_to') {
      const element = document.getElementById(action.elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      const targetButton = document.getElementById(action.pointTo);
      targetButton?.classList.add('animate-button-glow');

      // Minimize the tour window to not obscure the view
      setDisplayState('closed'); 
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
    posthog.capture('tour_restarted');
  };
  
  // Effect to manage tour logic based on the current step
  useEffect(() => {
    if (status !== 'running' || !currentStep) return;

    setDisplayState('open');

    // Auto-advance logic
    if (currentStep.autoAdvanceAfter) {
      timerRef.current = setTimeout(() => {
        advanceTour();
      }, currentStep.autoAdvanceAfter);
    }

    // Listener for a button click
    if (currentStep.awaits === 'click') {
      const targetId = currentStep.action?.pointTo;
      if (!targetId) return;
      
      const target = document.getElementById(targetId);
      const listener = () => {
        cleanup(); // Remove glow
        
        // This is a special case for the game start
        if(targetId === 'begin-experiment-button') {
          setDisplayState('closed');
          // Wait 25 seconds, then advance.
          timerRef.current = setTimeout(() => {
            advanceTour();
          }, 25000);
        }
      };
      
      target?.addEventListener('click', listener, { once: true });
      return () => target?.removeEventListener('click', listener);
    }

    // Path change listener
    if (currentStep.awaits === 'path_change') {
      const targetId = currentStep.action?.pointTo;
      if(targetId) {
        const targetButton = document.getElementById(targetId);
        targetButton?.classList.add('animate-button-glow');
      }

      if(pathname === currentStep.action?.path) {
        cleanup(); // Remove glow
        timerRef.current = setTimeout(() => {
          advanceTour();
        }, 2000); // Wait 2s on the new page before showing final step
      }
    }

    return cleanup;

  }, [status, currentStep, advanceTour, pathname, handleAction, cleanup]);


  // Initial check on mount
  useEffect(() => {
    try {
      const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
      if (hasCompletedTour) {
        setStatus('completed');
      } else {
        const startTimeout = setTimeout(() => {
          setStatus('running');
          setDisplayState('open');
          posthog.capture('tour_started');
        }, 1500); // Initial delay to let page load
        return () => clearTimeout(startTimeout);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Observer to hide widget during game
  useEffect(() => {
    const gameContainer = document.getElementById('quantum-conundrum-section');
    if (!gameContainer) return;
    
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          setIsGameActive(target.classList.contains('fixed'));
        }
      }
    });

    observer.observe(gameContainer, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleClose = () => {
    cleanup();
    advanceTour(tourSteps.length); // Advance to end
  };

  if (status === 'inactive' || (isGameActive && displayState !== 'open')) {
    return null;
  }
  
  // Render minimized/completed button if tour is not open
  if (displayState !== 'open') {
     return (
        <div className="fixed bottom-4 left-4 z-[100]">
             <Button
                variant="outline"
                size="icon"
                className="rounded-full h-14 w-14 bg-card/70 backdrop-blur-md border-border/60 shadow-lg hover:scale-110 transition-transform"
                onClick={() => setDisplayState('open')}
              >
                <Cat className="h-7 w-7 text-primary" />
                <span className="sr-only">Open Tour Guide</span>
            </Button>
        </div>
    );
  }

  // Open state (main tour window)
  if (displayState === 'open' && currentStep) {
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
              ) : !currentStep.autoAdvanceAfter && status !== 'completed' ? (
                <Button onClick={() => advanceTour()} size="sm">
                  Next
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
