/**
 * @file /src/components/special-cards/homage-card.tsx
 * @description A serene, respectful card for remembrance.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpecialEvent } from '@/lib/special-events-data';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: SpecialEvent;
}

export const HomageCard = ({ event }: EventCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-card/50 border-gray-400/30 shadow-2xl animate-fade-in-up text-center font-handwriting",
      "transition-all duration-300 ease-out hover:scale-105 hover:shadow-primary/20"
      )}>
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 text-gray-300">
            {event.icon}
          </div>
          <CardTitle className="text-4xl sm:text-5xl font-bold tracking-tight pt-4 text-gray-200">
            {event.title}
          </CardTitle>
          <CardDescription className="text-gray-300/80 text-lg pt-2 max-w-prose mx-auto">
             {event.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400/80">
              - With Love
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
