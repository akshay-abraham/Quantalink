import { useLayoutEffect, useState } from "react";
import { MENUBAR_HEIGHT } from "../../lib/constants";
import { Frame } from "./geometry";

const OFFSCREEN_TARGET = { x: 0, y: 0, scale: 0.1 };

export function useDockTarget(
  dockIds: string[],
  frame: Frame,
  isActive: boolean
) {
  const [target, setTarget] = useState(OFFSCREEN_TARGET);

  useLayoutEffect(() => {
    if (!isActive) return;

    const icon = dockIds
      .map((id) => document.querySelector(`[data-dock-id="${id}"]`))
      .find(Boolean);
    if (!icon) {
      setTarget({ ...OFFSCREEN_TARGET, y: window.innerHeight });
      return;
    }

    const rect = icon.getBoundingClientRect();
    const { position, size } = frame;
    setTarget({
      x: rect.left + rect.width / 2 - (position.x + size.width / 2),
      y:
        rect.top +
        rect.height / 2 -
        (MENUBAR_HEIGHT + position.y + size.height),
      scale: rect.width / size.width,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return target;
}
