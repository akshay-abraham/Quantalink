import { describe, expect, it } from "vitest";
import {
  WindowAction,
  WindowManagerState,
  initialWindowState,
  selectFocusedId,
  selectFullscreenId,
  windowReducer,
} from "./window-state";
import type { AppId } from "../lib/apps";

const run = (...actions: WindowAction[]): WindowManagerState =>
  actions.reduce(windowReducer, initialWindowState);

const open = (id: AppId, payload?: string): WindowAction => ({
  type: "open",
  id,
  payload,
  openedAt: 0,
  startMaximized: false,
});

describe("windowReducer", () => {
  it("opens windows on top of each other", () => {
    const state = run(open("finder"), open("notes"));
    expect(state.windows.map((w) => w.id)).toEqual(["finder", "notes"]);
    expect(selectFocusedId(state)).toBe("notes");
  });

  it("re-opening an existing window focuses it instead of duplicating", () => {
    const state = run(open("finder"), open("notes"), open("finder", "trash"));
    expect(state.windows).toHaveLength(2);
    expect(selectFocusedId(state)).toBe("finder");
    expect(state.windows.find((w) => w.id === "finder")?.payload).toBe("trash");
  });

  it("focuses the next window when the top one is minimized", () => {
    const state = run(open("finder"), open("notes"), {
      type: "minimize",
      id: "notes",
    });
    expect(selectFocusedId(state)).toBe("finder");
  });

  it("closes the current app and reveals the previous one", () => {
    const state = run(open("finder"), open("notes"), {
      type: "close",
      id: "notes",
    });
    expect(state.windows.map((window) => window.id)).toEqual(["finder"]);
    expect(selectFocusedId(state)).toBe("finder");
  });

  it("restores a minimized window when focused", () => {
    const state = run(
      open("notes"),
      { type: "minimize", id: "notes" },
      { type: "focus", id: "notes" }
    );
    expect(state.windows[0].isMinimized).toBe(false);
    expect(selectFocusedId(state)).toBe("notes");
  });

  it("does not minimize a full screen window", () => {
    const state = run(
      open("notes"),
      { type: "toggleFullscreen", id: "notes" },
      { type: "minimize", id: "notes" }
    );
    expect(state.windows[0].isMinimized).toBe(false);
    expect(selectFullscreenId(state)).toBe("notes");
  });

  it("leaves full screen when another window is focused", () => {
    const state = run(
      open("finder"),
      open("notes"),
      { type: "toggleFullscreen", id: "notes" },
      { type: "focus", id: "finder" }
    );
    expect(selectFullscreenId(state)).toBeNull();
    expect(state.windows.every((w) => !w.isFullscreen)).toBe(true);
  });

  it("clicking the desktop deactivates every window", () => {
    const state = run(open("finder"), { type: "focusDesktop" });
    expect(selectFocusedId(state)).toBeNull();
    expect(
      selectFocusedId(windowReducer(state, { type: "focus", id: "finder" }))
    ).toBe("finder");
  });

  it("ignores actions for unknown windows", () => {
    const state = run(open("finder"));
    expect(windowReducer(state, { type: "focus", id: "mail" })).toBe(state);
  });
});
