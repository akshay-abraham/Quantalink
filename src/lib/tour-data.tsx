/**
 * @file /src/lib/tour-data.tsx
 * @description Contains the step-by-step content for the guided tour feature.
 *              This approach separates content from logic, making it easy to update the tour.
 * @note This file must have a `.tsx` extension if you intend to use JSX in the content.
 */

import React from 'react';

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
    title: "Welcome! Let's take a quick tour.",
    content: "Notice the background? It's a real-time particle simulation inspired by quantum physics, running right in your browser.",
    path: '/',
  },
  {
    id: 'profile',
    title: "The Observer",
    content: "This is the profile section. All the social links here are interactive—try hovering over them for a 3D tilt effect.",
    path: '/',
  },
  {
    id: 'game-intro',
    title: "The Main Event: A Quantum Game",
    content: (
      <>
        Scroll down to the bottom to find the <strong>"Quantum Conundrum"</strong>. It's an interactive game where your observation shapes the outcome!
      </>
    ),
    path: '/',
  },
];
