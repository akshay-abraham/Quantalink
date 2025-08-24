/**
 * @file src/components/easter-egg.tsx
 * @description A fun, interactive "game" component based on the Schrödinger's Cat thought experiment.
 *              It allows the user to "collapse the wave function" and see a random outcome.
 * @note This is a client component due to its use of state (`useState`) and effects (`useEffect`).
 */
"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Box, Cat, Ghost, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';

// Defines the color palettes for the particle effects.
const particleColors = {
  popper: ['#facc15', '#fb923c', '#f87171', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6', '#818cf8'],
  ghost: ['#a5f3fc', '#67e8f9', '#c4b5fd', '#a78bfa', '#f0abfc', '#bae6fd'],
};

/**
 * A single particle component for the celebratory/spooky animations.
 * @param {{ type: 'popper' | 'ghost' }} props - The props object.
 * @param {'popper' | 'ghost'} props.type - The type of particle to render, determines color and icon.
 * @returns {JSX.Element} A div with randomized animation styles.
 */
const Particle = ({ type }: { type: 'popper' | 'ghost' }) => {
  // Select a random color from the appropriate palette.
  const color = particleColors[type][Math.floor(Math.random() * particleColors[type].length)];
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animation: `fly-out ${1 + Math.random() * 2}s ease-out forwards`,
    opacity: 0,
    transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
    animationDelay: `${Math.random() * 0.5}s`,
    color: color,
  };

  const Icon = type === 'popper' ? PartyPopper : Ghost;

  return (
    <div style={style}>
      <Icon className="h-5 w-5" />
    </div>
  );
};

/**
 * A container component that renders a specified number of particles.
 * @param {{ type: 'popper' | 'ghost', count: number }} props - The props object.
 * @returns {JSX.Element} A div containing multiple Particle components.
 */
const FunParticles = ({ type, count }: { type: 'popper' | 'ghost', count: number }) => (
    <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: count }).map((_, i) => (
            <Particle key={i} type={type} />
        ))}
    </div>
);

/**
 * The main EasterEgg component. It manages the state of the "game" and renders the UI.
 * @returns {JSX.Element} A Card component with the interactive experiment.
 */
export default function EasterEgg() {
  const [isObserved, setIsObserved] = useState(false);
  const [catState, setCatState] = useState<'alive' | 'ghost' | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);

  // Function to "observe" the cat, collapsing its state.
  const observe = () => {
    // 50/50 chance of being 'alive' or 'ghost'.
    setCatState(Math.random() > 0.5 ? 'alive' : 'ghost');
    setIsObserved(true);
  };

  // Function to reset the experiment to its initial state.
  const reset = () => {
    setIsObserved(false);
    setCatState(null);
  };
  
  // This effect injects the keyframe animation for the particles into the document's stylesheet.
  // This is done once when the component mounts.
  useEffect(() => {
    const keyframes = `
      @keyframes fly-out {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        100% { transform: translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px) scale(1); opacity: 0; }
      }
    `;
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
        try {
            // Check if the rule already exists to avoid errors on hot-reload.
            const ruleExists = Array.from(styleSheet.cssRules).some(rule => (rule as CSSKeyframesRule).name === 'fly-out');
            if (!ruleExists) {
               styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            }
        } catch (e) {
            console.warn("Could not insert keyframe rule.", e)
        }
    }
  }, []);

  return (
    <section 
      ref={ref}
      // Fades in the whole section when it becomes visible.
      className={cn(
        "space-y-4 text-center transition-opacity duration-1000 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDelay: isVisible ? '150ms' : '0ms'
      }}
    >
        <Card className={cn(
            "relative bg-card/30 border-border/40 shadow-lg transition-all duration-700 ease-out text-center overflow-hidden",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: isVisible ? `200ms` : '0ms' }}
        >
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-primary">
                    <Box className="h-8 w-8" />
                    A Quantum Conundrum
                </CardTitle>
                <CardDescription className="max-w-prose mx-auto italic">
                  A cat is placed in a box with a poison that has a 50% chance of releasing. Until observed, the cat is in a superposition—both alive and dead at once.
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex flex-col items-center justify-center space-y-6 p-6">
                
                {/* Renders the initial state of the experiment. */}
                {!isObserved && (
                    <div className="space-y-6 animate-fade-in w-full max-w-sm px-4">
                        <blockquote className='space-y-2'>
                          <p className="font-medium text-foreground/90">“My fate is tied to a quantum event. Until you look, I exist in both states simultaneously. Your observation will force reality to choose.”</p>
                          <cite className="text-sm text-foreground/70 not-italic">- The Cat (probably)</cite>
                        </blockquote>
                        <div className="w-full pt-4">
                          <Button onClick={observe} size="lg" className="w-full sm:w-auto">
                            Collapse the wave function
                          </Button>
                        </div>
                    </div>
                )}
                
                {/* Renders the result after the user has clicked the button. */}
                {isObserved && (
                     <div className="w-full animate-fade-in space-y-6">
                        <div className="relative flex flex-col items-center justify-center gap-4">
                           
                            {/* The "Alive" outcome. */}
                            {catState === 'alive' && (
                                <div className="relative flex-1 p-4 border border-green-500/30 bg-green-500/10 rounded-lg space-y-3 text-center w-full max-w-sm">
                                    <FunParticles type="popper" count={50} />
                                    <h3 className="font-bold text-green-500">Observation Complete!</h3>
                                    <Cat className="h-16 w-16 mx-auto text-green-500 animate-popper" />
                                    <p className="text-xl font-bold text-green-500">The cat is ALIVE!</p>
                                    <p className="text-sm text-foreground/80">The superposition collapsed into a definite state of life. Congratulations!</p>
                                </div>
                            )}

                            {/* The "Ghost" outcome. */}
                            {catState === 'ghost' && (
                                <div className="relative flex-1 p-4 border border-sky-400/30 bg-sky-400/10 rounded-lg space-y-3 text-center w-full max-w-sm">
                                    <FunParticles type="ghost" count={30} />
                                    <h3 className="font-bold text-sky-400">Observation Complete!</h3>
                                    <Ghost className="h-16 w-16 mx-auto text-sky-400 animate-ghost" />
                                    <p className="text-xl font-bold text-sky-400">The cat has decohered.</p>
                                    <p className="text-sm text-foreground/80">In this timeline, the cat has quantum-tunnelled into the great beyond. Spooky!</p>
                                </div>
                            )}
                        </div>

                        <p className='text-xs text-foreground/60 max-w-prose mx-auto pt-4'>
                          By observing, you didn't just see a result—you participated in creating it. This is the bizarre and fascinating nature of quantum mechanics.
                        </p>
                        
                        <Button onClick={reset} variant="outline">Reset Superposition</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </section>
  )
}
