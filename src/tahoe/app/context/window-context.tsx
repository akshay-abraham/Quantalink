"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { AppId } from "../lib/apps";
import { LAUNCH_BOUNCE_MS, MOBILE_BREAKPOINT } from "../lib/constants";
import {
  WindowState,
  initialWindowState,
  selectFocusedId,
  selectFullscreenId,
  windowReducer,
} from "./window-state";

export type { WindowState } from "./window-state";

interface WindowActions {
  openApp: (id: AppId, payload?: string) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  toggleFullscreen: (id: AppId) => void;
  focusDesktop: () => void;
  closeAll: () => void;
}

interface WindowContextValue extends WindowActions {
  windows: WindowState[];
  focusedId: AppId | null;
  fullscreenId: AppId | null;
  launching: AppId | null;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  const [launching, setLaunching] = useState<AppId | null>(null);
  const stateRef = useRef(state);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => () => clearTimeout(launchTimer.current), []);

  const actions = useMemo<WindowActions>(
    () => ({
      openApp: (id, payload) => {
        if (!stateRef.current.windows.some((w) => w.id === id)) {
          setLaunching(id);
          clearTimeout(launchTimer.current);
          launchTimer.current = setTimeout(
            () => setLaunching(null),
            LAUNCH_BOUNCE_MS
          );
        }
        dispatch({
          type: "open",
          id,
          payload,
          openedAt: Date.now(),
          startMaximized: window.innerWidth < MOBILE_BREAKPOINT,
        });
      },
      closeApp: (id) => dispatch({ type: "close", id }),
      minimizeApp: (id) => dispatch({ type: "minimize", id }),
      focusApp: (id) => dispatch({ type: "focus", id }),
      toggleMaximize: (id) => dispatch({ type: "toggleMaximize", id }),
      toggleFullscreen: (id) => dispatch({ type: "toggleFullscreen", id }),
      focusDesktop: () => dispatch({ type: "focusDesktop" }),
      closeAll: () => dispatch({ type: "closeAll" }),
    }),
    []
  );

  const value = useMemo<WindowContextValue>(
    () => ({
      ...actions,
      windows: state.windows,
      focusedId: selectFocusedId(state),
      fullscreenId: selectFullscreenId(state),
      launching,
    }),
    [actions, state, launching]
  );

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context)
    throw new Error("useWindows must be used inside WindowProvider");
  return context;
};
