export function parseYearMonth(value: string): Date;
export function parseYearMonth(value?: string): Date | undefined;
export function parseYearMonth(value?: string) {
  if (!value) return undefined;
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1);
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Locale-independent label, so server and browser always agree. */
export function formatMonthLabel(value: string) {
  const date = parseYearMonth(value);
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatYearMonthRange(start: string, end?: string) {
  return `${formatMonthLabel(start)} — ${end ? formatMonthLabel(end) : "Present"}`;
}
