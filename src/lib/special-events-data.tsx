/**
 * @file /src/lib/special-events-data.tsx
 * @description This file contains the data for all special events, holidays, and birthdays.
 *              To add a new event, add a new object or use one of the helper functions
 *              at the bottom of the `specialEvents` array. The date format is 'MM-DD'.
 */

import React from 'react';
import { Cake, Ghost, Sparkles, Sun, Moon, Atom, Flag, Rocket, Heart, GraduationCap } from 'lucide-react';
import { ParticleType } from '@/components/easter-egg';

export type EventType = 
  | 'friendBirthday' 
  | 'teacherBirthday' 
  | 'personalBirthday' 
  | 'homage' 
  | 'halloween' 
  | 'christmas' 
  | 'newYear'
  | 'holiday'
  | 'science';

/**
 * Defines the structure for a single special event object.
 */
export interface SpecialEvent {
  title: string;
  date: string; // Format: 'MM-DD'
  message: React.ReactNode;
  icon: React.ReactNode;
  particleType: ParticleType;
  eventType: EventType;
  /** Optional flag to trigger special birthday animations. */
  isBirthday?: boolean;
  /** Optional flag for a respectful homage. */
  isHomage?: boolean;
}

// --- Helper Functions for Easy Event Creation ---

/**
 * Creates a standard birthday event object for a friend.
 * @param name - The friend's name.
 * @param date - The birthday date in 'MM-DD' format.
 * @param message - A custom message.
 * @returns {SpecialEvent} A fully formed special event object.
 */
const createFriendBirthday = (name: string, date: string, message: string): SpecialEvent => ({
  title: `Happy Birthday, ${name}!`,
  date,
  message,
  icon: <Cake className="h-10 w-10" />,
  particleType: 'popper',
  eventType: 'friendBirthday',
  isBirthday: true,
});

/**
 * Creates a standard birthday event object for a teacher.
 * @param name - The teacher's name.
 * @param date - The birthday date in 'MM-DD' format.
 * @param subject - The subject the teacher taught (e.g., "Physics").
 * @param message - A custom message.
 * @returns {SpecialEvent} A fully formed special event object.
 */
const createTeacherBirthday = (name: string, date: string, subject: string, message: string): SpecialEvent => ({
  title: `Happy Birthday, ${name}!`,
  date,
  message: `${message} Wishing you the happiest of birthdays from your ${subject.toLowerCase()} student!`,
  icon: <GraduationCap className="h-10 w-10" />,
  particleType: 'popper',
  eventType: 'teacherBirthday',
  isBirthday: true,
});


/**
 * An array of special event objects.
 * The /special page will check this list to see if today is a special day.
 */
