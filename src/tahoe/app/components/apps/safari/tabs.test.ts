import { describe, expect, it } from "vitest";
import {
  TabsAction,
  TabsState,
  createTabs,
  selectActiveTab,
  tabUrl,
  tabsReducer,
} from "./tabs";

const run = (state: TabsState, ...actions: TabsAction[]) =>
  actions.reduce(tabsReducer, state);

const activeUrl = (state: TabsState) => tabUrl(selectActiveTab(state));

describe("tabsReducer", () => {
  it("opens new tabs in front", () => {
    const state = run(createTabs("a"), { type: "open", url: "b" });
    expect(state.tabs).toHaveLength(2);
    expect(activeUrl(state)).toBe("b");
  });

  it("keeps a separate history per tab", () => {
    const state = run(
      createTabs("a"),
      { type: "navigate", url: "a2" },
      { type: "open", url: "b" },
      { type: "select", id: 0 },
      { type: "step", direction: -1 }
    );
    expect(activeUrl(state)).toBe("a");
    expect(tabUrl(state.tabs[1])).toBe("b");
  });

  it("activates the neighbouring tab when closing the active one", () => {
    const state = run(
      createTabs("a"),
      { type: "open", url: "b" },
      { type: "open", url: "c" },
      { type: "select", id: 1 },
      { type: "close", id: 1 }
    );
    expect(state.tabs.map(tabUrl)).toEqual(["a", "c"]);
    expect(activeUrl(state)).toBe("c");
  });

  it("never closes the last tab", () => {
    const state = createTabs("a");
    expect(tabsReducer(state, { type: "close", id: 0 })).toBe(state);
  });

  it("reloads only the active tab", () => {
    const state = run(
      createTabs("a"),
      { type: "open", url: "b" },
      { type: "reload" }
    );
    expect(state.tabs.map((tab) => tab.reloadKey)).toEqual([0, 1]);
  });
});
