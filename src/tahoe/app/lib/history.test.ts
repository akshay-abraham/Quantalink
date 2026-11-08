import { describe, expect, it } from "vitest";
import {
  canGoBack,
  canGoForward,
  createHistory,
  pushHistory,
  stepHistory,
} from "./history";

describe("history", () => {
  it("drops forward entries when navigating somewhere new", () => {
    let history = createHistory("home");
    history = pushHistory(history, "projects");
    history = pushHistory(history, "trash");
    history = stepHistory(history, -1);
    history = pushHistory(history, "documents");
    expect(history.entries).toEqual(["home", "projects", "documents"]);
    expect(history.index).toBe(2);
  });

  it("ignores navigating to the current location", () => {
    const history = createHistory("home");
    expect(pushHistory(history, "home")).toBe(history);
  });

  it("stays within bounds", () => {
    const history = createHistory("home");
    expect(stepHistory(history, -1).index).toBe(0);
    expect(stepHistory(history, 1).index).toBe(0);
  });
});

describe("history navigation state", () => {
  it("reports when back and forward are available", () => {
    const history = pushHistory(createHistory("a"), "b");
    expect(canGoBack(history)).toBe(true);
    expect(canGoForward(history)).toBe(false);
    expect(canGoForward(stepHistory(history, -1))).toBe(true);
  });
});
