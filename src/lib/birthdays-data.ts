/**
 * @file /src/lib/birthdays-data.ts
 * @description This file contains the data for all birthdays.
 *              To add a new birthday, simply add a new object to the `birthdays` array.
 *              The date format should be 'MM-DD' (e.g., '11-07' for November 7th).
 */

/**
 * Defines the structure for a single birthday object.
 */
export interface Birthday {
  name: string;
  date: string; // Format: 'MM-DD'
  message: string;
}

/**
 * An array of birthday objects.
 * The /birthday page will check this list to see if today is someone's birthday.
 */
export const birthdays: Birthday[] = [
  {
    name: 'Ephrim',
    date: '11-07',
    message: 'Wishing you a fantastic day filled with joy and laughter. Happy Birthday!',
  },
  {
    name: 'William',
    date: '10-31',
    message: 'Happy Birthday! Hope you have a spooky and spectacular day.',
  },
  // To add another birthday, copy the object structure below:
  // {
  //   name: 'Friend\'s Name',
  //   date: 'MM-DD', // e.g., '01-23' for January 23rd
  //   message: 'Your custom birthday message here!',
  // },
];
