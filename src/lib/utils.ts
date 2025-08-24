/**
 * @file src/lib/utils.ts
 * @description A utility file for helper functions. Currently, it only contains `cn`,
 *              a function for conditionally joining Tailwind CSS class names.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge Tailwind CSS classes safely and conditionally.
 * It combines the functionality of `clsx` (for conditional classes) and `tailwind-merge`
 * (to resolve conflicting Tailwind classes).
 * @param {...ClassValue[]} inputs - A list of class names or conditional class objects.
 * @returns {string} The final, merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
