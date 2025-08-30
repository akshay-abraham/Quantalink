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
import { Box, Cat, Ghost, Timer, X, Atom, Dna, Biohazard, FlaskConical, PartyPopper, Skull, Star, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Progress } from '@/components/ui/progress';

type GameState = 'idle' | 'playing' | 'revealing' | 'result' | 'failed';
type CatState = 'alive' | 'ghost' | null;

const ANOMALY_ICONS = [Atom, Dna, Biohazard, FlaskConical];
const ANOMALY_COLORS = ['#ff00ff', '#00ffff', '#ffb700', '#00ff00', '#ff5252', '#ad52ff', '#f472b6', '#3b82f6'];

interface Anomaly {
  id: number;
  x: number;
  y: number;
  Icon: React.ElementType;
  color: string;
}

interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  type: ParticleType;
}

const PARTICLE_ICONS = {
  popper: PartyPopper,
  ghost: Skull,
  anomaly: Star,
  revealing: Star,
};

const PARTICLE_COLORS = {
  popper: ['#facc15', '#fb923c', '#f87171', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6', '#818cf8'],
  ghost: ['#a5f3fc', '#67e8f9', '#c4b5fd', '#a78bfa', '#f0abfc', '#bae6fd'],
  revealing: ['#ffffff', '#f0f0f0', '#e0e0e0'],
  anomaly: ANOMALY_COLORS,
};

type ParticleType = keyof typeof PARTICLE_COLORS;

const Particle = ({ type }: { type: ParticleType }) => {
  const tx = (Math.random() - 0.5) * 400;
  const ty = (Math.random() - 0.5) * 400;
  const color = PARTICLE_COLORS[type][Math.floor(Math.random() * PARTICLE_COLORS[type].length)];
  const Icon = PARTICLE_ICONS[type];

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `50%`,
    top: `50%`,
    animation: `fly-out ${1 + Math.random() * 2}s ease-out forwards`,
    opacity: 0,
    transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
    animationDelay: `${Math.random() * 0.2}s`,
    color: color,
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
  } as React.CSSProperties;

  return <div style={style}><Icon className="h-5 w-5" /></div>;
};

const FunParticles = ({ type, count }: { type: ParticleType, count: number }) => (
    <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: count }).map((_, i) => <Particle key={i} type={type} />)}
    </div>
);

const QuantumAnomaly = ({ anomaly, onClick }: { anomaly: Anomaly, onClick: (id: number, x: number, y: number) => void }) => (
  <button
    onClick={() => onClick(anomaly.id, anomaly.x, anomaly.y)}
    className="absolute w-12 h-12 rounded-full flex items-center justify-center animate-orb-pop-in transition-transform duration-200 hover:scale-110"
    style={{ left: `${anomaly.x}%`, top: `${anomaly.y}%`, color: anomaly.color, backgroundColor: `${anomaly.color}20` }}
  >
    <anomaly.Icon className="w-8 h-8" />
  </button>
);

