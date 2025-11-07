/**
 * @file src/app/special/page.tsx
 * @description A special page to celebrate holidays, birthdays, and other events.
 *              It checks the current date against a list of events and displays a custom message.
 * @note This is a client component to safely get the current date and handle state.
 */
"use client";

import { useState, useEffect } from 'react';
import { specialEvents, SpecialEvent } from '@/lib/special-events-data.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FunParticles, ParticleType } from '@/components/easter-egg';
import AnimatedBackground from '@/components/animated-background';
import { Smile } from 'lucide-react';
import PageFooter from '@/components/page-footer';
import { format } from 'date-fns';
import SpecialEventTester from '@/components/special-event-tester';

/**
 * SpecialPage component displays a personalized greeting if the current date
 * matches an entry in the special events data file.
 * @returns {JSX.Element} The rendered special events page.
 */
export default function SpecialPage() {
  const [activeEvent, setActiveEvent] = useState<SpecialEvent | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [testDate, setTestDate] = useState<Date | undefined>();

  useEffect(() => {
    // This effect runs only on the client, ensuring `new Date()` is safe.
    setIsClient(true);
    
    // Use the test date if available, otherwise use the real current date.
    const dateTo_check = testDate || new Date();
    const formattedDate = format(dateTo_check, 'MM-dd');
    
    // Find if there's an event for the checked date.
    const eventForDate = specialEvents.find(e => e.date === formattedDate);
    
    setActiveEvent(eventForDate || null);
  }, [testDate]);
  
  // This function is passed to the tester component to update the displayed event.
  const handleTestEvent = (date: Date | undefined) => {
    setTestDate(date);
  };

  const currentEvent = activeEvent;
  const particleType: ParticleType = currentEvent?.particleType || 'revealing';

  const defaultMessage = testDate
    ? `There are no special events scheduled for ${format(testDate, 'MMMM do')}.`
    : "There are no special events scheduled for today, but I hope you have a great one anyway!";

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <Card className="relative overflow-hidden bg-card/50 border-border/40 shadow-2xl animate-fade-in-up text-center">
            {/* Render particle effects if it's a special day */}
            {currentEvent && (
              <div className="absolute inset-0">
                <FunParticles type={particleType} count={150} />
              </div>
            )}
            
            <div className="relative z-10 p-6">
              <CardHeader>
                <div className="flex justify-center items-center gap-4 text-primary">
                    {isClient && (currentEvent ? currentEvent.icon : <Smile className="h-10 w-10" />)}
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-primary tracking-tight pt-4">
                  {isClient && (currentEvent ? currentEvent.title : "Have a Wonderful Day!")}
                </CardTitle>
                <CardDescription className="text-foreground/80 text-base pt-2">
                   {isClient && (currentEvent ? currentEvent.message : defaultMessage)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground/60">
                    - Akshay Abraham
                </p>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* The event tester component is now just a discrete button. */}
        {isClient && <SpecialEventTester onTestEvent={handleTestEvent} />}

        <div className="w-full max-w-4xl flex-grow" />
        <PageFooter />
      </div>
    </>
  );
}
