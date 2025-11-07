/**
 * @file /src/lib/special-events-data.ts
 * @description This file contains the data for all special events, holidays, and birthdays.
 *              To add a new event, add a new object to the `specialEvents` array.
 *              The date format should be 'MM-DD'.
 */

import React from 'react';
import { Cake, Star, Sparkles, Sun, Moon, Atom, Hand, Flag, Rocket } from 'lucide-react';
import { ParticleType } from '@/components/easter-egg';

/**
 * Defines the structure for a single special event object.
 */
export interface SpecialEvent {
  title: string;
  date: string; // Format: 'MM-DD'
  message: string;
  icon: React.ReactNode;
  particleType: ParticleType;
}

/**
 * An array of special event objects.
 * The /special page will check this list to see if today is a special day.
 */
export const specialEvents: SpecialEvent[] = [
  // --- Birthdays ---
  {
    title: 'Happy Birthday, Ephrim!',
    date: '11-07',
    message: 'Wishing you a fantastic day filled with joy and laughter. Happy Birthday!',
    icon: <Cake className="h-10 w-10" />,
    particleType: 'popper',
  },
  {
    title: 'Happy Birthday, William!',
    date: '10-31',
    message: 'Happy Birthday! Hope you have a spooky and spectacular day.',
    icon: <Cake className="h-10 w-10" />,
    particleType: 'ghost',
  },
   {
    title: 'Happy Birthday, Akshay!',
    date: '05-09',
    message: 'Happy Birthday to me! Time to celebrate another trip around the sun.',
    icon: <Cake className="h-10 w-10" />,
    particleType: 'popper',
  },

  // --- Fixed Holidays ---
  {
    title: 'Happy New Year!',
    date: '01-01',
    message: 'Wishing you a bright and prosperous New Year! May it be filled with new adventures and good fortune.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'popper',
  },
  {
    title: 'Merry Christmas!',
    date: '12-25',
    message: 'Wishing you and your loved ones a Merry Christmas filled with peace, joy, and happiness.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'revealing',
  },
  {
    title: 'Happy Republic Day, India!',
    date: '01-26',
    message: 'Celebrating the spirit of unity and democracy. Jai Hind!',
    icon: <Flag className="h-10 w-10" />,
    particleType: 'popper',
  },
   {
    title: 'Happy Independence Day, India!',
    date: '08-15',
    message: 'Remembering our past and celebrating a future of progress. Jai Hind!',
    icon: <Flag className="h-10 w-10" />,
    particleType: 'popper',
  },

  // --- Dynamic Holidays (Hardcoded for 2024) ---
  // Note: A robust solution would use a library or API to calculate these dates annually.
  {
    title: 'Happy Onam!',
    date: '09-15', // 2024 date
    message: 'May the colors and joy of Onam fill your home with happiness and prosperity.',
    icon: <Sun className="h-10 w-10" />,
    particleType: 'popper',
  },
  {
    title: 'Happy Vishu!',
    date: '04-14', // 2024 date
    message: 'Wishing you a golden year ahead. Happy Vishu!',
    icon: <Sun className="h-10 w-10" />,
    particleType: 'revealing',
  },
  {
    title: 'Happy Deepavali!',
    date: '11-01', // 2024 date
    message: 'May the festival of lights bring brightness, joy, and prosperity to your life.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'anomaly',
  },
  {
    title: 'Eid Mubarak!',
    date: '04-09', // 2024 Approx. date for Eid ul-Fitr
    message: 'May this special day bring peace, happiness, and prosperity to everyone.',
    icon: <Moon className="h-10 w-10" />,
    particleType: 'revealing',
  },
  {
    title: 'Happy Easter!',
    date: '03-31', // 2024 date
    message: 'Wishing you a joyful Easter filled with hope, love, and new beginnings.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'popper',
  },

  // --- Notable Figures ---
   {
    title: 'Happy Birthday, Albert Einstein!',
    date: '03-14',
    message: 'Celebrating the mind that reshaped our understanding of the universe. "Imagination is more important than knowledge."',
    icon: <Atom className="h-10 w-10" />,
    particleType: 'anomaly',
  },
  {
    title: 'Happy Birthday, Richard Feynman!',
    date: '05-11',
    message: 'Honoring the curious spirit of a brilliant physicist and teacher. "The first principle is that you must not fool yourself."',
    icon: <Rocket className="h-10 w-10" />,
    particleType: 'anomaly',
  },
];
