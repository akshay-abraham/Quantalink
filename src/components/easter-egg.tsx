'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Atom,
  Box,
  Cat,
  Ghost,
  Dna,
  Biohazard,
  FlaskConical,
  PartyPopper,
  Skull,
  Star,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { choosePetType, setPet, type PetType } from '@/lib/pet-state';
import { cn } from '@/lib/utils';

type GameState =
  'idle' | 'instructions' | 'playing' | 'revealing' | 'result' | 'failed';
const ANOMALY_ICONS = [Atom, Dna, Biohazard, FlaskConical];
const ANOMALY_COLORS = ['#008b8b', '#447dd9', '#b367be', '#d58b2c'];
interface Anomaly {
  id: string;
  x: number;
  y: number;
  Icon: typeof Atom;
  color: string;
}
interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  type: ParticleType;
}
// Defines the icons used for different particle effects.
export const PARTICLE_ICONS = {
  popper: PartyPopper,
  ghost: Skull,
  revealing: Star,
  anomaly: Star,
};

// Defines the color palettes for different particle effects.
export const PARTICLE_COLORS = {
  popper: [
    '#facc15',
    '#fb923c',
    '#f87171',
    '#4ade80',
    '#22d3ee',
    '#a78bfa',
    '#f472b6',
    '#818cf8',
  ],
  ghost: ['#a5f3fc', '#67e8f9', '#c4b5fd', '#a78bfa', '#f0abfc', '#bae6fd'],
  revealing: ['#ffffff', '#f0f0f0', '#e0e0e0'],
  anomaly: ANOMALY_COLORS,
};

export type ParticleType = keyof typeof PARTICLE_COLORS;

/** A single particle that animates. Behavior changes based on type. */
const Particle = ({ type }: { type: ParticleType }) => {
  const isBirthdayPopper = type === 'popper';

  const duration = isBirthdayPopper
    ? 2 + Math.random() * 3
    : 0.6 + Math.random() * 0.8;
  const travelDistance = 150;

  const startX = isBirthdayPopper ? `${Math.random() * 100}vw` : '50%';
  const startY = isBirthdayPopper ? `${-10 - Math.random() * 20}vh` : '50%';

  const tx = isBirthdayPopper
    ? `${(Math.random() - 0.5) * 100}px`
    : `${(Math.random() - 0.5) * travelDistance}px`;
  const ty = isBirthdayPopper
    ? `${120}vh`
    : `${(Math.random() - 0.5) * travelDistance}px`;

  const color =
    PARTICLE_COLORS[type][
      Math.floor(Math.random() * PARTICLE_COLORS[type].length)
    ];
  const Icon = PARTICLE_ICONS[type];

  const style: React.CSSProperties = {
    position: 'absolute',
    left: startX,
    top: startY,
    animation: `fly-out ${duration}s ease-out forwards`,
    opacity: 0,
    transform: `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`,
    animationDelay: `${Math.random() * 5}s`, // Stagger the rainfall
    color: color,
    '--tx': tx,
    '--ty': ty,
  } as React.CSSProperties;

  return (
    <div style={style}>
      <Icon className="w-5 h-5" />
    </div>
  );
};

/** A container that generates a burst of particles of a specific type. */
export const FunParticles = ({
  type,
  count,
}: {
  type: ParticleType;
  count: number;
}) => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <Particle key={i} type={type} />
    ))}
  </div>
);

const GAME_SECONDS = 15;
const GAME_TARGETS = 5;
const POSITIONS = [18, 50, 82].flatMap((x) =>
  [18, 50, 82].map((y) => ({ x, y }))
);

