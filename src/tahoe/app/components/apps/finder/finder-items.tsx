import { useMobile } from "../../../hooks/use-mobile";
import React, { forwardRef, useEffect, useRef } from "react";
import AppIcon from "../../dock/app-icon";
import RenameField from "./rename-field";
import { FileEntry } from "../../../lib/file-system";
import { FinderView } from "./navigation";
import { cn } from "../../../lib/utils";
import { useWindowFocus } from "../../window/window-focus";

const RENAME_DELAY_MS = 500;

export interface FinderItemHandlers {
  onSelect: (entry: FileEntry) => void;
  onOpen: (entry: FileEntry) => void;
  onContextMenu: (e: React.MouseEvent, entry: FileEntry) => void;
  onDragStart: (e: React.DragEvent<HTMLElement>, entry: FileEntry) => void;
  onStartRename: (entry: FileEntry) => void;
  onRename: (entry: FileEntry, name: string) => void;
  onCancelRename: () => void;
}

interface FinderItemsProps extends FinderItemHandlers {
  entries: FileEntry[];
  view: FinderView;
  iconSize: number;
  selectedId: string | null;
  renamingId: string | null;
  isDraggable: (entry: FileEntry) => boolean;
}

const FinderItems = forwardRef<HTMLDivElement, FinderItemsProps>(
  ({ entries, view, iconSize, selectedId, renamingId, ...handlers }, ref) => {
    const isFocused = useWindowFocus();
    const isMobile = useMobile();
    const renameTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined
    );
    const cancelPendingRename = () => clearTimeout(renameTimer.current);

    useEffect(() => cancelPendingRename, [selectedId]);

    const selectionColor = isFocused
      ? "bg-[#0a5bc2] text-white"
      : "bg-black/10 dark:bg-white/15";

    const itemProps = (entry: FileEntry) => ({
      role: "option",
      "aria-selected": selectedId === entry.id,
      draggable: handlers.isDraggable(entry),
      onDragStart: (e: React.DragEvent<HTMLElement>) =>
        handlers.onDragStart(e, entry),
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMobile) handlers.onOpen(entry);
        else handlers.onSelect(entry);
      },
      onDoubleClick: () => {
        cancelPendingRename();
        handlers.onOpen(entry);
      },
      onContextMenu: (e: React.MouseEvent) => handlers.onContextMenu(e, entry),
    });

    const renderName = (entry: FileEntry, className: string) =>
      renamingId === entry.id ? (
        <RenameField
          initialValue={entry.name}
          onCommit={(name) => handlers.onRename(entry, name)}
          onCancel={handlers.onCancelRename}
        />
      ) : (
        <div
          className={className}
          onClick={() => {
            if (isMobile || selectedId !== entry.id) return;
            cancelPendingRename();
            renameTimer.current = setTimeout(
              () => handlers.onStartRename(entry),
              RENAME_DELAY_MS
            );
          }}
        >
          {entry.name}
        </div>
      );

    if (view === "grid")
      return (
        <div
          ref={ref}
          role="listbox"
          className="grid gap-y-3 pt-2"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${iconSize + 46}px, 1fr))`,
          }}
        >
          {entries.map((entry) => {
            const isSelected = selectedId === entry.id;
            return (
              <div
                key={entry.id}
                {...itemProps(entry)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "p-1 rounded-[7px]",
                    isSelected && "bg-black/10 dark:bg-white/15"
                  )}
                >
                  <div
                    className="relative"
                    style={{ width: iconSize, height: iconSize }}
                  >
                    <AppIcon icon={entry.icon} />
                  </div>
                </div>
                {renderName(
                  entry,
                  cn(
                    "px-1.5 rounded-[4px] text-center leading-[17px] line-clamp-2 max-w-full",
                    isSelected && selectionColor
                  )
                )}
              </div>
            );
          })}
        </div>
      );

    return (
      <div ref={ref} role="listbox" className="flex flex-col">
        <div className="flex px-2 py-1 text-11 font-medium text-black/50 dark:text-white/50 border-b border-black/5 dark:border-white/10">
          <div className="flex-grow">Name</div>
          <div className="w-32">Kind</div>
        </div>
        {entries.map((entry, index) => {
          const isSelected = selectedId === entry.id;
          return (
            <div
              key={entry.id}
              {...itemProps(entry)}
              className={cn(
                "flex items-center px-2 h-7 rounded-md",
                isSelected
                  ? selectionColor
                  : index % 2 === 1 && "bg-black/[0.03] dark:bg-white/[0.04]"
              )}
            >
              <div className="relative w-5 h-5 mr-2 shrink-0">
                <AppIcon icon={entry.icon} />
              </div>
              {renderName(entry, "flex-grow truncate")}
              <div
                className={cn(
                  "w-32 truncate",
                  !(isSelected && isFocused) &&
                    "text-black/50 dark:text-white/50"
                )}
              >
                {entry.kind}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

FinderItems.displayName = "FinderItems";

export default FinderItems;
