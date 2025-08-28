/**
 * @file src/components/desktop-nav.tsx
 * @description The navigation bar component for desktop screens.
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, User, Code, Star } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/skills', label: 'Skills & Technologies', icon: Code },
  { href: '/projects', label: 'Projects', icon: Star },
];

/**
 * DesktopNav component renders a horizontal navigation menu for larger screens.
 * @returns {JSX.Element} A nav element containing the navigation links.
 */
export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              'hover:bg-primary/10',
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
