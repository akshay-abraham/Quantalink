/**
 * @file src/components/mobile-nav.tsx
 * @description The navigation component for mobile screens. It features a
 *              "three dots" button that opens a drawer with navigation links.
 */
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MoreHorizontal, Home, User, Code, Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/skills', label: 'Skills & Technologies', icon: Code },
  { href: '/projects', label: 'Projects', icon: Star },
];

/**
 * MobileNav component provides a drawer-based navigation menu for small screens.
 * @returns {JSX.Element} A Sheet component containing the navigation menu.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-card/50 border-border/60">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-card/90 backdrop-blur-md rounded-t-2xl border-t border-border/50">
           <div className="p-4">
            <nav className="flex flex-col gap-4">
               {navLinks.map((link) => {
                 const isActive = pathname === link.href;
                 return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-lg text-lg font-medium transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-primary/5'
                    )}
                  >
                    <link.icon className="h-6 w-6" />
                    {link.label}
                  </Link>
                 );
               })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
