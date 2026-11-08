import { describe, expect, it } from "vitest";
import { getMagnifiedSize } from "./magnification";
import {
  DOCK_ICON_SIZE,
  DOCK_MAGNIFIED_SIZE,
  DOCK_MAGNIFY_RANGE,
} from "../../lib/constants";

describe("getMagnifiedSize", () => {
  it("is largest directly under the pointer", () => {
    expect(getMagnifiedSize(0)).toBe(DOCK_MAGNIFIED_SIZE);
  });

  it("falls off symmetrically and smoothly", () => {
    expect(getMagnifiedSize(50)).toBeCloseTo(getMagnifiedSize(-50));
    expect(getMagnifiedSize(50)).toBeGreaterThan(getMagnifiedSize(100));
  });

  it("returns to the resting size outside the range", () => {
    expect(getMagnifiedSize(DOCK_MAGNIFY_RANGE + 1)).toBe(DOCK_ICON_SIZE);
    expect(getMagnifiedSize(Infinity)).toBe(DOCK_ICON_SIZE);
  });
});
