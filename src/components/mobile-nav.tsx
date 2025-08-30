/**
 * @file src/components/mobile-nav.tsx
 * @description The navigation component for mobile screens. It features an
 *              animating toggle button that expands into a navigation bar.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, User, Code, Star, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/skills', label: 'Skills', icon: Code },
  { href: '/projects', label: 'Projects', icon: Star },
];

// --- PRECISE WIDTH CALCULATION CONSTANTS ---
// These values are based on the Tailwind CSS classes used (w-14, p-1, etc.)
const ICON_CONTAINER_WIDTH = 56; // w-14 -> 3.5rem -> 56px
const GAP_WIDTH = 4; // gap-1 -> 0.25rem -> 4px
const HORIZONTAL_PADDING = 8; // px-1 on each side -> 0.25rem * 2 -> 8px
const TOGGLE_BUTTON_WIDTH = 48; // h-12 w-12 -> 3rem -> 48px

/**
 * MobileNav provides an animated, space-saving navigation for small screens.
 * @returns {JSX.Element} An animated navigation component.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-collapse the menu after a delay of inactivity
  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // 5 seconds
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  // Close menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // --- DEFINITIVE OVERFLOW FIX ---
  // Calculate the exact width required for the expanded menu
  const navWidth = isOpen 
    ? (navLinks.length * ICON_CONTAINER_WIDTH) + ((navLinks.length -1) * GAP_WIDTH) + HORIZONTAL_PADDING + TOGGLE_BUTTON_WIDTH
    : TOGGLE_BUTTON_WIDTH;

  return (
    <div ref={navRef} className="relative h-12">
      <nav 
        className={cn(
            'absolute right-0 top-0 h-12 flex items-center justify-end rounded-full bg-card/50 border border-border/60 backdrop-blur-md transition-[width] duration-500 ease-in-out'
        )}
        style={{ width: `${navWidth}px`}}
      >
        {/* Nav Links Container */}
        <div className={cn(
          "flex items-center gap-1 px-1 mr-[48px] h-full transition-opacity duration-300",
          isOpen ? 'opacity-100' : 'opacity-0'
        )}>
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-lg text-xs font-medium transition-all duration-300 ease-in-out',
                  isActive ? 'text-primary' : 'text-foreground/70 hover:text-primary',
                  isOpen ? 'scale-100' : 'scale-0'
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                }}
                tabIndex={isOpen ? 0 : -1}
              >
                <link.icon className="h-5 w-5" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 flex items-center justify-center rounded-full z-20 absolute right-0"
          aria-label="Toggle Navigation"
        >
          <div className="relative h-6 w-6">
            <Menu
              className={cn(
                'absolute h-6 w-6 transition-all duration-300 ease-in-out',
                isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
              )}
            />
            <X
              className={cn(
                'absolute h-6 w-6 transition-all duration-300 ease-in-out',
                isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
              )}
            />
          </div>
        </button>
      </nav>
    </div>
  );
}
