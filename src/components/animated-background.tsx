/**
 * @file src/components/animated-background.tsx
 * @description A client component that renders a canvas-based animation inspired by Quantum
 *              Electrodynamics (QED): charged particles exchanging "photons," vacuum
 *              fluctuations, and a soft observer-effect response to the pointer.
 *
 * @note This is a from-scratch rewrite of the previous implementation. The visual concept
 *       (charged particles, photon-exchange lines, vacuum fluctuations, light theme, blue/rose/
 *       gold palette) is unchanged. What changed is *how* it's computed and drawn:
 *
 *       Physics
 *       - The force law is now a *softened* Coulomb force (force = k·q1·q2 / (r² + softening)).
 *         The softening term is standard in n-body simulation and keeps force finite as two
 *         particles approach each other, instead of spiking toward infinity.
 *       - Velocity is damped every frame and a tiny random "thermal" impulse is added back in
 *         (a simplified Langevin thermostat). Damping alone would let the system grind to a
 *         halt; noise alone would let it heat up forever. Together they settle to a stable,
 *         bounded "temperature" — always gently moving, never accelerating without bound.
 *       - A hard speed clamp is kept as a last-resort safety net.
 *       - Motion is integrated on a fixed baseline (60fps-equivalent) timestep, so the
 *         simulation looks the same speed whether the device is rendering at 30fps or 60fps.
 *
 *       Rendering
 *       - No `ctx.shadowBlur` anywhere. Every particle's soft aura is a small pre-rendered
 *         radial-gradient sprite (built once, off-screen) that gets cheaply scaled with
 *         `drawImage` each frame, instead of a brand new gradient + a blur pass per particle
 *         per frame.
 *       - The page background is a plain CSS gradient behind a *transparent* canvas that is
 *         cleared with `clearRect` each frame — cheaper than filling/re-drawing a background
 *         every frame, and it means the desktop view is never "just a flat void" between
 *         particles.
 *       - The canvas backing store is sized to `devicePixelRatio` (capped at 2) so the scene
 *         is crisp on high-DPI phones instead of soft/blurry.
 *
 *       Liveliness (mobile-weighted)
 *       - Damping/jitter/speed were retuned so the field keeps more visible
 *         motion at a stable equilibrium than the very first pass.
 *       - A cheap two-term sine/cosine "flow field" (`FLOW_SPEED`/`FLOW_BLEND`
 *         in integrate()) steers each particle's velocity toward a slowly-
 *         shifting target, giving the whole scene a coherent drift on top of
 *         individual jitter — the difference between "handful of dots
 *         vibrating in place" and "a field that's moving." It's implemented
 *         as steering (nudge toward a target velocity) rather than an added
 *         force, specifically because it's *coherent* over many frames; an
 *         added force that doesn't change direction quickly fights the
 *         gentle damping above and piles up almost undamped, whereas
 *         steering can only ever approach its target.
 *       - Small screens intentionally run *fewer* particles to avoid clutter,
 *         so they get a `liveliness` multiplier (~1.4x tapering to 1.0x on
 *         desktop) on the jitter and flow terms — each particle carries more
 *         visible motion instead of the scene just looking sparse and still.
 *       - Particle cores now have a subtle brightness shimmer synced to their
 *         aura pulse, instead of being flat, static dots.
 *
 *       Device adaptation
 *       - Particle count, connection distance, and max connections-per-particle scale
 *         *continuously* with viewport area (and available CPU cores), instead of a single
 *         hard isMobile/!isMobile split. A 350px phone and a 767px phone no longer get
 *         identical settings.
 *       - Resize is debounced, and a pure height-only change (mobile browser chrome showing/
 *         hiding while scrolling) no longer re-initializes the simulation — it just re-clamps
 *         existing particles into the new bounds. A genuine resize (rotation, window resize)
 *         smoothly grows/shrinks the particle count instead of throwing everything away.
 *       - The animation pauses completely when the tab is hidden, and respects
 *         `prefers-reduced-motion` by rendering a single static frame instead of animating.
 */
