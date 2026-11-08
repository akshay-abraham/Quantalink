"use client";

import { useMobile } from "../../hooks/use-mobile";
import Draggable from "react-draggable";
import React, { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { App } from "../../lib/apps";
import { MENUBAR_HEIGHT } from "../../lib/constants";
import { WindowState, useWindows } from "../../context/window-context";
import { cn } from "../../lib/utils";
import { WindowFocusContext } from "./window-focus";
import { useWindowFrame } from "./use-window-frame";
import { useDockTarget } from "./use-dock-target";
import WindowControls from "./window-controls";
import ResizeHandles from "./resize-handles";
import AppErrorBoundary from "./app-error-boundary";

const DEFAULT_MIN_SIZE = { width: 200, height: 200 };
const OFFSCREEN_MARGIN = 80;

interface WindowProps {
  app: App;
  state: WindowState;
  index: number;
  isFocused: boolean;
  isHidden: boolean;
  children: React.ReactNode;
}

const isInside = (target: EventTarget, selector: string) =>
  (target as HTMLElement).closest(selector) !== null;

const Window: React.FC<WindowProps> = ({
  app,
  state,
  index,
  isFocused,
  isHidden,
  children,
}) => {
  const isMobile = useMobile();
  const { closeApp, minimizeApp, focusApp, toggleMaximize, toggleFullscreen } =
    useWindows();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { frame, moveTo, isTransitioning, isResizing, startResize } =
    useWindowFrame({
      preferredSize: app.size,
      minSize: app.minSize ?? DEFAULT_MIN_SIZE,
      cascadeIndex: index,
      isMaximized: state.isMaximized,
      isFullscreen: state.isFullscreen,
    });
  const dockTarget = useDockTarget(
    [`minimized-${app.id}`, app.id],
    frame,
    state.isMinimized
  );

  const blocksPointer =
    isDragging || isResizing || (!isFocused && app.embedsContent);

  return (
    <Draggable
      axis="both"
      handle=".handle"
      disabled={state.isFullscreen || isMobile}
      cancel="button, input, textarea, a, .window-controls"
      nodeRef={windowRef}
      position={frame.position}
      bounds={{
        top: 0,
        left: OFFSCREEN_MARGIN - frame.size.width,
        right: window.innerWidth - OFFSCREEN_MARGIN,
        bottom: window.innerHeight - MENUBAR_HEIGHT - 60,
      }}
      onStart={() => focusApp(app.id)}
      onDrag={() => setIsDragging(true)}
      onStop={(_, data) => {
        setIsDragging(false);
        moveTo({ x: data.x, y: data.y });
      }}
    >
      <div
        ref={windowRef}
        role="dialog"
        aria-label={app.title}
        data-mobile-visible={isFocused && !state.isMinimized}
        className={cn(
          "app-window absolute top-0 left-0",
          isTransitioning &&
            "transition-[width,height,transform] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          state.isMinimized || isHidden
            ? "pointer-events-none"
            : "pointer-events-auto",
          isHidden && "invisible",
          !isFocused && "inactive-window"
        )}
        style={{
          width: frame.size.width,
          height: frame.size.height,
          zIndex: state.zIndex,
        }}
        onMouseDownCapture={() => focusApp(app.id)}
        onContextMenu={(e) => {
          if (!isInside(e.target, "input, textarea, .selectable"))
            e.preventDefault();
        }}
      >
        <motion.div
          className={cn(
            "app-window-surface h-full w-full bg-[#e8e6ea]/75 dark:bg-[#3a3039]/70 backdrop-blur-3xl backdrop-saturate-150 rounded-[26px] overflow-hidden flex flex-col relative text-13 text-black/85 dark:text-white/90 ring-[0.5px] ring-black/40 transition-shadow duration-200",
            "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] dark:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)]",
            isFocused
              ? "shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(0,0,0,0.6)]"
              : "shadow-[0_14px_36px_rgba(0,0,0,0.35)]",
            state.isFullscreen &&
              "rounded-none after:rounded-none shadow-none ring-0"
          )}
          style={{ transformOrigin: "bottom center" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={
            state.isMinimized
              ? {
                  opacity: 0,
                  ...dockTarget,
                  transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
                }
              : { opacity: 1, scale: 1, x: 0, y: 0 }
          }
          exit={{
            opacity: 0,
            scale: 0.97,
            transition: { duration: 0.16, ease: "easeIn" },
          }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
        >
          {!isMobile && (
            <WindowControls
              isFocused={isFocused}
              isFullscreen={state.isFullscreen}
              onFullscreen={(e) =>
                e.altKey ? toggleMaximize(app.id) : toggleFullscreen(app.id)
              }
              onClose={() => closeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
            />
          )}
          <div
            className="flex-grow min-h-0 relative"
            onDoubleClick={(e) => {
              if (
                !state.isFullscreen &&
                isInside(e.target, ".handle") &&
                !isInside(e.target, "button, input")
              )
                toggleMaximize(app.id);
            }}
          >
            <WindowFocusContext.Provider value={isFocused}>
              <AppErrorBoundary
                appName={app.name}
                onClose={() => closeApp(app.id)}
              >
                {children}
              </AppErrorBoundary>
            </WindowFocusContext.Provider>
            {blocksPointer && <div className="absolute inset-0" />}
          </div>
        </motion.div>
        {!isMobile && !state.isMaximized && !state.isFullscreen && (
          <ResizeHandles onResizeStart={startResize} />
        )}
      </div>
    </Draggable>
  );
};

export default memo(Window);
