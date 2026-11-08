import { useCallback, useEffect, useRef, useState } from "react";
import { MENUBAR_HEIGHT } from "../../lib/constants";
import {
  Frame,
  ResizeDirection,
  Size,
  clampToDesktop,
  getDefaultFrame,
  getDesktopSize,
  getFullscreenFrame,
  getZoomFrame,
  resizeFrame,
} from "./geometry";

type FrameMode = "normal" | "zoom" | "fullscreen";

const TRANSITION_MS = 450;

interface UseWindowFrameOptions {
  preferredSize: Size;
  minSize: Size;
  cascadeIndex: number;
  isMaximized: boolean;
  isFullscreen: boolean;
}

const getModeFrame = (mode: FrameMode, restore: Frame) =>
  mode === "fullscreen"
    ? getFullscreenFrame()
    : mode === "zoom"
      ? getZoomFrame()
      : restore;

export function useWindowFrame({
  preferredSize,
  minSize,
  cascadeIndex,
  isMaximized,
  isFullscreen,
}: UseWindowFrameOptions) {
  const [frame, setFrame] = useState(() =>
    getDefaultFrame(preferredSize, getDesktopSize(), cascadeIndex)
  );
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mode: FrameMode = isFullscreen
    ? "fullscreen"
    : isMaximized
      ? "zoom"
      : "normal";
  const modeRef = useRef<FrameMode>("normal");
  const restoreFrame = useRef(frame);

  useEffect(() => {
    if (mode === modeRef.current) return;
    if (modeRef.current === "normal") restoreFrame.current = frame;
    modeRef.current = mode;

    setIsTransitioning(true);
    setFrame(getModeFrame(mode, restoreFrame.current));
    const timeout = setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const handleViewportResize = () =>
      setFrame((current) =>
        mode === "normal"
          ? clampToDesktop(current, getDesktopSize())
          : getModeFrame(mode, restoreFrame.current)
      );

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [mode]);

  useEffect(() => {
    if (!resizeDirection) return;

    const handleMouseMove = (e: MouseEvent) =>
      setFrame((current) =>
        resizeFrame(
          current,
          resizeDirection,
          { x: e.clientX, y: e.clientY - MENUBAR_HEIGHT },
          getDesktopSize(),
          minSize
        )
      );
    const handleMouseUp = () => setResizeDirection(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeDirection, minSize]);

  const moveTo = useCallback(
    (position: Frame["position"]) =>
      setFrame((current) => ({ ...current, position })),
    []
  );

  return {
    frame,
    mode,
    moveTo,
    isTransitioning,
    isResizing: resizeDirection !== null,
    startResize: setResizeDirection,
  };
}
