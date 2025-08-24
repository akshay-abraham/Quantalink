/**
 * @file src/hooks/use-in-view.ts
 * @description A custom React hook that detects when an element is visible in the viewport.
 *              It uses the Intersection Observer API for efficient detection.
 * @note This is a client-side hook because it uses browser-specific APIs.
 */
"use client"

import { useState, useEffect, RefObject } from 'react';

/**
 * A custom hook to track if a referenced element is in the viewport.
 * @param {RefObject<Element>} ref - A React ref attached to the element to observe.
 * @param {IntersectionObserverInit} [options] - Optional configuration for the Intersection Observer.
 * @returns {boolean} `true` if the element is in view, otherwise `false`.
 */
export function useInView(ref: RefObject<Element>, options?: IntersectionObserverInit): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Create an Intersection Observer to watch for the element entering the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      // If the element is intersecting (i.e., visible), update the state.
      if (entry.isIntersecting) {
        setIsInView(true);
        // We can unobserve after it's in view once to save resources,
        // as the animations only need to trigger once.
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, options);

    // Start observing the element if the ref is attached.
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup function: unobserve the element when the component unmounts.
    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
}
