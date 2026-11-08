export type FinderView = "grid" | "list";

export const EMPTY_TRASH_PAYLOAD = "trash/empty";

const ARROW_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

export const isArrowKey = (key: string) => ARROW_KEYS.includes(key);

export const getNextSelectionIndex = (
  key: string,
  currentIndex: number,
  itemCount: number,
  columns: number,
  view: FinderView
): number | null => {
  if (!itemCount || !isArrowKey(key)) return null;
  if (currentIndex === -1) return 0;

  const rowStep = view === "grid" ? columns : 1;
  const step = {
    ArrowRight: view === "grid" ? 1 : 0,
    ArrowLeft: view === "grid" ? -1 : 0,
    ArrowDown: rowStep,
    ArrowUp: -rowStep,
  }[key]!;

  return Math.min(Math.max(currentIndex + step, 0), itemCount - 1);
};

export const countGridColumns = (grid: HTMLElement | null) => {
  const cells = Array.from(grid?.children ?? []) as HTMLElement[];
  if (!cells.length) return 1;
  return cells.filter((cell) => cell.offsetTop === cells[0].offsetTop).length;
};
