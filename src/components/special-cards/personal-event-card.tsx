/**
 * @file /src/components/special-cards/personal-event-card.tsx
 * @description A themed card for personal events like close family birthdays.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FunParticles } from '@/components/easter-egg';
import { SpecialEvent } from '@/lib/special-events-data';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: SpecialEvent;
}

export const PersonalEventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-purple-500/30 shadow-2xl animate-fade-in-up text-center">
      <div className="absolute inset-0 pointer-events-none">
        <FunParticles type={event.particleType} count={150} />
      </div>
      
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 text-purple-400">
            {event.icon}
          </div>
          <CardTitle className={cn(
            "text-3xl sm:text-4xl font-bold tracking-tight pt-4",
            "animate-ghost-colors" // Use a different glow effect
          )}>
            {event.title}
          </CardTitle>
          <CardDescription className="text-purple-200/80 text-base pt-2">
             {event.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-purple-300/60">
              - Akshay Abraham
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
