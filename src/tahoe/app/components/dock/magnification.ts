import {
  DOCK_ICON_SIZE,
  DOCK_MAGNIFIED_SIZE,
  DOCK_MAGNIFY_RANGE,
} from "../../lib/constants";

export const getMagnifiedSize = (distance: number) =>
  Math.abs(distance) > DOCK_MAGNIFY_RANGE
    ? DOCK_ICON_SIZE
    : DOCK_ICON_SIZE +
      (DOCK_MAGNIFIED_SIZE - DOCK_ICON_SIZE) *
        Math.cos(((distance / DOCK_MAGNIFY_RANGE) * Math.PI) / 2);
