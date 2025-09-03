/**
 * @file src/components/guided-tour.tsx
 * @description An ambient, non-intrusive guided tour for first-time visitors.
 *              It uses a cat mascot to provide contextual tips in the bottom-left corner.
 * @note This is a client component due to its use of state, effects, and localStorage.
 */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Cat, X } from 'lucide-react';
import { Button } from './ui/button';
import { tourSteps, TourStep } from '@/lib/tour-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const TOUR_STORAGE_KEY = 'hasCompletedQuantumTour';

export default function GuidedTour() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();

  const currentStep: TourStep | null = tourSteps[stepIndex] || null;

  // Check on mount if the tour should be started.
  useEffect(() => {
    try {
      const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!hasCompletedTour) {
        // Delay the tour start to let the main page animations play out.
        const timer = setTimeout(() => setIsOpen(true), 2500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      // End of the tour
      setIsOpen(false);
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
    }
  }, [stepIndex]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
    }, 300); // Match animation duration
  };

  // Logic to show/hide steps based on the current page.
  useEffect(() => {
    if (!currentStep) {
      setIsOpen(false);
      return;
    }

    const shouldBeVisible = currentStep.path === pathname || currentStep.path === 'all';
    
    if (isOpen && !shouldBeVisible) {
      setIsOpen(false);
    } else if (!isOpen && shouldBeVisible && !localStorage.getItem(TOUR_STORAGE_KEY)) {
      // Re-open if navigating to a relevant page and tour isn't complete
      setIsOpen(true);
    }

  }, [pathname, currentStep, isOpen]);


  if (!isOpen || !currentStep) {
    return null;
  }
  
  const isLastStep = stepIndex === tourSteps.length - 1;

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 z-[100] w-full max-w-sm rounded-xl border border-border/40 bg-card/50 p-4 shadow-2xl backdrop-blur-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-and-left data-[state=closed]:slide-out-to-bottom-and-left",
        "transition-transform duration-300 ease-in-out",
        isExiting && "translate-y-full opacity-0"
      )}
      data-state={isOpen && !isExiting ? "open" : "closed"}
    >
      <div className="flex items-start gap-4">
        {/* Mascot */}
        <div className="flex-shrink-0 mt-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cat className="h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-3">
          <h3 className="font-bold text-primary">{currentStep.title}</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {currentStep.content}
          </p>
          <div className="flex items-center justify-between pt-2">
             <span className="text-xs text-foreground/60">
              {stepIndex + 1} / {tourSteps.length}
            </span>
            <Button onClick={handleNext} size="sm">
              {isLastStep ? "Got it!" : "Next"}
            </Button>
          </div>
        </div>

        {/* Close Button */}
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
