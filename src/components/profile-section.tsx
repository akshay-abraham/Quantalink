/**
 * @file src/components/profile-section.tsx
 * @description The main profile section for the homepage, including the avatar,
 *              name, and tagline.
 * @note This is a client component due to the use of hooks (`useRef`, `useInView`) for animations.
 */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInView } from '@/hooks/use-in-view';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * ProfileSection displays the main hero content of the portfolio.
 * @returns {JSX.Element} A section element containing the profile information.
 */
export default function ProfileSection() {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useInView(ref);

  return (
    <section 
      ref={ref}
      className="flex flex-col items-center space-y-4 text-center pt-12 md:pt-20"
    >
      {/* The container for the avatar with its animation. */}
      <div 
        className={cn(
            "relative group transition-all duration-1000 ease-out",
            // The avatar scales and fades in when it becomes visible.
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
         {/* Adds a pulsing glow effect behind the avatar on hover. */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-accent-foreground rounded-full opacity-0 group-hover:opacity-75 transition duration-500 group-hover:blur-xl animate-pulse group-hover:animate-none"></div>
        <Avatar className="relative h-28 w-28 md:h-32 md:w-32 border-4 border-card/80 shadow-lg group-hover:border-primary/50 transition-all duration-500 ease-out transform group-hover:scale-110">
          {/* 
            The profile picture. The `src` points to `/profile.webp`.
            Next.js automatically serves files from the `/public` directory at the root level.
            To change the image, replace the `profile.webp` file in the `/public` folder.
          */}
          <AvatarImage src="/profile.webp" alt="Akshay Abraham Profile Picture" />
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>
      </div>
      
      {/* The container for the text content with its animation. */}
      <div 
        className={cn(
            "transition-all duration-1000 ease-out",
            // The text fades and slides up when it becomes visible.
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{transitionDelay: '200ms'}}
      >
        <div className="flex items-center justify-center gap-2">
            {/* The main heading with the full name for SEO. */}
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-shadow cursor-default">
              Akshay K Rooben Abraham
            </h1>
        </div>
        <p className="text-sm md:text-base text-foreground/70 mt-1 text-shadow">
          Aspirant Theoretical Physicist · PCMB Student · Open-Source Contributor
        </p>
      </div>
    </section>
  );
}
