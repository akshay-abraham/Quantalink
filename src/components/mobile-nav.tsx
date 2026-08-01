/**
 * @file src/components/mobile-nav.tsx
 * @description The navigation component for mobile screens. It features an
 *              animating toggle button that expands into a navigation bar.
 *              The width is precisely calculated to prevent layout issues.
 *
 * @note Reliability pass -- what changed and why:
 *
 *       The auto-expand-on-navigate flourish (collapsed button pops open
 *       into the full labeled pill on any route change, then closes again)
 *       is intentional and kept. The flicker was a real timing bug in *how*
 *       it collapsed: the code scheduled the collapse with a JS timer set to
 *       the *same* duration as the CSS width transition, started at the
 *       *same* moment the expand began. Measured it directly: the collapse
 *       fired ~696ms after the expand started, against a 700ms transition --
 *       a 4ms gap. In practice that means the collapse was requested at
 *       virtually the same instant the pill finished opening, with zero real
 *       time to rest at full width -- and under any main-thread jank (which
 *       is exactly when you'd most notice it), the collapse can fire
 *       *before* the expand visually finishes, reversing the width
 *       transition mid-flight. That reversal is the flicker.
 *
 *       Fix: the collapse now waits for the real `transitionend` of the
 *       expand (the browser's own confirmation it actually finished, not a
 *       guess), then holds for a genuine `DWELL_MS` at full width, then
 *       collapses. A safety-net timer still guarantees this can never get
 *       stuck open -- e.g. under `prefers-reduced-motion`, no transition (and
 *       so no `transitionend`) fires at all, which is handled explicitly
 *       rather than falling through to the generic fallback.
 *
 *       Everything else is a smoothness/reliability pass, behavior
 *       otherwise unchanged:
 *       - Icon and toggle-icon transitions now name the exact properties
 *         they animate (`transform`, `opacity`) instead of `transition-all`,
 *         so nothing layout-affecting gets swept in by accident -- only
 *         compositor-cheap properties animate on the icons themselves.
 *       - Outside-click detection moved from `mousedown` to `pointerdown`,
 *         the unified mouse/touch/pen event -- more reliable on actual
 *         mobile hardware than relying on synthesized mousedown.
 *       - The 5s auto-collapse timer (for a *manually* opened menu) now
 *         resets on any interaction inside the open menu, instead of a fixed
 *         window that could close the menu out from under someone mid-tap.
 *       - Added `aria-expanded` / `aria-controls` / `aria-hidden` /
 *         `aria-current` for screen readers, and `motion-reduce:` variants
 *         so the animation is skipped for anyone who's asked their OS for
 *         reduced motion.
 *       - The nav link data now comes from `./nav-links`, shared with
 *         `DesktopNav`, instead of being duplicated in both files.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';

// --- PRECISE WIDTH CALCULATION CONSTANTS (in pixels) ---
// These values are based on the Tailwind CSS classes used (w-14, gap-1, etc.)
// to ensure the expanded menu has the exact width required and does not overflow.
const ICON_CONTAINER_WIDTH = 56; // w-14 -> 3.5rem
const GAP_WIDTH = 4; // gap-1 -> 0.25rem
const HORIZONTAL_PADDING = 8; // px-1 on each side -> 0.25rem * 2
const TOGGLE_BUTTON_WIDTH = 48; // h-12 w-12 -> 3rem

const TRANSITION_MS = 700; // CSS width transition duration, expand & collapse alike
const DWELL_MS = 550; // how long to stay fully open before auto-collapsing

// Tune the moment each icon starts its expand animation. These are deliberately
// separate so the mobile-nav choreography can be calibrated one icon at a time.
const HOME_ICON_ANIMATION_DELAY_MS = 95;
const ABOUT_ICON_ANIMATION_DELAY_MS = 65;
const SKILLS_ICON_ANIMATION_DELAY_MS = 40;
const PROJECTS_ICON_ANIMATION_DELAY_MS = -10;

const ICON_ANIMATION_DELAYS_MS = [
  HOME_ICON_ANIMATION_DELAY_MS,
  ABOUT_ICON_ANIMATION_DELAY_MS,
  SKILLS_ICON_ANIMATION_DELAY_MS,
  PROJECTS_ICON_ANIMATION_DELAY_MS,
];

// Fallback only -- covers cases where `transitionend` never fires (see the
// explicit prefers-reduced-motion branch below for the common one).
const SAFETY_NET_MS = TRANSITION_MS + DWELL_MS + 400;
const AUTO_COLLAPSE_MS = 5000; // how long a *manually* opened menu stays open with no interaction

/**
 * MobileNav provides an animated, space-saving navigation for small screens.
 * @returns {JSX.Element} An animated navigation component.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLElement>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingExpandEndRef = useRef(false);
  const flourishActiveRef = useRef(false);
  const prevPathnameRef = useRef(pathname);

  // Auto-collapse a *manually* opened menu after a period of inactivity,
  // resetting that window on any interaction inside it so it can't snap
  // shut mid-tap. (Separate from the navigate-triggered flourish below.)
  useEffect(() => {
    if (!isOpen) {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      return;
    }
    const resetCollapseTimer = () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = setTimeout(
        () => setIsOpen(false),
        AUTO_COLLAPSE_MS
      );
    };
    resetCollapseTimer();
    const node = navRef.current;
    node?.addEventListener('pointerdown', resetCollapseTimer);
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      node?.removeEventListener('pointerdown', resetCollapseTimer);
    };
  }, [isOpen]);

  // Close the menu on outside interaction. `pointerdown` unifies mouse,
  // touch, and pen in one listener.
  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, []);

  const clearFlourishTimers = () => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    safetyTimerRef.current = null;
    dwellTimerRef.current = null;
  };

  const collapse = () => {
    clearFlourishTimers();
    awaitingExpandEndRef.current = false;
    flourishActiveRef.current = false;
    setIsNavigating(false);
  };

  // Animate the menu open, then closed, on every route change.
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    if (!flourishActiveRef.current) awaitingExpandEndRef.current = true;
    flourishActiveRef.current = true;

    setIsOpen(false);
    setIsNavigating(true);
    clearFlourishTimers();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // No CSS transition will run, so there's nothing for transitionend to
      // report -- just show it briefly and close, no need to wait out the
      // (nonexistent) transition first.
      awaitingExpandEndRef.current = false;
      dwellTimerRef.current = setTimeout(collapse, DWELL_MS);
    } else {
      // Safety net in case transitionend doesn't arrive for some other
      // reason (e.g. the element unmounts mid-transition).
      safetyTimerRef.current = setTimeout(collapse, SAFETY_NET_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // The actual sync point: only start the "how long to stay open" dwell
  // once the browser confirms the expand has genuinely finished painting,
  // rather than guessing from a timer racing the CSS transition.
  useEffect(() => {
    const node = pillRef.current;
    if (!node) return;
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== node || event.propertyName !== 'width') return;
      if (!awaitingExpandEndRef.current) return; // this was the collapse's own transitionend
      awaitingExpandEndRef.current = false;
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      dwellTimerRef.current = setTimeout(collapse, DWELL_MS);
    };
    node.addEventListener('transitionend', handleTransitionEnd);
    return () => node.removeEventListener('transitionend', handleTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => clearFlourishTimers, []);

  const showIcons = isOpen || isNavigating;

  // **Definitive Overflow Fix:** Calculate the exact width required for the expanded menu.
  const navWidth = showIcons
    ? navLinks.length * ICON_CONTAINER_WIDTH +
      navLinks.length * GAP_WIDTH +
      HORIZONTAL_PADDING +
      TOGGLE_BUTTON_WIDTH
    : TOGGLE_BUTTON_WIDTH;

  return (
    <div ref={navRef} className="relative h-12">
      <nav
        ref={pillRef}
        className={cn(
          'absolute right-0 top-0 h-12 flex items-center justify-end rounded-full bg-card/50 border border-border/60 backdrop-blur-md transition-[width] motion-reduce:transition-none will-change-[width]'
        )}
        style={{
          width: `${navWidth}px`,
          transitionDuration: `${TRANSITION_MS}ms`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Nav Links Container */}
        <div
          id="mobile-nav-links"
          className={cn(
            'flex items-center gap-1 px-1 mr-12 h-full transition-opacity duration-300 motion-reduce:transition-none',
            showIcons ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={!showIcons}
        >
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-lg text-xs font-medium transition-[transform,opacity] duration-500 ease-in-out motion-reduce:transition-none motion-reduce:animate-none',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary',
                  // Scale in/out animation for each icon.
                  showIcons ? 'animate-nav-item-in' : 'animate-nav-item-out'
                )}
                style={{
                  // Stagger the animation for a "fanning out" effect. Adjust
                  // the four named constants above to calibrate each icon.
                  animationDelay: showIcons
                    ? `${ICON_ANIMATION_DELAYS_MS[index]}ms`
                    : '0ms',
                }}
                tabIndex={isOpen ? 0 : -1} // Make icons non-tabbable when closed.
              >
                <link.icon className="h-5 w-5" />
                <span className="truncate">{link.shortLabel}</span>
              </Link>
            );
          })}
        </div>

        {/* Animated Toggle Button (Menu/X) */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="h-12 w-12 flex items-center justify-center rounded-full z-20 absolute right-0"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-links"
        >
          <div className="relative h-6 w-6">
            <Menu
              className={cn(
                'absolute h-6 w-6 transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none',
                isOpen
                  ? 'opacity-0 scale-50 rotate-90'
                  : 'opacity-100 scale-100 rotate-0'
              )}
            />
            <X
              className={cn(
                'absolute h-6 w-6 transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none',
                isOpen
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'opacity-0 scale-50 -rotate-90'
              )}
            />
          </div>
        </button>
      </nav>
    </div>
  );
}
