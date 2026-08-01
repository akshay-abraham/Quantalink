/**
 * @file src/components/desktop-nav.tsx
 * @description The navigation bar component for desktop screens.
 *              It provides a clear, always-visible navigation experience for users on larger devices.
 *
 * @note This no longer has its own `hidden md:flex` breakpoint classes.
 *       `MainNav` already owns the desktop/mobile switch (via `hidden
 *       md:block` / `md:hidden` wrapper divs), so this component doesn't
 *       need to duplicate that logic -- it previously did, which worked
 *       fine but meant the breakpoint lived in two places that had to be
 *       kept in agreement.
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';

/**
 * DesktopNav component renders a horizontal navigation menu for larger screens.
 * It highlights the active link based on the current URL pathname.
 * @returns {JSX.Element} A nav element containing the navigation links.
 */
export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 bg-card/50 border border-border/60 p-1 rounded-full backdrop-blur-md">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              'hover:bg-primary/10',
              // Apply active styles if the current path matches the link's href.
              isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
