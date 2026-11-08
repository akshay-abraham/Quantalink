import { RefObject, useEffect } from "react";
import { useLatest } from "./use-latest";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
  isActive = true
) {
  const callback = useLatest(onClickOutside);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        callback.current();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback.current();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, callback, isActive]);
}
