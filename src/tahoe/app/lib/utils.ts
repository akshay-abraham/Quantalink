import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { fontSizeKeys, layers } from "./design-tokens";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: fontSizeKeys }],
      z: [{ z: Object.keys(layers) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function monthsBetween(start: Date, end: Date = new Date()) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}

export function formatDuration(start: Date, end?: Date) {
  const months = monthsBetween(start, end);
  const years = Math.floor(months / 12);
  const remaining = months % 12;

  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (remaining)
    parts.push(`${remaining} ${remaining === 1 ? "month" : "months"}`);
  return parts.join(" ") || "1 month";
}

export function formatMonth(date?: Date) {
  if (!date) return "Present";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function yearsOfExperience(start: Date) {
  return Math.floor(monthsBetween(start) / 12);
}
