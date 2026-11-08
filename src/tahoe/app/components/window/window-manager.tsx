"use client";

import React from "react";
import { useMobile } from "../../hooks/use-mobile";
import { WindowFocusContext } from "./window-focus";
import AppErrorBoundary from "./app-error-boundary";
import { AnimatePresence } from "framer-motion";
import Window from "./window";
import { getApp } from "../../lib/apps";
import { useWindows } from "../../context/window-context";
import { cn } from "../../lib/utils";
import { MENUBAR_HEIGHT } from "../../lib/constants";

const WindowManager: React.FC = () => {
  const { windows, focusedId, fullscreenId, closeApp } = useWindows();
  const isMobile = useMobile();

  if (isMobile)
    return (
      <div className="mobile-window-manager">
        {windows.map((state) => {
          const app = getApp(state.id);
          const Component = app.component;
          const visible = focusedId === state.id && !state.isMinimized;
          return (
            <section
              key={state.id}
              hidden={!visible}
              className="mobile-app app-window-surface"
              aria-label={app.name}
            >
              <WindowFocusContext.Provider value={visible}>
                <AppErrorBoundary
                  appName={app.name}
                  onClose={() => closeApp(app.id)}
                >
                  <Component
                    payload={state.payload}
                    openedAt={state.openedAt}
                  />
                </AppErrorBoundary>
              </WindowFocusContext.Provider>
            </section>
          );
        })}
      </div>
    );

  return (
    <div
      className={cn(
        "window-manager absolute inset-x-0 bottom-0 pointer-events-none",
        fullscreenId ? "z-fullscreen" : "z-windows"
      )}
      style={{ top: MENUBAR_HEIGHT }}
    >
      <AnimatePresence>
        {windows.map((state, index) => {
          const app = getApp(state.id);
          const AppComponent = app.component;

          return (
            <Window
              key={state.id}
              app={app}
              state={state}
              index={index}
              isFocused={focusedId === state.id}
              isHidden={!!fullscreenId && fullscreenId !== state.id}
            >
              <AppComponent payload={state.payload} openedAt={state.openedAt} />
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;
