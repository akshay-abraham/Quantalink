import { describe, expect, it } from "vitest";
import { intersects, toMarquee } from "./use-marquee-selection";

const rect = (left: number, top: number, size = 10) =>
  ({ left, top, right: left + size, bottom: top + size }) as DOMRect;

describe("marquee selection", () => {
  it("normalizes drags in any direction", () => {
    expect(toMarquee({ x: 50, y: 50 }, { x: 10, y: 20 })).toEqual({
      left: 10,
      top: 20,
      width: 40,
      height: 30,
    });
  });

  it("selects items the marquee touches", () => {
    const marquee = toMarquee({ x: 0, y: 0 }, { x: 20, y: 20 });
    expect(intersects(marquee, rect(15, 15))).toBe(true);
    expect(intersects(marquee, rect(30, 30))).toBe(false);
  });
});
