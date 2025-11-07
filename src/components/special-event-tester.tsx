/**
 * @file /src/components/special-event-tester.tsx
 * @description A client component that provides a dropdown to test different special events.
 */
'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specialEvents } from "@/lib/special-events-data";

interface SpecialEventTesterProps {
  onTestEvent: (eventName: string) => void;
}

/**
 * SpecialEventTester allows users to preview any event from the data file.
 * @param {SpecialEventTesterProps} props - The component props.
 * @returns {JSX.Element} A select dropdown for testing events.
 */
export default function SpecialEventTester({ onTestEvent }: SpecialEventTesterProps) {
  return (
    <div className="w-full max-w-xs mx-auto mt-8">
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
            <CardTitle className="text-base text-primary text-center">Event Tester</CardTitle>
        </CardHeader>
        <CardContent>
            <Select onValueChange={(value) => onTestEvent(value)}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an event to test" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectLabel>Events</SelectLabel>
                    {specialEvents.map((event) => (
                    <SelectItem key={event.title} value={event.title}>
                        {event.title} ({event.date})
                    </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>
        </CardContent>
      </Card>
    </div>
  );
}

// These imports are needed inside the tester component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
