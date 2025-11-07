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
import { FunParticles } from '@/components/easter-egg';
import AnimatedBackground from '@/components/animated-background';
import { Smile } from 'lucide-react';
import PageFooter from '@/components/page-footer';
import { format } from 'date-fns';
import SpecialEventTester from '@/components/special-event-tester';
import { cn } from '@/lib/utils';

/**
 * SpecialPage component displays a personalized greeting if the current date
 * matches an entry in the special events data file.
 * @returns {JSX.Element} The rendered special events page.
 */
export default function SpecialPage() {
  const [activeEvents, setActiveEvents] = useState<SpecialEvent[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [testDate, setTestDate] = useState<Date | undefined>();

  useEffect(() => {
    // This effect runs only on the client, ensuring `new Date()` is safe.
    setIsClient(true);
    
    // Use the test date if available, otherwise use the real current date.
    const dateToCheck = testDate || new Date();
    const formattedDate = format(dateToCheck, 'MM-dd');
    
    // Find if there are any events for the checked date.
    const eventsForDate = specialEvents.filter(e => e.date === formattedDate);
    
    setActiveEvents(eventsForDate);
  }, [testDate]);
  
  // This function is passed to the tester component to update the displayed event.
  const handleTestEvent = (date: Date | undefined) => {
    setTestDate(date);
  };

  const isBirthday = isClient && activeEvents.some(event => event.isBirthday);
  const isHomage = isClient && activeEvents.some(event => event.isHomage);

  const defaultMessage = testDate
    ? `There are no special events scheduled for ${format(testDate, 'MMMM do')}.`
    : "There are no special events scheduled for today, but I hope you have a great one anyway!";

  return (
    <>
      <AnimatedBackground />
       {isBirthday && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          <FunParticles type="popper" count={200} />
        </div>
      )}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl space-y-6">
          {isClient && activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <Card key={event.title} className="relative overflow-hidden bg-card/50 border-border/40 shadow-2xl animate-fade-in-up text-center">
                <div className="absolute inset-0 pointer-events-none">
                  {/* For homage, use a more serene particle effect */}
                  <FunParticles type={isHomage ? 'revealing' : event.particleType} count={150} />
                </div>
                
                <div className="relative z-10 p-6">
                  <CardHeader>
                    <div className="flex justify-center items-center gap-4 text-primary">
                      {event.icon}
                    </div>
                    <CardTitle className={cn(
                      "text-3xl sm:text-4xl font-bold tracking-tight pt-4",
                      // Apply glowing animation for all events except homage
                      !isHomage && "animate-cat-colors"
                    )}>
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-foreground/80 text-base pt-2">
                       {event.message}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-foreground/60">
                        - Akshay Abraham
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
             isClient && (
              <Card className="bg-card/50 border-border/40 shadow-2xl animate-fade-in-up text-center">
                <div className="relative z-10 p-6">
                  <CardHeader>
                    <div className="flex justify-center items-center gap-4 text-primary">
                        <Smile className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-3xl sm:text-4xl font-bold text-primary tracking-tight pt-4">
                      Have a Wonderful Day!
                    </CardTitle>
                    <CardDescription className="text-foreground/80 text-base pt-2">
                      {defaultMessage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-foreground/60">
                        - Akshay Abraham
                    </p>
                  </CardContent>
                </div>
              </Card>
            )
          )}
        </div>

        {isClient && <SpecialEventTester onTestEvent={handleTestEvent} />}

        <div className="w-full max-w-4xl flex-grow" />
        <PageFooter />
      </div>
    </>
  );
}
