/**
 * @file /src/components/special-event-tester.tsx
 * @description A client component that provides a discrete popover calendar to test special events.
 */
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { specialEvents } from '@/lib/special-events-data.tsx';

interface SpecialEventTesterProps {
  onTestEvent: (date: Date | undefined) => void;
}

/**
 * A discrete, developer-focused tool to test special events using a calendar popover.
 * @param {SpecialEventTesterProps} props - The component props.
 * @returns {JSX.Element} A small button that opens a calendar for testing.
 */
export default function SpecialEventTester({ onTestEvent }: SpecialEventTesterProps) {
  const [date, setDate] = useState<Date | undefined>();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onTestEvent(selectedDate);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            size={'icon'}
            className={cn(
              'h-10 w-10 rounded-full bg-card/70 backdrop-blur-md border-border/60 shadow-lg hover:scale-110 transition-transform p-2',
              !date && 'text-muted-foreground'
            )}
            title="Test a specific date"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="sr-only">Pick a date to test</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
