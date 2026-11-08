import {
  DOCK_RESERVED_HEIGHT,
  MENUBAR_HEIGHT,
  MOBILE_BREAKPOINT,
} from "../../lib/constants";

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Frame {
  size: Size;
  position: Point;
}

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export const RESIZE_DIRECTIONS: ResizeDirection[] = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
];

export const getDesktopSize = (): Size => ({
  width: window.innerWidth,
  height: window.innerHeight - MENUBAR_HEIGHT,
});

const getDockSpace = () =>
  window.innerWidth >= MOBILE_BREAKPOINT ? DOCK_RESERVED_HEIGHT : 0;

export const getZoomFrame = (): Frame => ({
  position: { x: 0, y: 0 },
  size: {
    width: window.innerWidth,
    height: window.innerHeight - MENUBAR_HEIGHT - getDockSpace(),
  },
});

export const getFullscreenFrame = (): Frame => ({
  position: { x: 0, y: -MENUBAR_HEIGHT },
  size: { width: window.innerWidth, height: window.innerHeight },
});

export const getDefaultFrame = (
  preferred: Size,
  desktop: Size,
  cascadeIndex: number
): Frame => {
  const dockSpace = DOCK_RESERVED_HEIGHT;
  const width = Math.min(preferred.width, desktop.width - 40);
  const height = Math.min(preferred.height, desktop.height - dockSpace - 24);
  const offset = (cascadeIndex % 6) * 22;

  return {
    size: { width, height },
    position: {
      x: Math.max(0, (desktop.width - width) / 2 - 80 + offset),
      y: Math.max(8, (desktop.height - dockSpace - height) / 2 - 20 + offset),
    },
  };
};

export const clampToDesktop = (frame: Frame, desktop: Size): Frame => {
  const width = Math.min(frame.size.width, desktop.width);
  const height = Math.min(frame.size.height, desktop.height);
  return {
    size: { width, height },
    position: {
      x: Math.max(0, Math.min(frame.position.x, desktop.width - width)),
      y: Math.max(0, Math.min(frame.position.y, desktop.height - height)),
    },
  };
};

export const resizeFrame = (
  frame: Frame,
  direction: ResizeDirection,
  pointer: Point,
  desktop: Size,
  minSize: Size
): Frame => {
  const { position, size } = frame;
  const right = position.x + size.width;
  const bottom = position.y + size.height;
  const x = Math.max(0, pointer.x);
  const y = Math.max(0, pointer.y);

  let { width, height } = size;
  let { x: left, y: top } = position;

  if (direction.includes("e"))
    width = Math.max(minSize.width, Math.min(x - left, desktop.width - left));
  if (direction.includes("w")) {
    width = Math.max(minSize.width, right - x);
    left = right - width;
  }
  if (direction.includes("s"))
    height = Math.max(minSize.height, Math.min(y - top, desktop.height - top));
  if (direction.includes("n")) {
    height = Math.max(minSize.height, bottom - y);
    top = bottom - height;
  }

  return { size: { width, height }, position: { x: left, y: top } };
};
