import { describe, expect, it } from "vitest";
import { getTimePhase, isDarkPhase } from "./time-wallpaper";

const localTime = (hour: number, minute = 0) =>
  new Date(2026, 10, 8, hour, minute);

describe("time based Tahoe appearance", () => {
  it("switches at every local time boundary, including midnight", () => {
    expect(getTimePhase(localTime(4, 59))).toBe("night");
    expect(getTimePhase(localTime(5))).toBe("dawn");
    expect(getTimePhase(localTime(8, 59))).toBe("dawn");
    expect(getTimePhase(localTime(9))).toBe("day");
    expect(getTimePhase(localTime(16, 59))).toBe("day");
    expect(getTimePhase(localTime(17))).toBe("dusk");
    expect(getTimePhase(localTime(19, 59))).toBe("dusk");
    expect(getTimePhase(localTime(20))).toBe("night");
    expect(getTimePhase(localTime(0))).toBe("night");
  });

  it("uses dark appearance for dusk and night", () => {
    expect(isDarkPhase("dawn")).toBe(false);
    expect(isDarkPhase("day")).toBe(false);
    expect(isDarkPhase("dusk")).toBe(true);
    expect(isDarkPhase("night")).toBe(true);
  });
});
