import { describe, expect, it } from "vitest";
import { cn, formatDuration, monthsBetween, yearsOfExperience } from "./utils";

describe("dates", () => {
  it("counts whole months between dates", () => {
    expect(monthsBetween(new Date(2023, 5), new Date(2024, 8))).toBe(15);
  });

  it("formats durations like a CV", () => {
    expect(formatDuration(new Date(2023, 5), new Date(2024, 8))).toBe(
      "1 year 3 months"
    );
    expect(formatDuration(new Date(2024, 0), new Date(2026, 0))).toBe(
      "2 years"
    );
    expect(formatDuration(new Date(2024, 0), new Date(2024, 0))).toBe(
      "1 month"
    );
  });

  it("rounds years of experience down", () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 30);
    expect(yearsOfExperience(start)).toBe(2);
  });
});

describe("cn", () => {
  it("keeps custom font sizes alongside text colors", () => {
    expect(cn("text-13", "text-white")).toBe("text-13 text-white");
  });

  it("lets later font sizes and layers win", () => {
    expect(cn("text-13", "text-15")).toBe("text-15");
    expect(cn("z-windows", "z-fullscreen")).toBe("z-fullscreen");
  });
});
