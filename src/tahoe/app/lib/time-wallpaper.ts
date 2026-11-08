export type TimePhase = "dawn" | "day" | "dusk" | "night";

/** Uses the visitor's local clock; no location or network request is needed. */
export const getTimePhase = (date: Date): TimePhase => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
};

export const isDarkPhase = (phase: TimePhase) =>
  phase === "dusk" || phase === "night";
