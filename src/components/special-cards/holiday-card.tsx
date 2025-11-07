/**
 * @file /src/components/special-cards/holiday-card.tsx
 * @description A themed card for various holidays.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SpecialEvent } from '@/lib/special-events-data';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: SpecialEvent;
}

const holidayStyles: { [key: string]: { border: string; iconColor: string; } } = {
  halloween: { border: 'border-orange-500/40', iconColor: 'text-orange-500' },
  christmas: { border: 'border-red-500/40', iconColor: 'text-red-500' },
  newYear: { border: 'border-yellow-400/40', iconColor: 'text-yellow-400' },
  default: { border: 'border-green-500/40', iconColor: 'text-green-500' },
};

export const HolidayCard = ({ event }: EventCardProps) => {
  const styles = holidayStyles[event.eventType] || holidayStyles.default;

  return (
    <Card className={cn(
      "relative overflow-hidden bg-card/50 shadow-2xl animate-fade-in-up text-center font-handwriting",
      styles.border,
      "transition-all duration-300 ease-out hover:scale-105 hover:shadow-primary/20"
    )}>
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className={cn("flex justify-center items-center gap-4", styles.iconColor)}>
            {event.icon}
          </div>
          <CardTitle className={cn(
            "text-4xl sm:text-5xl font-bold tracking-tight pt-4",
            "animate-cat-colors"
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
