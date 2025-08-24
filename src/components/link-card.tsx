/**
 * @file src/components/link-card.tsx
 * @description A single, interactive card component for displaying a link.
 *              It features a 3D tilt effect on hover, a glowing background, and an icon.
 * @note This is a client component because it uses `useRef` for direct DOM manipulation
 *       to achieve the interactive hover effects.
 */
"use client"

import React, { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the LinkCard component.
 */
interface LinkCardProps {
  href: string;
  title: string;
  Icon: LucideIcon; // The icon component to display.
  delay: number; // Animation delay for the fade-in effect.
  isVisible: boolean; // Flag from the parent to trigger the animation.
}

/**
 * LinkCard is a visually interactive anchor tag styled as a card.
 * @param {LinkCardProps} props - The props for the component.
 * @returns {JSX.Element} An interactive anchor tag.
 */
export default function LinkCard({ href, title, Icon, delay, isVisible }: LinkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  /**
   * Handles the mouse move event to create a 3D tilt and glow effect.
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center.
    const x = clientX - left;
    const y = clientY - top;
    const rotateX = (y / height - 0.5) * -20; // Tilt up/down.
    const rotateY = (x / width - 0.5) * 20;   // Tilt left/right.

    // Apply the 3D transform for the tilt effect.
    cardRef.current.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08, 1.08, 1.08)`;
    
    // Update CSS custom properties for the background glow position.
    cardRef.current.style.setProperty('--glow-x', `${x}px`);
    cardRef.current.style.setProperty('--glow-y', `${y}px`);
    cardRef.current.classList.add('is-hovering');
  };

  /**
   * Resets the card's transform when the mouse leaves.
   */
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(2000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    cardRef.current.classList.remove('is-hovering');
  };

  return (
    <a
      ref={cardRef}
      href={href}
      target="_blank" // Open link in a new tab.
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center justify-center w-full p-4 h-16 rounded-xl bg-card/30 border border-border/40 shadow-lg transition-all duration-700 ease-out",
        "hover:border-primary/70 hover:shadow-[0_0_60px_-15px_hsl(var(--primary)/0.5)]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "overflow-hidden",
        // The ::before pseudo-element creates the radial glow effect. Its position is controlled by CSS variables.
        "before:absolute before:w-56 before:h-56 before:left-[var(--glow-x)] before:top-[var(--glow-y)] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-primary/20 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500",
        "is-hovering:before:opacity-100", // The glow becomes visible on hover.
        // Trigger fade-in animation when the card becomes visible in the viewport.
        isVisible ? "animate-fade-in-up" : "opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, transitionProperty: 'transform, box-shadow, border-color' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Icon className="absolute left-4 h-6 w-6 text-foreground/60 transition-colors group-hover:text-primary" />
      <span className="font-medium text-foreground transition-colors group-hover:text-primary">
        {title}
      </span>
    </a>
  );
}
