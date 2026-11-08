import { describe, expect, it } from "vitest";
import {
  defaultMobileOrder,
  moveMobileIcon,
  normalizeMobileOrder,
} from "./icon-order";

describe("mobile icon order", () => {
  it("recovers missing apps and discards stale or repeated entries", () => {
    expect(
      normalizeMobileOrder(["notes", "notes", "removed", "safari"])
    ).toEqual([
      "notes",
      "safari",
      ...defaultMobileOrder.filter((id) => id !== "notes" && id !== "safari"),
    ]);
  });

  it("moves icons between the grid and dock without losing an app", () => {
    const next = moveMobileIcon(defaultMobileOrder, "about", "notes");
    expect(next).toHaveLength(defaultMobileOrder.length);
    expect(next.indexOf("about")).toBe(next.indexOf("notes") + 1);
    expect(moveMobileIcon(next, "notes", "preview")[0]).toBe("notes");
    expect(defaultMobileOrder[0]).toBe("about");
  });
});
