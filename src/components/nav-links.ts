/**
 * @file src/components/nav-links.ts
 * @description Single source of truth for the app's primary navigation
 *              links, shared between DesktopNav and MobileNav. Previously
 *              this array was duplicated in both files (correctly, but
 *              identically apart from the "Skills" vs "Skills & Technologies"
 *              label) -- a real risk if a route is ever added to one and
 *              forgotten in the other. `shortLabel` preserves that
 *              intentional difference: mobile's fanned-out icons need the
 *              compact text, desktop's roomier pill can afford the fuller one.
 */
import type { LucideIcon } from 'lucide-react';
import { Home, User, Code, Star } from 'lucide-react';

export interface NavLink {
  href: string;
  /** Full label -- used on desktop, where there's room. */
  label: string;
  /** Compact label -- used on mobile's fanned-out icons. */
  shortLabel: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home', shortLabel: 'Home', icon: Home },
  { href: '/about', label: 'About', shortLabel: 'About', icon: User },
  {
    href: '/skills',
    label: 'Skills & Technologies',
    shortLabel: 'Skills',
    icon: Code,
  },
  { href: '/projects', label: 'Projects', shortLabel: 'Projects', icon: Star },
];
