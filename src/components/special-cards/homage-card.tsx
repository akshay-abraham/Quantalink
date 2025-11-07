/**
 * @file /src/components/special-cards/homage-card.tsx
 * @description A serene, respectful card for remembrance.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FunParticles } from '@/components/easter-egg';
import { SpecialEvent } from '@/lib/special-events-data';

interface EventCardProps {
  event: SpecialEvent;
}

export const HomageCard = ({ event }: EventCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-card/50 border-gray-400/30 shadow-2xl animate-fade-in-up text-center">
      <div className="absolute inset-0 pointer-events-none">
        <FunParticles type={event.particleType} count={150} />
      </div>
      
      <div className="relative z-10 p-6">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 text-gray-300">
            {event.icon}
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight pt-4 text-gray-200">
            {event.title}
          </CardTitle>
          <CardDescription className="text-gray-300/80 text-base pt-2 max-w-prose mx-auto">
             {event.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-400/80">
              - With Love
          </p>
        </CardContent>
      </div>
    </Card>
  );
};
