import {
  History,
  createHistory,
  currentEntry,
  pushHistory,
  stepHistory,
} from "../../../lib/history";

export interface BrowserTab {
  id: number;
  history: History<string>;
  reloadKey: number;
}

export interface TabsState {
  tabs: BrowserTab[];
  activeId: number;
  nextId: number;
}

export type TabsAction =
  | { type: "open"; url: string }
  | { type: "close"; id: number }
  | { type: "select"; id: number }
  | { type: "navigate"; url: string }
  | { type: "step"; direction: -1 | 1 }
  | { type: "reload" };

export const createTabs = (url: string): TabsState => ({
  tabs: [{ id: 0, history: createHistory(url), reloadKey: 0 }],
  activeId: 0,
  nextId: 1,
});

const updateActive = (
  state: TabsState,
  update: (tab: BrowserTab) => BrowserTab
): TabsState => ({
  ...state,
  tabs: state.tabs.map((tab) =>
    tab.id === state.activeId ? update(tab) : tab
  ),
});

export function tabsReducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case "open":
      return {
        tabs: [
          ...state.tabs,
          {
            id: state.nextId,
            history: createHistory(action.url),
            reloadKey: 0,
          },
        ],
        activeId: state.nextId,
        nextId: state.nextId + 1,
      };
    case "close": {
      const index = state.tabs.findIndex((tab) => tab.id === action.id);
      if (index === -1 || state.tabs.length === 1) return state;
      const tabs = state.tabs.filter((tab) => tab.id !== action.id);
      const activeId =
        state.activeId === action.id
          ? tabs[Math.min(index, tabs.length - 1)].id
          : state.activeId;
      return { ...state, tabs, activeId };
    }
    case "select":
      return state.tabs.some((tab) => tab.id === action.id)
        ? { ...state, activeId: action.id }
        : state;
    case "navigate":
      return updateActive(state, (tab) => ({
        ...tab,
        history: pushHistory(tab.history, action.url),
      }));
    case "step":
      return updateActive(state, (tab) => ({
        ...tab,
        history: stepHistory(tab.history, action.direction),
      }));
    case "reload":
      return updateActive(state, (tab) => ({
        ...tab,
        reloadKey: tab.reloadKey + 1,
      }));
  }
}

export const selectActiveTab = (state: TabsState) =>
  state.tabs.find((tab) => tab.id === state.activeId) ?? state.tabs[0];

export const tabUrl = (tab: BrowserTab) => currentEntry(tab.history);
