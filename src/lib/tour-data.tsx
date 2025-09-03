/**
 * @file /src/lib/tour-data.tsx
 * @description Contains the step-by-step content for the advanced guided tour.
 *              This data-driven approach makes the tour's logic and content easy to manage.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export interface TourStep {
  /** A unique identifier for the step's content. */
  id: string;
  /** The title displayed at the top of the tour pop-up. */
  title: string;
  /** The main explanatory text for the tour step. */
  content: React.ReactNode;
  /** Optional: Milliseconds to wait before automatically advancing to the next step. */
  autoAdvanceAfter?: number;
  /** Optional: Specifies an action the tour should take. */
  action?: {
    type: 'scroll_to';
    label: string;
    elementId: string;
    pointTo: string; // The ID of the button to highlight.
    path?: string;
  };
  /** Optional: Specifies what user interaction the tour should wait for. */
  awaits?: 'click' | 'path_change';
}


export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: "Hi there!",
    content: "I'm your guide. Let's take a quick tour...",
    autoAdvanceAfter: 2000,
  },
  {
    id: 'background',
    title: "A Living Background",
    content: "This isn't just a static image. It's a real-time particle simulation inspired by quantum physics, running right in your browser.",
    autoAdvanceAfter: 4000,
  },
  {
    id: 'game-prompt',
    title: "Ready for an Experiment?",
    content: "The centerpiece of this portfolio is a game inspired by Schrödinger's Cat. Want to try it?",
    action: {
      type: 'scroll_to',
      label: 'Yes, show me!',
      elementId: 'quantum-conundrum-section',
      pointTo: 'begin-experiment-button',
    },
    awaits: 'click'
  },
  {
    id: 'skills-prompt',
    title: "While you play...",
    content: "The tech behind this site is just as interesting! When you're ready, let's explore the skills that made it possible.",
    action: {
        type: 'scroll_to',
        label: 'Show me the skills!',
        elementId: 'skills-section',
        pointTo: 'see-all-skills-button',
        path: '/skills'
    },
    awaits: 'path_change',
  },
  {
    id: 'outro',
    title: "Thanks for Visiting!",
    content: (
      <>
        <p className="mb-4">Feel free to explore the rest of the site. If you're curious about the code or have ideas for improvement, the entire project is open source.</p>
        <a href="https://github.com/akshay-abraham/Quantalink" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </a>
      </>
    ),
  }
];
