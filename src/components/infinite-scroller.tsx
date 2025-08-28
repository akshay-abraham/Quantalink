/**
 * @file src/components/infinite-scroller.tsx
 * @description A component that creates an infinitely scrolling row of elements.
 *              It duplicates the content to create a seamless looping effect.
 * @note This is a client component because it uses hooks (`useEffect`, `useRef`).
 */
'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollerProps {
  children: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export const InfiniteScroller = ({
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
}: InfiniteScrollerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '20s',
  };

  useEffect(() => {
    // This hook ensures the logic runs only on the client side after mounting.
    setIsMounted(true);

    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate the content to create the seamless scroll effect.
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        scrollerRef.current?.appendChild(duplicatedItem);
      });
      
      // Set CSS variables for animation control.
      containerRef.current.style.setProperty('--animation-duration', speedMap[speed]);
      containerRef.current.style.setProperty(
        '--animation-direction',
        direction === 'left' ? 'normal' : 'reverse'
      );
    }
  }, [speed, direction]);
  
  // Render nothing on the server to avoid hydration mismatches with duplicated content.
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller-container relative w-full overflow-hidden',
        // Adds a fading mask to the edges for a smoother visual transition.
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]'
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap',
           // The animation is applied here. It will pause on hover if enabled.
          'animate-scrolling-logos',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
