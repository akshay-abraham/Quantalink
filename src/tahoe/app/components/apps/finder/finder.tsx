"use client";

import { useMobile } from "../../../hooks/use-mobile";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppProps } from "../../../lib/apps";
import {
  FileEntry,
  Location,
  buildFileEntries,
  canOpen,
  getLocationTitle,
  getProjectTags,
  isLocation,
  listLocation,
} from "../../../lib/file-system";
import { useContent } from "../../../context/content-context";
import { FILE_DRAG_TYPE, useFiles } from "../../../context/file-context";
import { useOpenTarget } from "../../../hooks/use-open-file";
import { useAvailableStorage } from "../../../hooks/use-available-storage";
import ContextMenu, { useContextMenu } from "../../context-menu";
import QuickLook, { toQuickLookItem } from "../../quick-look/quick-look";
import Sidebar, { SidebarSection } from "../../window/sidebar";
import AlertSheet from "../../window/alert-sheet";
import FinderToolbar from "./finder-toolbar";
import FinderItems from "./finder-items";
import FinderDetail from "./finder-detail";
import { buildBackgroundMenu, buildItemMenu } from "./finder-menus";
import { MAX_SIDEBAR_TAGS, getTagColor } from "./tag-colors";
import {
  EMPTY_TRASH_PAYLOAD,
  FinderView,
  countGridColumns,
  getNextSelectionIndex,
} from "./navigation";
import {
  canGoBack,
  canGoForward,
  createHistory,
  currentEntry,
  pushHistory,
  stepHistory,
} from "../../../lib/history";

import TrashIcon from "../../../assets/icons/files/trash-full.png";

const DEFAULT_ICON_SIZE = 64;

const getSidebarSections = (
  username: string,
  tags: string[]
): SidebarSection[] => [
  { items: [{ id: "recents", label: "Recents", symbol: "clock" }] },
  {
    title: "Favorites",
    items: [
      { id: "applications", label: "Applications", symbol: "a-square" },
      { id: "desktop", label: "Desktop", symbol: "menubar-dock-rectangle" },
      { id: "documents", label: "Documents", symbol: "doc" },
      { id: "downloads", label: "Downloads", symbol: "arrow-down-circle" },
      { id: "experience", label: "Experience", symbol: "folder" },
      { id: "projects", label: "Projects", symbol: "folder" },
      { id: "contributions", label: "Open Source", symbol: "folder" },
    ],
  },
  {
    title: "Locations",
    items: [
      { id: "home", label: username, symbol: "house" },
      { id: "trash", label: "Trash", symbol: "trash" },
    ],
  },
  {
    title: "Tags",
    items: tags.map((tag) => ({
      id: `tag:${tag}`,
      label: tag,
      dot: getTagColor(tags, tag),
    })),
  },
];

const parsePayload = (payload?: string) => {
  if (payload === EMPTY_TRASH_PAYLOAD)
    return { location: "trash" as const, selection: undefined, empty: true };
  const [location, selection] = payload?.split("/") ?? [];
  return {
    location: isLocation(location) ? location : undefined,
    selection,
  };
};

