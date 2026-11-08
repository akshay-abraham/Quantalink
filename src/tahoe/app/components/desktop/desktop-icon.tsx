"use client";

import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";

const DRAG_THRESHOLD = 3;
const ICON_WIDTH = 96;
const ICON_HEIGHT = 100;

export interface IconPosition {
  right: number;
  top: number;
}

interface DesktopIconProps {
  id: string;
  initialPosition: IconPosition;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onDrop?: (x: number, y: number) => void;
}

const clampToBounds = (
  position: IconPosition,
  bounds: DOMRect
): IconPosition => ({
  right: Math.min(Math.max(position.right, 0), bounds.width - ICON_WIDTH),
  top: Math.min(Math.max(position.top, 0), bounds.height - ICON_HEIGHT),
});

const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  initialPosition,
  icon,
  label,
  isSelected,
  isActive,
  onSelect,
  onOpen,
  onDrop,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    onSelect();

    const bounds = ref.current?.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    const start = { x: e.clientX, y: e.clientY, position };
    let hasMoved = false;

    const handlePointerMove = (move: PointerEvent) => {
      const dx = move.clientX - start.x;
      const dy = move.clientY - start.y;
      if (!hasMoved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      hasMoved = true;
      setIsDragging(true);
      setPosition(
        clampToBounds(
          { right: start.position.right - dx, top: start.position.top + dy },
          bounds
        )
      );
    };

    const handlePointerUp = (up: PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      setIsDragging(false);
      if (hasMoved) onDrop?.(up.clientX, up.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      ref={ref}
      data-icon-id={id}
      role="option"
      aria-label={label}
      aria-selected={isSelected}
      className="absolute flex flex-col items-center w-24 py-1 touch-none"
      style={{ right: position.right, top: position.top }}
      onPointerDown={handlePointerDown}
      onClick={() => {
        if (window.matchMedia("(pointer: coarse)").matches) onOpen();
      }}
      onDoubleClick={onOpen}
    >
      <div
        className={cn(
          "p-[3px] rounded-[6px]",
          isSelected && !isDragging && "bg-black/30 ring-1 ring-white/25"
        )}
      >
        <div className="relative w-16 h-16">{icon}</div>
      </div>
      <div
        className={cn(
          "px-1.5 mt-1 rounded-[4px]",
          (isSelected || isDragging) &&
            (isActive ? "bg-[#0a5bc2]" : "bg-white/25")
        )}
      >
        <div className="text-12 font-medium leading-[18px] text-white text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
          {label}
        </div>
      </div>
    </div>
  );
};

export default DesktopIcon;
