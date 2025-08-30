/**
 * @file src/components/easter-egg.tsx
 * @description A fun, interactive "game" component based on the Schrödinger's Cat thought experiment.
 *              It allows the user to "collapse the wave function" after completing a mini-game.
 * @note This is a client component due to its use of state (`useState`) and effects (`useEffect`).
 */
"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Box, Cat, Ghost, PartyPopper, Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Progress } from '@/components/ui/progress';

type GameState = 'idle' | 'playing' | 'revealing' | 'result' | 'failed';
type CatState = 'alive' | 'ghost' | null;

const PARTICLE_COLORS = {
  popper: ['#facc15', '#fb923c', '#f87171', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6', '#818cf8'],
  ghost: ['#a5f3fc', '#67e8f9', '#c4b5fd', '#a78bfa', '#f0abfc', '#bae6fd'],
};

const Particle = ({ type }: { type: 'popper' | 'ghost' }) => {
  const color = PARTICLE_COLORS[type][Math.floor(Math.random() * PARTICLE_COLORS[type].length)];
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
  return <div style={style}><Icon className="h-5 w-5" /></div>;
};

const FunParticles = ({ type, count }: { type: 'popper' | 'ghost', count: number }) => (
    <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: count }).map((_, i) => <Particle key={i} type={type} />)}
    </div>
);

export default function EasterEgg() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [catState, setCatState] = useState<CatState>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [stats, setStats] = useState({ alive: 0, ghost: 0 });

  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useInView(ref);

  useEffect(() => {
    try {
      const storedStats = localStorage.getItem('quantumConundrumStats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error("Failed to parse stats from localStorage", error);
    }
  }, []);

  const updateStats = useCallback((result: CatState) => {
    if (!result) return;
    const newStats = { ...stats, [result]: stats[result] + 1 };
    setStats(newStats);
    try {
      localStorage.setItem('quantumConundrumStats', JSON.stringify(newStats));
    } catch (error) {
      console.error("Failed to save stats to localStorage", error);
    }
  }, [stats]);
  
  const startExperiment = () => {
    setProgress(0);
    setTimeLeft(5);
    setGameState('playing');
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const chargeMeter = () => {
    if (gameState !== 'playing') return;
    setProgress(prev => {
      const newProgress = prev + 15;
      if (newProgress >= 100) {
        clearInterval(timerRef.current!);
        observe();
        return 100;
      }
      return newProgress;
    });
  };

  const observe = () => {
    setGameState('revealing');
    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'alive' : 'ghost';
      setCatState(result);
      updateStats(result);
      setGameState('result');
    }, 2000);
  };

  const reset = () => {
    setGameState('idle');
    setCatState(null);
    setProgress(0);
  };
  
  useEffect(() => {
    const keyframes = `
      @keyframes fly-out {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        100% { transform: translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px) scale(1); opacity: 0; }
      }
    `;
    if (typeof window !== 'undefined') {
      const styleSheet = document.styleSheets[0];
      if (styleSheet) {
          try {
              const ruleExists = Array.from(styleSheet.cssRules).some(rule => (rule as CSSKeyframesRule).name === 'fly-out');
              if (!ruleExists) {
                 styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
              }
          } catch (e) {
              console.warn("Could not insert keyframe rule.", e)
          }
      }
    }
  }, []);

  return (
    <section 
      ref={ref}
      className={cn("space-y-4 text-center transition-opacity duration-1000 ease-out", isVisible ? "opacity-100" : "opacity-0")}
      style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
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
                  An interactive thought experiment. Your observation collapses the wave function.
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[260px] flex flex-col items-center justify-center space-y-6 p-6">
                
                {gameState === 'idle' && (
                    <div className="space-y-6 animate-fade-in w-full max-w-sm px-4">
                        <blockquote className='space-y-2'>
                          <p className="font-medium text-foreground/90">"Charge the observation meter to collapse the superposition. Only then will my fate be decided."</p>
                          <cite className="text-sm text-foreground/70 not-italic">- The Cat (probably)</cite>
                        </blockquote>
                         <div className="text-sm text-foreground/80">
                           <p>Cats Observed Alive: <span className="font-bold text-green-500">{stats.alive}</span></p>
                           <p>Cats Decohered: <span className="font-bold text-sky-400">{stats.ghost}</span></p>
                         </div>
                        <div className="w-full pt-4">
                          <Button onClick={startExperiment} size="lg" className="w-full sm:w-auto">
                            Begin Experiment
                          </Button>
                        </div>
                    </div>
                )}
                
                {(gameState === 'playing' || gameState === 'failed') && (
                    <div className="space-y-6 animate-fade-in w-full max-w-sm px-4">
                        <h3 className="font-bold text-lg text-primary">{gameState === 'failed' ? 'Experiment Failed!' : 'Charging Meter...'}</h3>
                        <div className="space-y-2">
                           <Progress value={progress} className="w-full" />
                           <div className="flex justify-between items-center text-sm text-foreground/70">
                               <span>Observation Meter</span>
                               <span className="flex items-center gap-1"><Timer className="h-4 w-4" />{timeLeft}s</span>
                           </div>
                        </div>
                        <p className="text-sm text-foreground/80">
                          {gameState === 'failed' ? 'The quantum state destabilized. Reset to try again.' : 'Repeatedly click to charge the meter before time runs out!'}
                        </p>
                        <div className="w-full pt-4">
                            {gameState === 'playing' ? (
                               <Button onClick={chargeMeter} size="lg" className="w-full sm:w-auto">
                                   <Zap className="mr-2 h-4 w-4" /> Charge
                               </Button>
                            ) : (
                                <Button onClick={reset} variant="outline">Reset Experiment</Button>
                            )}
                        </div>
                    </div>
                )}

                {gameState === 'revealing' && (
                    <div className="space-y-4 animate-fade-in text-center">
                        <h3 className="text-xl font-bold text-primary">Wave Function Collapsing...</h3>
                        <p className="text-foreground/80">Determining final state...</p>
                    </div>
                )}

                {gameState === 'result' && (
                     <div className="w-full animate-fade-in space-y-6">
                        <div className="relative flex flex-col items-center justify-center gap-4">
                            {catState === 'alive' && (
                                <div className="relative flex-1 p-4 border border-green-500/30 bg-green-500/10 rounded-lg space-y-3 text-center w-full max-w-sm">
                                    <FunParticles type="popper" count={50} />
                                    <h3 className="font-bold text-green-500">Observation Complete!</h3>
                                    <Cat className="h-16 w-16 mx-auto text-green-500 animate-popper" />
                                    <p className="text-xl font-bold text-green-500">The cat is ALIVE!</p>
                                    <p className="text-sm text-foreground/80">The superposition collapsed into a definite state of life. Congratulations!</p>
                                </div>
                            )}
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
                          By participating, you didn't just see a result—you created it. This is the essence of the observer effect in quantum mechanics.
                        </p>
                        <Button onClick={reset} variant="outline">Run New Experiment</Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground pb-4">
                <p>Experiment Results are saved locally in your browser.</p>
            </CardFooter>
        </Card>
    </section>
  )
}
