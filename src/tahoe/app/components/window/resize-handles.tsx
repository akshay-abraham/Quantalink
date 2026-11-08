import React from "react";
import { RESIZE_DIRECTIONS, ResizeDirection } from "./geometry";

const HANDLE_SIZE = 10;

const cursors: Record<ResizeDirection, string> = {
  n: "cursor-ns-resize",
  s: "cursor-ns-resize",
  e: "cursor-ew-resize",
  w: "cursor-ew-resize",
  ne: "cursor-nesw-resize",
  nw: "cursor-nwse-resize",
  se: "cursor-nwse-resize",
  sw: "cursor-nesw-resize",
};

const getHandleStyle = (direction: ResizeDirection): React.CSSProperties => {
  const offset = -HANDLE_SIZE / 2;
  const isEdge = direction.length === 1;
  const isVerticalEdge = direction === "n" || direction === "s";

  return {
    ...(direction.includes("n") && { top: offset, height: HANDLE_SIZE }),
    ...(direction.includes("s") && { bottom: offset, height: HANDLE_SIZE }),
    ...(direction.includes("e") && { right: offset, width: HANDLE_SIZE }),
    ...(direction.includes("w") && { left: offset, width: HANDLE_SIZE }),
    ...(isEdge && isVerticalEdge && { left: 0, width: "100%" }),
    ...(isEdge && !isVerticalEdge && { top: 0, height: "100%" }),
  };
};

const ResizeHandles: React.FC<{
  onResizeStart: (direction: ResizeDirection) => void;
}> = ({ onResizeStart }) => (
  <>
    {RESIZE_DIRECTIONS.map((direction) => (
      <div
        key={direction}
        aria-hidden
        className={`absolute ${cursors[direction]}`}
        style={getHandleStyle(direction)}
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart(direction);
        }}
      />
    ))}
  </>
);

export default ResizeHandles;
