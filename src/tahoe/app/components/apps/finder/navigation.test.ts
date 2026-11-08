import { describe, expect, it } from "vitest";
import { getNextSelectionIndex } from "./navigation";

describe("getNextSelectionIndex", () => {
  it("selects the first item when nothing is selected", () => {
    expect(getNextSelectionIndex("ArrowDown", -1, 5, 3, "grid")).toBe(0);
  });

  it("moves by a whole row in grid view", () => {
    expect(getNextSelectionIndex("ArrowDown", 1, 10, 4, "grid")).toBe(5);
    expect(getNextSelectionIndex("ArrowUp", 5, 10, 4, "grid")).toBe(1);
  });

  it("ignores left and right in list view", () => {
    expect(getNextSelectionIndex("ArrowRight", 2, 10, 1, "list")).toBe(2);
  });

  it("clamps at the ends", () => {
    expect(getNextSelectionIndex("ArrowDown", 8, 10, 4, "grid")).toBe(9);
    expect(getNextSelectionIndex("ArrowLeft", 0, 10, 4, "grid")).toBe(0);
  });

  it("returns null for other keys or empty folders", () => {
    expect(getNextSelectionIndex("a", 0, 10, 4, "grid")).toBeNull();
    expect(getNextSelectionIndex("ArrowDown", -1, 0, 4, "grid")).toBeNull();
  });
});
