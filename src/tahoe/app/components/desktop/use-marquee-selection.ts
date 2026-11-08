import { RefObject, useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
}

export interface Marquee {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const toMarquee = (start: Point, end: Point): Marquee => ({
  left: Math.min(start.x, end.x),
  top: Math.min(start.y, end.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
});

export const intersects = (marquee: Marquee, rect: DOMRect) =>
  rect.left < marquee.left + marquee.width &&
  rect.right > marquee.left &&
  rect.top < marquee.top + marquee.height &&
  rect.bottom > marquee.top;

export function useMarqueeSelection(
  containerRef: RefObject<HTMLElement | null>,
  itemSelector: string,
  getItemId: (element: HTMLElement) => string,
  onSelectionChange: (ids: string[]) => void
) {
  const [drag, setDrag] = useState<{ start: Point; end: Point } | null>(null);

  useEffect(() => {
    if (!drag) return;

    const handlePointerMove = (e: PointerEvent) => {
      const end = { x: e.clientX, y: e.clientY };
      const marquee = toMarquee(drag.start, end);
      const elements =
        containerRef.current?.querySelectorAll<HTMLElement>(itemSelector) ?? [];

      setDrag({ start: drag.start, end });
      onSelectionChange(
        Array.from(elements)
          .filter((element) =>
            intersects(marquee, element.getBoundingClientRect())
          )
          .map(getItemId)
      );
    };
    const handlePointerUp = () => setDrag(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [drag, containerRef, itemSelector, getItemId, onSelectionChange]);

  return {
    marquee: drag ? toMarquee(drag.start, drag.end) : null,
    start: (point: Point) => setDrag({ start: point, end: point }),
  };
}
