/**
 * @file src/components/page-footer.tsx
 * @description A simple footer component that displays the current year.
 * @note This is a client component because it uses the `useEffect` and `useState` hooks
 *       to get the current year on the client-side, avoiding hydration mismatches.
 */
"use client"

import { useState, useEffect } from 'react';

/**
 * PageFooter component displays a copyright notice with the dynamically updated year.
 * @returns {JSX.Element} The footer element.
 */
export default function PageFooter() {
  // State to hold the current year. Initialized to null on the server.
  const [year, setYear] = useState<number | null>(null);

  // useEffect runs only on the client, after the component has mounted.
  // This prevents a hydration mismatch between server-rendered and client-rendered HTML.
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []); // The empty dependency array ensures this runs only once.
  
  return (
    <footer className="w-full text-center p-4 mt-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
      <p className="text-xs text-foreground/50">
        Akshay Abraham &copy; {year || ''}
      </p>
    </footer>
  );
}
