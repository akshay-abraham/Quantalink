import { describe, expect, it } from "vitest";
import { clampToDesktop, getDefaultFrame, resizeFrame } from "./geometry";

const desktop = { width: 1000, height: 800 };
const minSize = { width: 200, height: 150 };
const frame = {
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
};

describe("resizeFrame", () => {
  it("grows from the right edge without moving", () => {
    const next = resizeFrame(frame, "e", { x: 700, y: 0 }, desktop, minSize);
    expect(next).toEqual({
      position: { x: 100, y: 100 },
      size: { width: 600, height: 300 },
    });
  });

  it("keeps the right edge fixed when dragging the left edge", () => {
    const next = resizeFrame(frame, "w", { x: 50, y: 0 }, desktop, minSize);
    expect(next.position.x + next.size.width).toBe(500);
    expect(next.size.width).toBe(450);
  });

  it("never shrinks below the minimum size", () => {
    const next = resizeFrame(frame, "nw", { x: 490, y: 390 }, desktop, minSize);
    expect(next.size).toEqual(minSize);
    expect(next.position).toEqual({ x: 300, y: 250 });
  });

  it("stops at the desktop edge", () => {
    const next = resizeFrame(
      frame,
      "se",
      { x: 5000, y: 5000 },
      desktop,
      minSize
    );
    expect(next.size).toEqual({ width: 900, height: 700 });
  });
});

describe("clampToDesktop", () => {
  it("pulls an off-screen window back into view", () => {
    const next = clampToDesktop(
      { position: { x: 900, y: 700 }, size: { width: 400, height: 300 } },
      desktop
    );
    expect(next.position).toEqual({ x: 600, y: 500 });
  });

  it("shrinks windows larger than the desktop", () => {
    const next = clampToDesktop(
      { position: { x: 0, y: 0 }, size: { width: 2000, height: 2000 } },
      desktop
    );
    expect(next.size).toEqual(desktop);
  });
});

describe("getDefaultFrame", () => {
  it("cascades successive windows", () => {
    const first = getDefaultFrame({ width: 400, height: 300 }, desktop, 0);
    const second = getDefaultFrame({ width: 400, height: 300 }, desktop, 1);
    expect(second.position.x - first.position.x).toBe(22);
    expect(second.position.y - first.position.y).toBe(22);
  });

  it("fits windows on small screens", () => {
    const small = { width: 500, height: 400 };
    const { size } = getDefaultFrame({ width: 900, height: 700 }, small, 0);
    expect(size.width).toBeLessThanOrEqual(small.width);
    expect(size.height).toBeLessThanOrEqual(small.height);
  });
});
