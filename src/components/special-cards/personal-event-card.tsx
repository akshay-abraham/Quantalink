/**
 * @file /src/components/special-cards/personal-event-card.tsx
 * @description A themed card for personal events like close family birthdays.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpecialEvent } from '@/lib/special-events-data';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: SpecialEvent;
}

export const PersonalEventCard = ({ event }: EventCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-purple-500/30 shadow-2xl animate-fade-in-up text-center font-handwriting",
      "transition-all duration-300 ease-out hover:scale-105 hover:shadow-primary/20"
      )}>
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 text-purple-400">
            {event.icon}
          </div>
          <CardTitle className={cn(
            "text-4xl sm:text-5xl font-bold tracking-tight pt-4",
            "animate-ghost-colors" // Use a different glow effect
          )}>
            {event.title}
          </CardTitle>
          {/* Using lighter text for better contrast */}
          <CardDescription className="text-purple-200/90 text-lg pt-2">
             {event.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Using lighter text for better contrast */}
          <p className="text-sm text-purple-300/70">
              - Akshay Abraham
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
