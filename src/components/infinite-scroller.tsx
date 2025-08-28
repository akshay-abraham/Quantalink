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

export const InfiniteScroller = ({
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
}: InfiniteScrollerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const addAnimation = () => {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);
        
        // Clear previous clones
        scrollerContent.forEach(item => {
          if (item.getAttribute('aria-hidden')) {
            item.remove();
          }
        });
        
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute('aria-hidden', 'true');
            scrollerRef.current?.appendChild(duplicatedItem);
        });

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
        
        // Add the animation class
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
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]'
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {React.Children.map(children, (child, idx) => (
            <li key={idx} className="flex-shrink-0">{child}</li>
        ))}
      </ul>
    </div>
  );
};
