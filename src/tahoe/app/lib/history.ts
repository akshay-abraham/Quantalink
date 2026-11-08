export interface History<T> {
  entries: T[];
  index: number;
}

export const createHistory = <T>(initial: T): History<T> => ({
  entries: [initial],
  index: 0,
});

export const pushHistory = <T>(history: History<T>, next: T): History<T> =>
  history.entries[history.index] === next
    ? history
    : {
        entries: [...history.entries.slice(0, history.index + 1), next],
        index: history.index + 1,
      };

export const stepHistory = <T>(
  history: History<T>,
  step: -1 | 1
): History<T> => ({
  ...history,
  index: Math.min(
    Math.max(history.index + step, 0),
    history.entries.length - 1
  ),
});

export const currentEntry = <T>(history: History<T>) =>
  history.entries[history.index];

export const canGoBack = <T>(history: History<T>) => history.index > 0;

export const canGoForward = <T>(history: History<T>) =>
  history.index < history.entries.length - 1;
