/**
 * @file /src/lib/tour-data.tsx
 * @description Contains the step-by-step content for the guided tour feature.
 *              This approach separates content from logic, making it easy to update the tour.
 * @note This file must have a `.tsx` extension if you intend to use JSX in the content.
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export interface TourStep {
  /** A unique identifier for the step's content. */
  id: string;
  /** The title displayed at the top of the tour pop-up. */
  title: string;
  /** The main explanatory text for the tour step. */
  content: React.ReactNode;
  /** The path on which this step should appear. 'all' means it appears on any page. */
  path: 'all' | '/' | '/about' | '/skills' | '/projects';
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: "Welcome to Quantalink!",
    content: "This isn't just a portfolio; it's a thought experiment. Notice the background? It's a real-time particle simulation inspired by quantum physics, running right in your browser.",
    path: '/',
  },
  {
    id: 'observer-effect',
    title: "The Observer Effect",
    content: "In quantum mechanics, observing a system changes it. Here, your cursor is the observer. Try hovering over the social media links below—your presence will give them a 3D tilt.",
    path: '/',
  },
  {
    id: 'skills-page',
    title: "Navigating the Site",
    content: "Use the menu in the top-right to navigate. Why not check out the Skills & Technologies page next? It features dynamic, infinitely scrolling logo banners.",
    path: '/skills',
  },
  {
    id: 'game-intro',
    title: "The Main Event",
    content: (
      <>
        Now, for the centerpiece. Scroll to the bottom of the homepage to find the <strong>"Quantum Conundrum"</strong>. It's a game inspired by Schrödinger's Cat where your actions determine the outcome.
      </>
    ),
    path: '/',
  },
  {
    id: 'game-outcome',
    title: "A Persistent Outcome",
    content: "Winning or losing the game has consequences. A friendly cat or a spooky ghost will spawn and follow you across the entire site until you play again. Your observation creates a persistent reality.",
    path: '/',
  },
   {
    id: 'code',
    title: "Explore the Code",
    content: (
      <>
        <p>Curious how this was all built? This entire portfolio is open source. You can explore the code, including the game logic and animation engine, on GitHub.</p>
        <a href="https://github.com/akshay-abraham/Quantalink" target="_blank" rel="noopener noreferrer" className="mt-4 block">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </a>
      </>
    ),
    path: 'all',
  },
];
