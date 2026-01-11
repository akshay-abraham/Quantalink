/**
 * @file src/app/special/page.tsx
 * @description A special page to celebrate holidays, birthdays, and other events.
 *              It checks the current date against a list of events and displays a custom message.
 * @note This is a client component to safely get the current date and handle state.
 */
"use client";

import { useState, useEffect } from 'react';
import { specialEvents, SpecialEvent } from '@/lib/special-events-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FunParticles } from '@/components/easter-egg';
import { Smile } from 'lucide-react';
import PageFooter from '@/components/page-footer';
import { format } from 'date-fns';
import SpecialEventTester from '@/components/special-event-tester';
import { BirthdayCard } from '@/components/special-cards/birthday-card';
import { HomageCard } from '@/components/special-cards/homage-card';
import { HolidayCard } from '@/components/special-cards/holiday-card';
import { PersonalEventCard } from '@/components/special-cards/personal-event-card';

// Note: Metadata cannot be exported from a Client Component.
// This page will inherit its base metadata from the root layout.
// The unique OG tags for this page have been removed to resolve a build error.

const eventCardMap = {
  friendBirthday: BirthdayCard,
  teacherBirthday: BirthdayCard,
  personalBirthday: PersonalEventCard,
  homage: HomageCard,
  halloween: HolidayCard,
  christmas: HolidayCard,
  newYear: HolidayCard,
  holiday: HolidayCard,
  science: HolidayCard,
};


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

  const isBirthday = isClient && activeEvents.some((event: SpecialEvent) => event.isBirthday);

  const defaultMessage = testDate
    ? `There are no special events scheduled for ${format(testDate, 'MMMM do')}.`
    : "There are no special events scheduled for today, but I hope you have a great one anyway!";

  return (
    <>
       {isBirthday && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          <FunParticles type="popper" count={150} />
        </div>
      )}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl space-y-6">
          {isClient && activeEvents.length > 0 ? (
            activeEvents.map((event: SpecialEvent) => {
              const CardComponent = eventCardMap[event.eventType] || HolidayCard;
              return <CardComponent key={event.title} event={event} />;
            })
          ) : (
             isClient && (
              <Card className="bg-card/50 border-border/40 shadow-2xl animate-fade-in-up text-center font-handwriting">
                <div className="relative z-10 p-6">
                  <CardHeader>
                    <div className="flex justify-center items-center gap-4 text-primary">
                        <Smile className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-4xl sm:text-5xl font-bold text-primary tracking-tight pt-4">
                      Have a Wonderful Day!
                    </CardTitle>
                    <CardDescription className="text-foreground/80 text-lg pt-2 font-body">
                      {defaultMessage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/60 font-body">
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