const Finder: React.FC<AppProps> = ({ payload, openedAt }) => {
  const isMobile = useMobile();
  const content = useContent();
  const files = useFiles();
  const initial = parsePayload(payload);

  const [history, setHistory] = useState(() =>
    createHistory<Location>(initial.location ?? "home")
  );
  const [view, setView] = useState<FinderView>("grid");
  const [iconSize, setIconSize] = useState(DEFAULT_ICON_SIZE);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.selection ?? null
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [isQuickLookOpen, setIsQuickLookOpen] = useState(false);
  const [isConfirmingEmpty, setIsConfirmingEmpty] = useState(!!initial.empty);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const contextMenu = useContextMenu(rootRef);
  const availableStorage = useAvailableStorage();

  const location = currentEntry(history);
  const isTrash = location === "trash";
  const { username } = content.profile;

  const resetView = () => {
    setSelectedId(null);
    setRenamingId(null);
    setSearch("");
  };

  const navigate = (next: Location) => {
    setHistory((current) => pushHistory(current, next));
    resetView();
  };

  const step = (direction: -1 | 1) => {
    setHistory((current) => stepHistory(current, direction));
    resetView();
  };

  useEffect(() => {
    const { location, selection, empty } = parsePayload(payload);
    if (location) setHistory((current) => pushHistory(current, location));
    setSelectedId(selection ?? null);
    if (empty) setIsConfirmingEmpty(true);
  }, [payload, openedAt]);

  const openTarget = useOpenTarget(navigate);
  const open = (entry: FileEntry) => openTarget(entry.open);

  const entries = useMemo(() => buildFileEntries(content), [content]);
  const tags = useMemo(
    () => getProjectTags(content).slice(0, MAX_SIDEBAR_TAGS),
    [content]
  );

  const items = listLocation(location, entries, username, files).map(
    (entry) => ({ ...entry, name: files.getName(entry.id, entry.name) })
  );
  const visibleItems = items.filter(
    (entry) =>
      (!isMobile || entry.id !== "terminal") &&
      entry.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = items.find((entry) => entry.id === selectedId);

  const focusContent = () => contentRef.current?.focus();

  const moveToTrash = (entry: FileEntry) => {
    if (!entry.canTrash || isTrash) return;
    files.moveToTrash([entry.id]);
    setSelectedId(null);
  };

  const startRename = (entry: FileEntry) => {
    if (entry.canRename && !isTrash) setRenamingId(entry.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (renamingId || contextMenu.menu) return;
    const index = visibleItems.findIndex((entry) => entry.id === selectedId);
    const current = visibleItems[index];

    const shortcuts: [boolean, () => void][] = [
      [e.key === " " && !!current, () => setIsQuickLookOpen((o) => !o)],
      [e.key === "Enter" && !!current, () => startRename(current)],
      [
        e.metaKey && (e.key === "ArrowDown" || e.key === "o") && !!current,
        () => open(current),
      ],
      [
        e.metaKey && e.key === "Backspace" && !!current,
        () => moveToTrash(current),
      ],
      [e.metaKey && e.key === "ArrowUp", () => step(-1)],
    ];
    const shortcut = shortcuts.find(([matches]) => matches);
    if (shortcut) {
      e.preventDefault();
      shortcut[1]();
      return;
    }

    const next = getNextSelectionIndex(
      e.key,
      index,
      visibleItems.length,
      countGridColumns(itemsRef.current),
      view
    );
    if (next === null) return;
    e.preventDefault();
    setSelectedId(visibleItems[next].id);
  };

  return (
    <div ref={rootRef} className="relative flex h-full">
      <Sidebar
        sections={getSidebarSections(username, tags)}
        selectedId={location}
        onSelect={(id) => isLocation(id) && navigate(id)}
        onDropItem={(id, fileId) =>
          id === "trash" && files.moveToTrash([fileId])
        }
      />

      <div className="relative flex flex-col flex-grow min-w-0 bg-white dark:bg-[#282025]">
        <FinderToolbar
          title={getLocationTitle(location, username)}
          canGoBack={canGoBack(history)}
          canGoForward={canGoForward(history)}
          onBack={() => step(-1)}
          onForward={() => step(1)}
          view={view}
          onViewChange={setView}
          search={search}
          onSearchChange={setSearch}
        />

        {isTrash && (
          <div className="flex items-center justify-between h-9 px-4 text-12 bg-black/[0.03] dark:bg-white/[0.04] border-y border-black/5 dark:border-white/5">
            <span className="text-black/60 dark:text-white/60">Trash</span>
            <button
              disabled={!files.trashed.length}
              onClick={() => setIsConfirmingEmpty(true)}
              className="h-6 px-3 rounded-full bg-black/5 dark:bg-white/10 active:bg-black/10 dark:active:bg-white/20 disabled:opacity-40"
            >
              Empty
            </button>
          </div>
        )}

        <div className="flex flex-grow min-h-0">
          <div
            ref={contentRef}
            className="flex-grow overflow-auto px-4 pb-4 outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => {
              setSelectedId(null);
              setRenamingId(null);
            }}
            onContextMenu={(e) =>
              contextMenu.open(
                e,
                buildBackgroundMenu({
                  view,
                  onViewChange: setView,
                  trash: isTrash
                    ? {
                        isEmpty: !files.trashed.length,
                        onEmpty: () => setIsConfirmingEmpty(true),
                      }
                    : undefined,
                })
              )
            }
          >
            {visibleItems.length ? (
              <FinderItems
                ref={itemsRef}
                entries={visibleItems}
                view={view}
                iconSize={iconSize}
                selectedId={selectedId}
                renamingId={renamingId}
                isDraggable={(entry) =>
                  entry.canTrash && !isTrash && renamingId !== entry.id
                }
                onSelect={(entry) => {
                  setSelectedId(entry.id);
                  focusContent();
                }}
                onOpen={(entry) => !isTrash && open(entry)}
                onDragStart={(e, entry) => {
                  e.dataTransfer.setData(FILE_DRAG_TYPE, entry.id);
                  e.dataTransfer.effectAllowed = "move";
                  const icon = e.currentTarget.querySelector("img");
                  if (icon)
                    e.dataTransfer.setDragImage(
                      icon,
                      iconSize / 2,
                      iconSize / 2
                    );
                  setSelectedId(entry.id);
                }}
                onContextMenu={(e, entry) => {
                  setSelectedId(entry.id);
                  contextMenu.open(
                    e,
                    buildItemMenu(entry, isTrash, {
                      open: () => open(entry),
                      moveToTrash: () => moveToTrash(entry),
                      putBack: () => files.putBack([entry.id]),
                      showInfo: () => setSelectedId(entry.id),
                      rename: () => startRename(entry),
                      quickLook: () => setIsQuickLookOpen(true),
                    })
                  );
                }}
                onStartRename={startRename}
                onRename={(entry, name) => {
                  files.rename(entry.id, name);
                  setRenamingId(null);
                  focusContent();
                }}
                onCancelRename={() => {
                  setRenamingId(null);
                  focusContent();
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-black/35 dark:text-white/35">
                {search && `No results for "${search}"`}
              </div>
            )}
          </div>

          {selected && !isTrash && (
            <FinderDetail
              entry={selected}
              getTagColor={(tag) => getTagColor(tags, tag)}
              onOpen={() => open(selected)}
            />
          )}
        </div>

        <div className="h-7 shrink-0 flex items-center px-4 text-12 text-black/50 dark:text-white/55 border-t border-black/5 dark:border-black/40">
          <div className="flex-grow text-center" aria-live="polite">
            {selected
              ? `1 of ${visibleItems.length} selected`
              : `${visibleItems.length} ${visibleItems.length === 1 ? "item" : "items"}`}
            {availableStorage && `, ${availableStorage} available`}
          </div>
          {view === "grid" && (
            <input
              type="range"
              min={40}
              max={112}
              value={iconSize}
              onChange={(e) => setIconSize(Number(e.target.value))}
              className="w-20 h-1 accent-[#0a84ff] hidden sm:block"
              aria-label="Icon size"
            />
          )}
        </div>

        <AlertSheet
          isOpen={isConfirmingEmpty}
          icon={TrashIcon}
          title="Are you sure you want to permanently erase the items in the Trash?"
          message="You can't undo this action."
          confirmLabel="Empty Trash"
          isDestructive
          onConfirm={() => {
            files.emptyTrash();
            setIsConfirmingEmpty(false);
          }}
          onCancel={() => setIsConfirmingEmpty(false)}
        />
      </div>

      <ContextMenu menu={contextMenu.menu} onClose={contextMenu.close} />

      <QuickLook
        item={
          isQuickLookOpen && selected
            ? toQuickLookItem(
                selected,
                canOpen(selected) ? () => open(selected) : undefined
              )
            : null
        }
        onClose={() => setIsQuickLookOpen(false)}
      />
    </div>
  );
};

export default Finder;
