/**
 * @file src/components/infinite-scroller.tsx
 * @description A component that creates an infinitely scrolling row of elements.
 *              It duplicates the content to create a seamless looping effect.
 * @note This is a client component because it uses hooks (`useEffect`, `useRef`).
 */
'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

interface InfiniteScrollerProps {
  children: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

/**
 * InfiniteScroller creates a seamless, looping animation of its children.
 * @param {InfiniteScrollerProps} props - The component props.
 * @returns {JSX.Element} A div containing the scrolling animation.
 */
export const InfiniteScroller = ({
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = false, // Changed default to false, though the class is removed
}: InfiniteScrollerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    /**
     * Clones the scroller content to create the illusion of an infinite loop.
     * Sets CSS custom properties for animation speed and direction.
     */
    const addAnimation = () => {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);
        
        // Clear any previously cloned items before re-cloning.
        scrollerContent.forEach(item => {
          if (item.getAttribute('aria-hidden')) {
            item.remove();
          }
        });
        
        // Clone each item and mark it as decorative for accessibility.
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute('aria-hidden', 'true');
            scrollerRef.current?.appendChild(duplicatedItem);
        });

        // Map speed prop to CSS animation duration.
        const speedMap = {
          slow: '80s',
          normal: '40s',
          fast: '20s',
        };
        
        containerRef.current.style.setProperty('--animation-duration', speedMap[speed]);
        containerRef.current.style.setProperty(
          '--animation-direction',
          direction === 'left' ? 'normal' : 'reverse'
        );
        
        scrollerRef.current.classList.add('animate-scrolling-logos');
      }
    };

    addAnimation();
  }, [children, speed, direction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller-container relative w-full overflow-hidden',
        // Adds a fade effect to the edges of the scroller.
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]'
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap'
        )}
      >
        {React.Children.map(children, (child, idx) => (
            <li key={idx} className="flex-shrink-0">{child}</li>
        ))}
      </ul>
    </div>
  );
};
