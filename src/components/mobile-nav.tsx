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

/**
 * MobileNav provides an animated, space-saving navigation for small screens.
 * @returns {JSX.Element} An animated navigation component.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-collapse the menu after a delay of inactivity
  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // 5 seconds
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-end transition-all duration-500 ease-in-out',
        'bg-card/50 border border-border/60 rounded-full backdrop-blur-md',
         isOpen ? 'w-full max-w-xs p-2' : 'w-12 h-12'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center z-10"
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

      <nav
        className={cn(
          'flex items-center justify-around w-full transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors w-14',
                isActive ? 'text-primary' : 'text-foreground/70 hover:text-primary'
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