export const specialEvents: SpecialEvent[] = [
  // --- Birthdays (using helper functions for simplicity) ---
  createFriendBirthday('Ephrim', '11-07', 'Wishing you a fantastic day filled with joy and laughter!'),
  createFriendBirthday('William', '10-31', 'Hope you have a spooky and spectacular day!'),
  createFriendBirthday('Steve', '09-05', 'Happy birthday to a great friend! Have a fantastic day.'),
  createFriendBirthday('Snitha Ann Shinu', '09-11', 'Happy birthday to my dear friend! Wishing you all the best.'),

  // --- Personal & Family Birthdays ---
  {
    title: 'Happy Birthday, Papa!',
    date: '11-22',
    message: "To the person who's behind everything I do—from the craziness to everything else. Thank you for your endless support!",
    icon: <Heart className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'personalBirthday',
    isBirthday: true,
  },
   {
    title: 'Happy Birthday, Akshay!',
    date: '05-09',
    message: 'Happy Birthday to me! Time to celebrate another trip around the sun and all the adventures to come.',
    icon: <Rocket className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'personalBirthday',
    isBirthday: true,
  },
  
  // --- Teacher Birthdays ---
  createTeacherBirthday('Ms. Asha Rose Mathew', '12-10', 'Physics', 'To my class teacher and an extreme supporter of my work.'),
  createTeacherBirthday('Mrs. Neethu', '01-28', 'Physics', 'Wishing a very happy birthday to a wonderful teacher!'),
  createTeacherBirthday('Mrs. Bency Jacob', '02-12', 'Physics', 'To my dearest teacher, thank you for everything.'),
  createTeacherBirthday('Fr. Joseph Noble OIC', '02-11', 'former principal', 'Thank you for your guidance and support.'),

  // --- Special Homage ---
  {
    title: 'In Loving Memory of Shiny Abraham',
    date: '03-01',
    message: 'Remembering my mother today and always. A tribute to her enduring love, light, and the lessons she taught me.',
    icon: <Heart className="h-10 w-10" />,
    particleType: 'revealing',
    eventType: 'homage',
    isHomage: true,
  },

  // --- Holidays ---
  {
    title: 'Happy New Year!',
    date: '01-01',
    message: 'Wishing you a bright and prosperous New Year! May it be filled with new adventures and good fortune.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'newYear',
  },
  {
    title: 'Happy Halloween!',
    date: '10-31',
    message: 'Wishing you a spooky and fun Halloween!',
    icon: <Ghost className="h-10 w-10" />,
    particleType: 'ghost',
    eventType: 'halloween',
  },
  {
    title: 'Merry Christmas!',
    date: '12-25',
    message: 'Wishing you and your loved ones a Merry Christmas filled with peace, joy, and happiness.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'revealing',
    eventType: 'christmas',
  },
  {
    title: 'Happy Republic Day, India!',
    date: '01-26',
    message: 'Celebrating the spirit of unity and democracy. Jai Hind!',
    icon: <Flag className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'holiday',
  },
   {
    title: 'Happy Independence Day, India!',
    date: '08-15',
    message: 'Remembering our past and celebrating a future of progress. Jai Hind!',
    icon: <Flag className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'holiday',
  },
  {
    title: 'Happy Onam!',
    date: '09-15', // 2024 date
    message: 'May the colors and joy of Onam fill your home with happiness and prosperity.',
    icon: <Sun className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'holiday',
  },
  {
    title: 'Happy Vishu!',
    date: '04-14', // 2024 date
    message: 'Wishing you a golden year ahead. Happy Vishu!',
    icon: <Sun className="h-10 w-10" />,
    particleType: 'revealing',
    eventType: 'holiday',
  },
  {
    title: 'Happy Deepavali!',
    date: '11-01', // 2024 date
    message: 'May the festival of lights bring brightness, joy, and prosperity to your life.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'anomaly',
    eventType: 'holiday',
  },
  {
    title: 'Eid Mubarak!',
    date: '04-09', // 2024 Approx. date for Eid ul-Fitr
    message: 'May this special day bring peace, happiness, and prosperity to everyone.',
    icon: <Moon className="h-10 w-10" />,
    particleType: 'revealing',
    eventType: 'holiday',
  },
  {
    title: 'Happy Easter!',
    date: '03-31', // 2024 date
    message: 'Wishing you a joyful Easter filled with hope, love, and new beginnings.',
    icon: <Sparkles className="h-10 w-10" />,
    particleType: 'popper',
    eventType: 'holiday',
  },

  // --- Notable Figures ---
   {
    title: 'Happy Birthday, Albert Einstein!',
    date: '03-14',
    message: 'Celebrating the mind that reshaped our understanding of the universe. "Imagination is more important than knowledge."',
    icon: <Atom className="h-10 w-10" />,
    particleType: 'anomaly',
    eventType: 'science',
  },
  {
    title: 'Happy Birthday, Richard Feynman!',
    date: '05-11',
    message: 'Honoring the curious spirit of a brilliant physicist and teacher. "The first principle is that you must not fool yourself."',
    icon: <Rocket className="h-10 w-10" />,
    particleType: 'anomaly',
    eventType: 'science',
  },
];