export default function EasterEgg() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [catState, setCatState] = useState<PetType | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [remaining, setRemaining] = useState(GAME_TARGETS);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [isResultIconVisible, setIsResultIconVisible] = useState(true);
  const resultIconRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const phase = useRef<GameState>('idle');
  const active = useRef<Anomaly[]>([]);
  const remainingRef = useRef(GAME_TARGETS);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const pending = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const cleanup = useCallback(() => {
    timers.current.forEach(clearInterval);
    timers.current = [];
    pending.current.forEach(clearTimeout);
    pending.current.clear();
  }, []);
  useEffect(() => cleanup, [cleanup]);

  function later(callback: () => void, delay: number) {
    const id = setTimeout(() => {
      pending.current.delete(id);
      callback();
    }, delay);
    pending.current.add(id);
  }
  function changePhase(next: GameState) {
    phase.current = next;
    setGameState(next);
  }
  function reset() {
    cleanup();
    changePhase('idle');
    active.current = [];
    setAnomalies([]);
    setParticleEffects([]);
  }
  function spawn() {
    if (phase.current !== 'playing' || active.current.length >= 3) return;
    const free = POSITIONS.filter(
      (p) => !active.current.some((a) => a.x === p.x && a.y === p.y)
    );
    const position = free[Math.floor(Math.random() * free.length)];
    if (!position) return;
    const item = {
      ...position,
      id: crypto.randomUUID(),
      Icon: ANOMALY_ICONS[Math.floor(Math.random() * ANOMALY_ICONS.length)],
      color: ANOMALY_COLORS[Math.floor(Math.random() * ANOMALY_COLORS.length)],
    };
    active.current = [...active.current, item];
    setAnomalies(active.current);
  }
  function begin() {
    cleanup();
    active.current = [];
    remainingRef.current = GAME_TARGETS;
    setAnomalies([]);
    setParticleEffects([]);
    setRemaining(GAME_TARGETS);
    setTimeLeft(GAME_SECONDS);
    changePhase('playing');
    const deadline = Date.now() + GAME_SECONDS * 1000;
    timers.current.push(
      setInterval(() => {
        const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setTimeLeft(seconds);
        if (seconds === 0 && phase.current === 'playing') {
          cleanup();
          changePhase('failed');
        }
      }, 200)
    );
    timers.current.push(setInterval(spawn, 850));
    spawn();
  }
  function observe() {
    cleanup();
    changePhase('revealing');
    later(() => {
      const result = choosePetType();
      setCatState(result);
      setIsResultIconVisible(true);
      changePhase('result');
      later(() => {
        if (resultIconRef.current) {
          const rect = resultIconRef.current.getBoundingClientRect();
          setPet(
            result,
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
          );
          setIsResultIconVisible(false);
        }
      }, 250);
    }, 1500);
  }
  function collect(item: Anomaly) {
    if (
      phase.current !== 'playing' ||
      !active.current.some((a) => a.id === item.id)
    )
      return;
    active.current = active.current.filter((a) => a.id !== item.id);
    setAnomalies(active.current);
    remainingRef.current -= 1;
    setRemaining(remainingRef.current);
    const id = performance.now();
    setParticleEffects((prev) => [
      ...prev,
      { id, x: item.x, y: item.y, type: 'anomaly' },
    ]);
    later(
      () => setParticleEffects((prev) => prev.filter((p) => p.id !== id)),
      700
    );
    if (remainingRef.current === 0) observe();
    else spawn();
  }
  const progress = GAME_TARGETS - remaining;
  return (
    <section id="quantum-conundrum-section" className="quantum-lobby">
      <div className="quantum-lobby-icon">
        <Box size={30} aria-hidden="true" />
      </div>
      <div>
        <p className="eyebrow">A small experiment</p>
        <h2>A Quantum Conundrum</h2>
        <p>
          Collect five signals before time runs out. A familiar visitor might
          join you afterwards.
        </p>
      </div>
      <button
        ref={triggerRef}
        id="begin-experiment-button"
        className="action-primary"
        onClick={() => {
          setPet(null);
          changePhase('instructions');
        }}
      >
        Play the experiment
      </button>
      <Dialog
        open={gameState !== 'idle'}
        onOpenChange={(open) => {
          if (!open) reset();
        }}
      >
        <DialogContent
          className="quantum-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <div className="quantum-dialog-header">
            <div className="quantum-mark">
              <Atom size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>A Quantum Conundrum</DialogTitle>
              <DialogDescription>
                Find the signals. Meet your page companion.
              </DialogDescription>
            </div>
          </div>
          {gameState === 'instructions' && (
            <div className="quantum-instructions">
              <div className="quantum-instruction-orb">
                <Atom size={48} aria-hidden="true" />
              </div>
              <h3>Ready when you are.</h3>
              <p>
                Tap or click <strong>5 glowing symbols</strong> in{' '}
                <strong>15 seconds</strong>. You can also use Tab and Enter. The
                clock starts when you do.
              </p>
              <div className="quantum-rules">
                <span>01 · Find a symbol</span>
                <span>02 · Collect five</span>
                <span>03 · See who appears</span>
              </div>
              <button className="action-primary" onClick={begin}>
                Start collecting
              </button>
            </div>
          )}
          {(gameState === 'playing' || gameState === 'failed') && (
            <div className="quantum-play">
              <div className="quantum-stats">
                <span aria-live="polite">
                  <CheckCircle2 size={16} aria-hidden="true" /> {progress} /{' '}
                  {GAME_TARGETS} collected
                </span>
                <span className={timeLeft <= 5 ? 'time-low' : ''}>
                  <Timer size={16} aria-hidden="true" />
                  {timeLeft}s
                </span>
              </div>
              <progress
                max={GAME_TARGETS}
                value={progress}
                className="quantum-progress"
                aria-label="Signals collected"
              />
              <div
                className="quantum-board"
                aria-label="Signal collection area"
              >
                {gameState === 'playing' &&
                  anomalies.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Collect ${item.Icon.displayName || 'signal'}`}
                      onClick={() => collect(item)}
                      className="quantum-signal"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        color: item.color,
                        backgroundColor: `${item.color}18`,
                      }}
                    >
                      <item.Icon size={28} aria-hidden="true" />
                    </button>
                  ))}
                {particleEffects.map((effect) => (
                  <div
                    key={effect.id}
                    className="quantum-hit"
                    style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                  >
                    <FunParticles type="anomaly" count={10} />
                  </div>
                ))}
                {gameState === 'failed' && (
                  <div className="quantum-failed">
                    <Atom size={36} aria-hidden="true" />
                    <h3>Just missed it.</h3>
                    <p>
                      You found {progress} of {GAME_TARGETS} signals. Give it
                      another go?
                    </p>
                    <button className="action-primary" onClick={begin}>
                      Try again
                    </button>
                  </div>
                )}
              </div>
              <p className="quantum-hint">
                {gameState === 'playing'
                  ? 'Follow the glow. Each symbol counts once.'
                  : 'No rush. You can try as often as you like.'}
              </p>
            </div>
          )}
          {gameState === 'revealing' && (
            <div className="quantum-reveal" role="status">
              <div className="quantum-reveal-orbit">
                <Atom size={55} aria-hidden="true" />
              </div>
              <h3>Something is taking shape...</h3>
              <p>Let’s see who’s joining you.</p>
            </div>
          )}
          {gameState === 'result' && (
            <div className="quantum-result">
              <div className="relative">
                <FunParticles
                  type={catState === 'alive' ? 'popper' : 'ghost'}
                  count={catState === 'alive' ? 100 : 50}
                />
                <p className="eyebrow">Observation complete</p>
                <div
                  ref={resultIconRef}
                  className={cn(
                    'quantum-result-icon',
                    !isResultIconVisible && 'opacity-0'
                  )}
                >
                  {catState === 'alive' ? (
                    <Cat className="h-20 w-20 animate-popper text-green-500" />
                  ) : (
                    <Ghost className="h-20 w-20 animate-ghost text-sky-400" />
                  )}
                </div>
                <h3>
                  {catState === 'alive'
                    ? 'A cat for company.'
                    : 'A little ghost has arrived.'}
                </h3>
                <p>Your companion can explore the site with you.</p>
              </div>
              <button className="action-primary" onClick={reset}>
                Back to exploring
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
