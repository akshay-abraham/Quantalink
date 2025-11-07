/**
 * @file /src/components/special-cards/birthday-card.tsx
 * @description A themed card for friend and teacher birthdays.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpecialEvent } from '@/lib/special-events-data';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: SpecialEvent;
}

export const BirthdayCard = ({ event }: EventCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-card/50 border-blue-500/30 shadow-2xl animate-fade-in-up text-center font-handwriting",
      "transition-all duration-300 ease-out hover:scale-105 hover:shadow-primary/20"
    )}>
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 text-blue-400">
            {event.icon}
          </div>
          <CardTitle className={cn(
            "text-4xl sm:text-5xl font-bold tracking-tight pt-4",
            "animate-cat-colors" // Name glow effect
          )}>
            {event.title}
          </CardTitle>
          <CardDescription className="text-foreground/80 text-lg pt-2">
             {event.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/60">
              - Akshay Abraham
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
