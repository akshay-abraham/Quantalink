/**
 * @file src/app/birthday/page.tsx
 * @description A special page to celebrate birthdays.
 *              It checks the current date against a list of birthdays and displays a custom message.
 * @note This is a client component to safely get the current date in the user's browser.
 */
"use client";

import { useState, useEffect } from 'react';
import { birthdays, Birthday } from '@/lib/birthdays-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FunParticles } from '@/components/easter-egg';
import AnimatedBackground from '@/components/animated-background';
import { Cake, Smile } from 'lucide-react';
import PageFooter from '@/components/page-footer';
import { format } from 'date-fns';

/**
 * BirthdayPage component displays a personalized birthday greeting if the current date
 * matches an entry in the birthdays data file.
 * @returns {JSX.Element} The rendered birthday page.
 */
export default function BirthdayPage() {
  const [todaysBirthday, setTodaysBirthday] = useState<Birthday | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, ensuring `new Date()` is safe.
    setIsClient(true);
    
    // Get today's date in the 'MM-DD' format.
    const today = new Date();
    const formattedDate = format(today, 'MM-dd');
    
    // Find if there's a birthday entry for today.
    const birthdayPerson = birthdays.find(b => b.date === formattedDate);
    
    setTodaysBirthday(birthdayPerson || null);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <Card className="relative overflow-hidden bg-card/50 border-border/40 shadow-2xl animate-fade-in-up text-center">
            {/* Render particle effects if it's someone's birthday */}
            {todaysBirthday && (
              <div className="absolute inset-0">
                <FunParticles type="popper" count={150} />
              </div>
            )}
            
            <div className="relative z-10 p-6">
              <CardHeader>
                <div className="flex justify-center items-center gap-4 text-primary">
                    {todaysBirthday ? <Cake className="h-10 w-10" /> : <Smile className="h-10 w-10" />}
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-primary tracking-tight pt-4">
                  {isClient && (todaysBirthday ? `Happy Birthday, ${todaysBirthday.name}!` : "Have a Wonderful Day!")}
                </CardTitle>
                <CardDescription className="text-foreground/80 text-base pt-2">
                   {isClient && (todaysBirthday ? todaysBirthday.message : "There are no birthdays scheduled for today, but I hope you have a great one anyway!")}
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
        <div className="w-full max-w-4xl flex-grow" />
        <PageFooter />
      </div>
    </>
  );
}
