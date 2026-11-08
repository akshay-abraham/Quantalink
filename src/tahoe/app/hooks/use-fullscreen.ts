import { useEffect, useState } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      }
      if (
        !document.fullscreenEnabled ||
        typeof document.documentElement.requestFullscreen !== "function"
      )
        return false;
      await document.documentElement.requestFullscreen();
      return true;
    } catch {
      return false;
    }
  };

  return { isFullscreen, toggleFullscreen };
}
