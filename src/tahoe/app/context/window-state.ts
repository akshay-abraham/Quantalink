import type { AppId } from "../lib/apps";

export interface WindowState {
  id: AppId;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen: boolean;
  payload?: string;
  openedAt: number;
}

export interface WindowManagerState {
  windows: WindowState[];
  topZIndex: number;
  isDesktopFocused: boolean;
}

export type WindowAction =
  | {
      type: "open";
      id: AppId;
      payload?: string;
      openedAt: number;
      startMaximized: boolean;
    }
  | { type: "close"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "toggleMaximize"; id: AppId }
  | { type: "toggleFullscreen"; id: AppId }
  | { type: "focusDesktop" }
  | { type: "closeAll" };

export const initialWindowState: WindowManagerState = {
  windows: [],
  topZIndex: 0,
  isDesktopFocused: false,
};

const raise = (
  state: WindowManagerState,
  id: AppId,
  changes: (window: WindowState) => Partial<WindowState>
): WindowManagerState => {
  const zIndex = state.topZIndex + 1;
  return {
    windows: state.windows.map((w) =>
      w.id === id
        ? { ...w, ...changes(w), zIndex }
        : { ...w, isFullscreen: false }
    ),
    topZIndex: zIndex,
    isDesktopFocused: false,
  };
};

export function windowReducer(
  state: WindowManagerState,
  action: WindowAction
): WindowManagerState {
  switch (action.type) {
    case "open": {
      const { id, payload, openedAt, startMaximized } = action;
      if (state.windows.some((w) => w.id === id))
        return raise(state, id, () => ({
          isMinimized: false,
          payload,
          openedAt,
        }));

      const zIndex = state.topZIndex + 1;
      return {
        windows: [
          ...state.windows.map((w) => ({ ...w, isFullscreen: false })),
          {
            id,
            zIndex,
            isMinimized: false,
            isMaximized: startMaximized,
            isFullscreen: false,
            payload,
            openedAt,
          },
        ],
        topZIndex: zIndex,
        isDesktopFocused: false,
      };
    }
    case "close":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id && !w.isFullscreen
            ? { ...w, isMinimized: true }
            : w
        ),
      };
    case "focus": {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target) return state;
      if (selectFocusedId(state) === action.id) return state;
      return raise(state, action.id, () => ({ isMinimized: false }));
    }
    case "toggleMaximize":
      return raise(state, action.id, (w) => ({ isMaximized: !w.isMaximized }));
    case "toggleFullscreen":
      return raise(state, action.id, (w) => ({
        isFullscreen: !w.isFullscreen,
      }));
    case "focusDesktop":
      return state.isDesktopFocused
        ? state
        : { ...state, isDesktopFocused: true };
    case "closeAll":
      return { ...state, windows: [] };
  }
}

export function selectFocusedId(state: WindowManagerState): AppId | null {
  if (state.isDesktopFocused) return null;
  const visible = state.windows.filter((w) => !w.isMinimized);
  if (!visible.length) return null;
  return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id;
}

export function selectFullscreenId(state: WindowManagerState): AppId | null {
  const focusedId = selectFocusedId(state);
  return (
    state.windows.find((w) => w.id === focusedId && w.isFullscreen)?.id ?? null
  );
}