export default function EasterEgg() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [catState, setCatState] = useState<CatState>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [stats, setStats] = useState({ alive: 0, ghost: 0 });
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const anomalySpawnerRef = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useInView(ref);

  const isGameActive = gameState === 'playing' || gameState === 'failed' || gameState === 'revealing' || gameState === 'result';

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
  
  const cleanupTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (anomalySpawnerRef.current) clearInterval(anomalySpawnerRef.current);
  };
  
  const startExperiment = () => {
    setProgress(0);
    setTimeLeft(10);
    setAnomalies([]);
    setParticleEffects([]);
    setGameState('playing');
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          cleanupTimers();
          setGameState('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    anomalySpawnerRef.current = setInterval(() => {
      setAnomalies(prevAnomalies => {
        const newAnomaly: Anomaly = {
          id: Date.now(),
          x: Math.random() * 90,
          y: Math.random() * 90,
          Icon: ANOMALY_ICONS[Math.floor(Math.random() * ANOMALY_ICONS.length)],
          color: ANOMALY_COLORS[Math.floor(Math.random() * ANOMALY_COLORS.length)],
        };
        const updatedAnomalies = prevAnomalies.length > 5 ? prevAnomalies.slice(1) : prevAnomalies;
        return [...updatedAnomalies, newAnomaly];
      });
    }, 800);
  };

  const handleAnomalyClick = (id: number, x: number, y: number) => {
    setAnomalies(prev => prev.filter(a => a.id !== id));
    
    const newEffect: ParticleEffect = { id: Date.now(), x, y, type: 'anomaly' };
    setParticleEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== newEffect.id));
    }, 2000);

    setProgress(prev => {
      const newProgress = prev + 25;
      if (newProgress >= 100) {
        cleanupTimers();
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
    cleanupTimers();
    setGameState('idle');
    setCatState(null);
    setProgress(0);
    setAnomalies([]);
    setParticleEffects([]);
  };
  
  useEffect(() => {
    return cleanupTimers;
  }, []);

  return (
    <>
      {isGameActive && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={reset}
        ></div>
      )}
      <section 
        ref={ref}
        className={cn(
          "space-y-4 text-center transition-opacity duration-1000 ease-out", 
          isVisible ? "opacity-100" : "opacity-0",
           isGameActive && "fixed inset-0 w-full h-full flex items-center justify-center z-50 p-4"
        )}
        style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
      >
          <Card className={cn(
              "relative border-border/40 shadow-lg transition-all duration-700 ease-out text-center overflow-hidden w-full",
              isVisible && !isGameActive ? "opacity-100 translate-y-0 bg-card/30" : !isGameActive ? "opacity-0 translate-y-5" : "",
              isGameActive ? "max-w-4xl h-auto md:h-[700px] flex flex-col bg-background" : "max-w-full"
          )}
          style={{ transitionDelay: isVisible ? `200ms` : '0ms' }}
          >
              {isGameActive && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-20" onClick={reset}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close Game</span>
                </Button>
              )}
              <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-primary">
                      <Box className="h-8 w-8" />
                      A Quantum Conundrum
                  </CardTitle>
                  <CardDescription className="max-w-prose mx-auto italic">
                    An interactive thought experiment. Your observation collapses the wave function.
                  </CardDescription>
              </CardHeader>
              <CardContent className={cn("min-h-[300px] flex flex-col items-center justify-center space-y-6 p-6", isGameActive && "flex-grow")}>
                  
                  {gameState === 'idle' && (
                      <div className="space-y-6 animate-fade-in w-full max-w-sm px-4">
                          <blockquote className='space-y-2'>
                            <p className="font-medium text-foreground/90">"My fate is in superposition. Collect quantum anomalies to observe the outcome."</p>
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
                      <div className="space-y-4 animate-fade-in w-full h-full flex flex-col">
                          <h3 className="font-bold text-lg text-primary">{gameState === 'failed' ? 'Experiment Failed!' : 'Tap the Anomalies!'}</h3>
                          <div className="space-y-2">
                             <Progress value={progress} className="w-full" />
                             <div className="flex justify-between items-center text-sm text-foreground/70">
                                 <span>Observation Meter</span>
                                 <span className="flex items-center gap-1"><Timer className="h-4 w-4" />{timeLeft}s</span>
                             </div>
                          </div>
                          <div 
                            className="relative w-full flex-grow bg-primary/5 border border-primary/20 rounded-lg mt-2 min-h-[250px] md:min-h-[400px] touch-none"
                          >
                              {anomalies.map(item => (
                                <QuantumAnomaly key={item.id} anomaly={item} onClick={handleAnomalyClick} />
                              ))}
                              {particleEffects.map(effect => (
                                <div key={effect.id} className="absolute" style={{left: `${effect.x}%`, top: `${effect.y}%`, width: '50px', height: '50px', transform: 'translate(-50%, -50%)'}}>
                                   <FunParticles type={effect.type} count={30} />
                                </div>
                               ))}
                          </div>
                           <p className="text-xs text-foreground/80 pt-2 flex items-center justify-center gap-2">
                            {gameState === 'failed' ? 'The quantum state destabilized. Reset to try again.' : 'Quickly! Tap the anomalies to charge the meter!'}
                          </p>
                          <div className="w-full pt-2">
                              {gameState === 'failed' && (
                                  <Button onClick={reset} variant="outline">Reset Experiment</Button>
                              )}
                          </div>
                      </div>
                  )}

                  {gameState === 'revealing' && (
                      <div className="space-y-4 animate-fade-in text-center relative w-full h-full flex flex-col items-center justify-center">
                          <FunParticles type="revealing" count={200} />
                          <h3 className="text-xl font-bold text-primary">Wave Function Collapsing...</h3>
                          <p className="text-foreground/80">Determining final state...</p>
                      </div>
                  )}

                  {gameState === 'result' && (
                       <div className="w-full animate-fade-in space-y-6">
                          <div className="relative flex flex-col items-center justify-center gap-4">
                              {catState === 'alive' && (
                                  <div className="relative flex-1 p-4 border border-green-500/30 bg-green-500/10 rounded-lg space-y-3 text-center w-full max-w-sm">
                                      <FunParticles type="popper" count={150} />
                                      <h3 className="font-bold text-green-500">Observation Complete!</h3>
                                      <Cat className="h-16 w-16 mx-auto text-green-500 animate-popper" />
                                      <p className="text-xl font-bold text-green-500">The cat is ALIVE!</p>
                                      <p className="text-sm text-foreground/80">The superposition collapsed into a definite state of life. Congratulations!</p>
                                  </div>
                              )}
                              {catState === 'ghost' && (
                                  <div className="relative flex-1 p-4 border border-sky-400/30 bg-sky-400/10 rounded-lg space-y-3 text-center w-full max-w-sm">
                                      <FunParticles type="ghost" count={80} />
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
    </>
  )
}