'use client';

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ============================================================
       Palette (light theme only, matching the original design)
       ============================================================ */
    const POSITIVE_HUE = 210; // soft blue — positive charge
    const NEGATIVE_HUE = 340; // soft rose — negative charge
    const PHOTON_HUE = 46; // warm gold — photon-exchange lines

    /* ============================================================
       Physics tuning
       ============================================================ */
    const COULOMB_K = 2400; // interaction strength
    const SOFTENING = 22 * 22; // px² — keeps force finite at close range
    const DAMPING = 0.985; // velocity retained per baseline frame (energy loss)
    const THERMAL_JITTER = 0.06; // px/frame² random impulse (keeps the field "alive")
    const MAX_SPEED = 1.8; // px/frame safety clamp — a rare ceiling, not a cruise speed
    const POINTER_RADIUS = 190; // px, "observer effect" influence radius
    const POINTER_STRENGTH = 70; // px/frame² max push near the pointer
    const FLOW_SPEED = 0.5; // px/frame — target speed of the ambient "field current"
    const FLOW_BLEND = 0.025; // fraction of the gap to the flow's target velocity closed per baseline frame

    /* ============================================================
       Device / frame pacing
       ============================================================ */
    const DESKTOP_TARGET_FPS = 60;
    const MOBILE_TARGET_FPS = 40;
    const MOBILE_BREAKPOINT = 768;
    const MAX_DPR = 2;

    /* ============================================================
       Density model — continuous function of viewport area, not a
       binary isMobile ? a : b split.
       ============================================================ */
    const MIN_AREA = 320 * 560; // small-phone reference
    const MAX_AREA = 1920 * 1080; // desktop reference
    const MIN_PARTICLES = 16;
    const MAX_PARTICLES = 80;
    const MIN_LINKS = 5;// max connections drawn per particle, small screens
    const MAX_LINKS = 7; // max connections drawn per particle, large screens
    const MAX_VIRTUAL_MIN = 18;
    const MAX_VIRTUAL_MAX = 44;

    const RESIZE_DEBOUNCE_MS = 150;
    const DIMENSION_STABLE_PX = 4; // ignore jitter smaller than this

    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));

    /* ============================================================
       Mutable simulation state (closed over by Particle/animate/etc,
       exactly like the previous implementation — just corrected).
       ============================================================ */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    // Lower-powered devices get a density discount on top of the area-based curve.
    const cores =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
    const coreFactor = cores <= 4 ? 0.75 : 1;

    let maxLinksPerParticle = MIN_LINKS;
    let maxVirtualParticles = MAX_VIRTUAL_MIN;
    let connectionDistance = 90;
    let forceRadius = 130;
    let virtualPairSpawnRate = 0.16;
    // Small screens get *fewer* particles (see MIN_PARTICLES/MAX_PARTICLES below)
    // but each one moves with more relative energy, so the scene still reads as
    // lively rather than sparse-and-still. Desktop, already dense, needs less of
    // a boost per particle.
    let liveliness = 1.4;
    let isMobile = width <= MOBILE_BREAKPOINT;
    let targetFPS = isMobile ? MOBILE_TARGET_FPS : DESKTOP_TARGET_FPS;
    let frameInterval = 1000 / targetFPS;
    // Physics step size normalized to a 60fps baseline, so a 32fps mobile cap
    // doesn't make the simulation itself look like it's running in slow motion.
    let dt = frameInterval / (1000 / 60);

    const computeDensity = (w: number, h: number) => {
      const area = w * h;
      const t = clamp((area - MIN_AREA) / (MAX_AREA - MIN_AREA), 0, 1);
      const particleCount = Math.round(
        (MIN_PARTICLES + t * (MAX_PARTICLES - MIN_PARTICLES)) * coreFactor
      );
      return {
        t,
        particleCount: Math.max(10, particleCount),
        maxLinks: Math.round(MIN_LINKS + t * (MAX_LINKS - MIN_LINKS)),
        maxVirtual: Math.round(
          MAX_VIRTUAL_MIN + t * (MAX_VIRTUAL_MAX - MAX_VIRTUAL_MIN)
        ),
        connectionDistance: clamp(Math.min(w, h) * 0.16, 58, 170),
        forceRadius: clamp(Math.min(w, h) * 0.22, 90, 220),
        spawnRate: 0.16 + t * 0.14,
        // 1.4x on small phones, tapering to 1.0x on large desktops.
        liveliness: 1.4 - 0.4 * t,
      };
    };

    /* ============================================================
       Pointer tracking ("observer effect") — read on window so it
       works regardless of the canvas's negative z-index, and never
       calls preventDefault so scrolling/touch stay untouched.
       ============================================================ */
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let pointerActive = false;

    const handlePointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerActive = true;
    };
    const clearPointer = () => {
      pointerActive = false;
    };

    /* ============================================================
       Reduced motion / tab visibility
       ============================================================ */
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ============================================================
       Cached glow sprites — built once, reused every frame instead
       of constructing a new radial gradient per particle per frame.
       ============================================================ */
    const createGlowSprite = (hue: number) => {
      const size = 128;
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext('2d');
      if (!sctx) return sprite;
      const gradient = sctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, `hsla(${hue}, 100%, 82%, 0.55)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 72%, 0.18)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);
      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, size, size);
      return sprite;
    };
    const spritePositive = createGlowSprite(POSITIVE_HUE);
    const spriteNegative = createGlowSprite(NEGATIVE_HUE);

    /* ============================================================
       Particle
       ============================================================ */
    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      ax = 0;
      ay = 0;
      radius = 0;
      charge: 1 | -1 = 1;
      hue = POSITIVE_HUE;
      auraMax = 0;
      auraPulse = 0;
      auraRadius = 0;
      life = 1;
      inUse = false;
      isVirtual: boolean;

      constructor(isVirtual = false) {
        this.isVirtual = isVirtual;
        this.reset();
      }

      reset(x?: number, y?: number, charge?: 1 | -1) {
        this.x = x ?? Math.random() * width;
        this.y = y ?? Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.ax = 0;
        this.ay = 0;
        this.charge = charge ?? (Math.random() > 0.5 ? 1 : -1);
        this.hue = this.charge > 0 ? POSITIVE_HUE : NEGATIVE_HUE;
        this.radius = this.isVirtual ? 1.1 : 1.1 + Math.random() * 1.6;
        this.auraMax = this.isVirtual ? 0 : this.radius + 9;
        this.auraPulse = Math.random() * Math.PI * 2;
        this.auraRadius = this.auraMax * 0.75;
        this.life = this.isVirtual ? 0.4 + Math.random() * 0.5 : 1;
        this.inUse = true;
        return this;
      }

      /** Accumulates acceleration from nearby real particles and the pointer. */
      applyForces() {
        if (this.isVirtual) return;
        let ax = 0;
        let ay = 0;
        const forceRadiusSq = forceRadius * forceRadius;

        for (let k = 0; k < activeParticles.length; k++) {
          const other = activeParticles[k];
          if (other === this || !other.inUse || other.isVirtual) continue;
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > forceRadiusSq || distSq < 1) continue;
          const r = Math.sqrt(distSq);
          // Softened Coulomb force: finite even as r -> 0.
          const forceMag =
            (this.charge * other.charge * COULOMB_K) / (distSq + SOFTENING);
          ax -= (dx / r) * forceMag;
          ay -= (dy / r) * forceMag;
        }

        if (pointerActive && pointerX !== null && pointerY !== null) {
          const dx = this.x - pointerX;
          const dy = this.y - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < POINTER_RADIUS * POINTER_RADIUS) {
            const r = Math.sqrt(distSq) || 1;
            const t = 1 - r / POINTER_RADIUS;
            const push = POINTER_STRENGTH * t * t; // smooth, bounded falloff
            ax += (dx / r) * push;
            ay += (dy / r) * push;
          }
        }

        this.ax = ax;
        this.ay = ay;
      }

      /** Integrates velocity/position for one (dt-scaled) step. */
      integrate() {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;

        // Frame-rate-independent exponential damping (energy dissipation).
        const dampFactor = Math.pow(DAMPING, dt);
        this.vx *= dampFactor;
        this.vy *= dampFactor;

        // Small thermal noise so the field never fully settles (random-walk
        // variance scales with sqrt(dt), the physically correct scaling).
        // Scaled by `liveliness` so phones — which deliberately run fewer
        // particles to avoid clutter — get more visible motion per particle
        // instead of just looking sparse and still.
        const jitter = THERMAL_JITTER * liveliness * Math.sqrt(dt);
        this.vx += (Math.random() - 0.5) * jitter;
        this.vy += (Math.random() - 0.5) * jitter;

        // Ambient "field current" — a slow, smoothly-shifting flow (two
        // offset sine waves standing in for a cheap curl-noise field) that
        // gently steers particles along, giving the scene a coherent drift
        // on top of individual jitter. Deliberately implemented as a nudge
        // *toward a target velocity* (steering) rather than a continuously
        // added force: a slowly-varying force is coherent enough to fight
        // the gentle damping above and pile up almost undamped, while a
        // steering term is self-limiting by construction — it can approach
        // its target but never run away, however it's tuned. Opposite
        // charges get a phase-shifted copy, echoing how a real field
        // pushes positive and negative charges differently.
        const flowPhase = this.charge > 0 ? 0 : Math.PI;
        const targetFlowVX =
          Math.sin(this.y * 0.006 + simTime * 0.015 + flowPhase) *
          FLOW_SPEED *
          liveliness;
        const targetFlowVY =
          Math.cos(this.x * 0.006 + simTime * 0.012 + flowPhase) *
          FLOW_SPEED *
          liveliness;
        const flowBlend = 1 - Math.pow(1 - FLOW_BLEND, dt);
        this.vx += (targetFlowVX - this.vx) * flowBlend;
        this.vy += (targetFlowVY - this.vy) * flowBlend;

        // Safety-net clamp — belt and suspenders on top of damping.
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > MAX_SPEED) {
          const s = MAX_SPEED / speed;
          this.vx *= s;
          this.vy *= s;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Bounce off the edges with a touch of inelasticity so the walls
        // can't pump energy into the system.
        if (this.x < this.radius) {
          this.x = this.radius;
          this.vx = Math.abs(this.vx) * 0.9;
        } else if (this.x > width - this.radius) {
          this.x = width - this.radius;
          this.vx = -Math.abs(this.vx) * 0.9;
        }
        if (this.y < this.radius) {
          this.y = this.radius;
          this.vy = Math.abs(this.vy) * 0.9;
        } else if (this.y > height - this.radius) {
          this.y = height - this.radius;
          this.vy = -Math.abs(this.vy) * 0.9;
        }

        this.auraPulse += 0.035 * dt;
        this.auraRadius =
          this.auraMax * (0.62 + Math.sin(this.auraPulse) * 0.38);

        if (this.isVirtual) {
          this.life -= 0.012 * dt;
          if (this.life <= 0) this.inUse = false;
        }
      }

      draw() {
        // Re-checked locally: TypeScript's narrowing of the outer `ctx`
        // doesn't persist into class method bodies.
        if (!ctx) return;
        if (!this.isVirtual && this.auraRadius > 0.5) {
          const sprite = this.charge > 0 ? spritePositive : spriteNegative;
          const size = this.auraRadius * 2;
          ctx.drawImage(
            sprite,
            this.x - this.auraRadius,
            this.y - this.auraRadius,
            size,
            size
          );
        }
        const coreAlpha = this.isVirtual
          ? this.life * 0.9
          : 0.82 + Math.sin(this.auraPulse * 1.3) * 0.18;
        const coreLightness = this.isVirtual ? 72 : 80;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${coreLightness}%, ${coreAlpha})`;
        ctx.fill();
      }
    }

    /* ============================================================
       Object pool + active list
       ============================================================ */
    const particlePool: Particle[] = [];
    const activeParticles: Particle[] = [];

    const getParticle = (isVirtual = false): Particle => {
      for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];
        if (!p.inUse && p.isVirtual === isVirtual) return p.reset();
      }
      const p = new Particle(isVirtual);
      particlePool.push(p);
      return p;
    };

    const init = (particleCount: number) => {
      activeParticles.length = 0;
      particlePool.length = 0;
      for (let i = 0; i < particleCount; i++) {
        activeParticles.push(getParticle(false));
      }
    };

    const countVirtual = () => {
      let c = 0;
      for (let i = 0; i < activeParticles.length; i++) {
        if (activeParticles[i].isVirtual) c++;
      }
      return c;
    };

    const spawnVirtualPair = () => {
      if (countVirtual() >= maxVirtualParticles) return;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const p1 = getParticle(true).reset(x, y, 1);
      const p2 = getParticle(true).reset(
        x + Math.random() * 10 - 5,
        y + Math.random() * 10 - 5,
        -1
      );
      activeParticles.push(p1, p2);
    };

    /** Grows or shrinks the *real* particle count without touching existing particles. */
    const adjustParticleCount = (target: number) => {
      let realCount = 0;
      for (let i = 0; i < activeParticles.length; i++) {
        if (!activeParticles[i].isVirtual) realCount++;
      }
      const diff = target - realCount;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) activeParticles.push(getParticle(false));
      } else if (diff < 0) {
        let toRemove = -diff;
        for (let i = activeParticles.length - 1; i >= 0 && toRemove > 0; i--) {
          if (!activeParticles[i].isVirtual) {
            activeParticles[i].inUse = false;
            activeParticles.splice(i, 1);
            toRemove--;
          }
        }
      }
    };

    /* ============================================================
       Photon-exchange lines — a bounded-degree nearest-neighbor
       graph instead of an unbounded "every pair within range" mesh,
       so density can't turn into a hairball on small screens.
       ============================================================ */
    type LinkCandidate = { a: Particle; b: Particle; dist: number };
    const linkCandidates: LinkCandidate[] = [];
    const linkDegree = new Map<Particle, number>();

    const drawPhotonLine = (a: Particle, b: Particle, dist: number) => {
      const midX = (a.x + b.x) / 2 + (Math.random() - 0.5) * 30;
      const midY = (a.y + b.y) / 2 + (Math.random() - 0.5) * 30;
      const t = 1 - dist / connectionDistance;
      const alpha = t * t * 0.85;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(midX, midY, b.x, b.y);

      // Two cheap passes (wide + faint, then thin + bright) fake a glow
      // without touching ctx.shadowBlur.
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = `hsla(${PHOTON_HUE}, 95%, 70%, ${alpha * 0.22})`;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsla(${PHOTON_HUE}, 100%, 62%, ${alpha})`;
      ctx.stroke();
    };

    const drawPhotonLines = () => {
      linkCandidates.length = 0;
      const connDistSq = connectionDistance * connectionDistance;

      for (let i = 0; i < activeParticles.length; i++) {
        const p1 = activeParticles[i];
        if (!p1.inUse || p1.isVirtual) continue;
        for (let j = i + 1; j < activeParticles.length; j++) {
          const p2 = activeParticles[j];
          if (!p2.inUse || p2.isVirtual) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connDistSq) {
            linkCandidates.push({ a: p1, b: p2, dist: Math.sqrt(distSq) });
          }
        }
      }

      linkCandidates.sort((x, y) => x.dist - y.dist);
      linkDegree.clear();
      for (let i = 0; i < linkCandidates.length; i++) {
        const c = linkCandidates[i];
        const da = linkDegree.get(c.a) ?? 0;
        const db = linkDegree.get(c.b) ?? 0;
        if (da >= maxLinksPerParticle || db >= maxLinksPerParticle) continue;
        drawPhotonLine(c.a, c.b, c.dist);
        linkDegree.set(c.a, da + 1);
        linkDegree.set(c.b, db + 1);
      }
    };

    /* ============================================================
       Canvas sizing — DPR-aware backing store, CSS px drawing space.
       ============================================================ */
    const applyCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ============================================================
       Main loop
       ============================================================ */
    let lastFrameTime = 0;
    // Baseline-frame clock (not wall-clock ms) driving the ambient flow field
    // below — advances once per *executed* simulation step, so it speeds up
    // or slows down consistently with everything else if the frame rate ever
    // changes, instead of drifting independently.
    let simTime = 0;

    const animate = (timestamp: number) => {
      animationFrameId.current = requestAnimationFrame(animate);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = timestamp - (elapsed % frameInterval);

      ctx.clearRect(0, 0, width, height);
      simTime += dt;

      if (Math.random() < virtualPairSpawnRate) spawnVirtualPair();

      drawPhotonLines();

      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        if (!p.inUse) {
          activeParticles.splice(i, 1);
          continue;
        }
        p.applyForces();
        p.integrate();
        p.draw();
      }
    };

    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      drawPhotonLines();
      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];
        if (p.inUse && !p.isVirtual) p.draw();
      }
    };

    const startLoop = () => {
      if (animationFrameId.current !== undefined) return;
      lastFrameTime = 0;
      animationFrameId.current = requestAnimationFrame(animate);
    };
    const stopLoop = () => {
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    };

    /* ============================================================
       Resize handling — debounced, ignores pure-height jitter
       (mobile URL bar), re-tunes density continuously, and adjusts
       the particle count incrementally instead of reinitializing.
       ============================================================ */
    let lastWidth = width;
    let lastHeight = height;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;

    const applyResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const widthChanged =
        Math.abs(newWidth - lastWidth) > DIMENSION_STABLE_PX;
      const heightChanged =
        Math.abs(newHeight - lastHeight) > DIMENSION_STABLE_PX;
      if (!widthChanged && !heightChanged) return;

      width = newWidth;
      height = newHeight;
      applyCanvasSize();

      if (!widthChanged) {
        // Almost certainly the mobile browser chrome showing/hiding while
        // scrolling. Keep the simulation exactly as it is, just clamp
        // anything that would now sit outside the visible area.
        for (let i = 0; i < activeParticles.length; i++) {
          const p = activeParticles[i];
          p.x = clamp(p.x, p.radius, width - p.radius);
          p.y = clamp(p.y, p.radius, height - p.radius);
        }
        lastWidth = newWidth;
        lastHeight = newHeight;
        return;
      }

      // A genuine resize / orientation change: re-tune continuously and
      // grow or shrink the particle count without discarding it.
      const density = computeDensity(width, height);
      maxLinksPerParticle = density.maxLinks;
      maxVirtualParticles = density.maxVirtual;
      connectionDistance = density.connectionDistance;
      forceRadius = density.forceRadius;
      virtualPairSpawnRate = density.spawnRate;
      liveliness = density.liveliness;
      adjustParticleCount(density.particleCount);

      isMobile = width <= MOBILE_BREAKPOINT;
      targetFPS = isMobile ? MOBILE_TARGET_FPS : DESKTOP_TARGET_FPS;
      frameInterval = 1000 / targetFPS;
      dt = frameInterval / (1000 / 60);

      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];
        p.x = clamp(p.x, p.radius, width - p.radius);
        p.y = clamp(p.y, p.radius, height - p.radius);
      }

      lastWidth = newWidth;
      lastHeight = newHeight;
    };

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyResize, RESIZE_DEBOUNCE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (!motionQuery.matches) {
        startLoop();
      }
    };

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        stopLoop();
        renderStaticFrame();
      } else if (!document.hidden) {
        startLoop();
      }
    };

    /* ============================================================
       Setup
       ============================================================ */
    applyCanvasSize();
    const initialDensity = computeDensity(width, height);
    maxLinksPerParticle = initialDensity.maxLinks;
    maxVirtualParticles = initialDensity.maxVirtual;
    connectionDistance = initialDensity.connectionDistance;
    forceRadius = initialDensity.forceRadius;
    virtualPairSpawnRate = initialDensity.spawnRate;
    liveliness = initialDensity.liveliness;
    init(initialDensity.particleCount);

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerdown', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerleave', clearPointer, { passive: true });
    window.addEventListener('blur', clearPointer);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    if (motionQuery.matches) {
      renderStaticFrame();
    } else if (!document.hidden) {
      startLoop();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      window.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      stopLoop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 -z-10 h-full w-full"
      style={{
        background:
          'radial-gradient(circle at 50% 28%, hsl(205 75% 96%) 0%, hsl(192 50% 97.5%) 45%, hsl(180 35% 97%) 100%)',
      }}
    />
  );
};

export default AnimatedBackground;
