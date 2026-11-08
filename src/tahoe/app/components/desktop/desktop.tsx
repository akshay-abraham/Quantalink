"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DesktopIcon from "./desktop-icon";
import AppIcon from "../dock/app-icon";
import ContextMenu, { useContextMenu } from "../context-menu";
import QuickLook, { toQuickLookItem } from "../quick-look/quick-look";
import { useMarqueeSelection } from "./use-marquee-selection";
import { useWindows } from "../../context/window-context";
import { useSystem } from "../../context/system-context";
import { useFiles } from "../../context/file-context";
import { useContent } from "../../context/content-context";
import { useOpenTarget } from "../../hooks/use-open-file";
import { buildFileEntries, folderEntry } from "../../lib/file-system";
import { MENUBAR_HEIGHT } from "../../lib/constants";

const ICON_SPACING = 108;
const ICON_MARGIN = 12;

const getIconId = (element: HTMLElement) => element.dataset.iconId ?? "";

const Desktop: React.FC = () => {
  const { openApp, focusDesktop, focusedId } = useWindows();
  const { isDark, setAppearance } = useSystem();
  const files = useFiles();
  const content = useContent();
  const openTarget = useOpenTarget();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isQuickLookOpen, setIsQuickLookOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenu = useContextMenu(containerRef);
  const marquee = useMarqueeSelection(
    containerRef,
    "[data-icon-id]",
    getIconId,
    setSelectedIds
  );

  const entries = useMemo(() => {
    const { cv, about } = buildFileEntries(content);
    return [
      folderEntry("experience", content.profile.username),
      folderEntry("projects", content.profile.username),
      folderEntry("contributions", content.profile.username),
      cv,
      about,
    ];
  }, [content]);

  const visibleEntries = entries
    .filter((entry) => files.isVisible(entry.id))
    .map((entry) => ({ ...entry, name: files.getName(entry.id, entry.name) }));

  const selected =
    selectedIds.length === 1
      ? visibleEntries.find((entry) => entry.id === selectedIds[0])
      : undefined;

  const trashSelected = useCallback(() => {
    files.moveToTrash(
      visibleEntries
        .filter((entry) => entry.canTrash && selectedIds.includes(entry.id))
        .map((entry) => entry.id)
    );
    setSelectedIds([]);
  }, [files, visibleEntries, selectedIds]);

  useEffect(() => {
    if (focusedId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === " " && selected) {
        e.preventDefault();
        setIsQuickLookOpen((isOpen) => !isOpen);
      } else if (e.key === "Backspace" && e.metaKey) {
        trashSelected();
      } else if (e.key === "a" && e.metaKey) {
        e.preventDefault();
        setSelectedIds(visibleEntries.map((entry) => entry.id));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedId, selected, trashSelected, visibleEntries]);

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Desktop"
      aria-multiselectable
      className="absolute inset-x-0 bottom-0"
      style={{ top: MENUBAR_HEIGHT }}
      onPointerDown={(e) => {
        focusDesktop();
        if (e.target !== e.currentTarget || e.button !== 0) return;
        setSelectedIds([]);
        marquee.start({ x: e.clientX, y: e.clientY });
      }}
      onContextMenu={(e) =>
        contextMenu.open(e, [
          { label: "Get Info", onClick: () => openApp("about") },
          {
            label: "Open Experience",
            onClick: () => openApp("finder", "experience"),
          },
          {
            label: "Open Projects",
            onClick: () => openApp("finder", "projects"),
          },
          "separator",
          {
            label: "Change Wallpaper…",
            onClick: () => openApp("settings", "wallpaper"),
          },
          {
            label: isDark ? "Use Light Mode" : "Use Dark Mode",
            onClick: () => setAppearance(isDark ? "light" : "dark"),
          },
          "separator",
          { label: "New Terminal Window", onClick: () => openApp("terminal") },
        ])
      }
    >
      {visibleEntries.map((entry, index) => (
        <DesktopIcon
          key={entry.id}
          id={entry.id}
          icon={<AppIcon icon={entry.icon} />}
          label={entry.name}
          initialPosition={{
            right: ICON_MARGIN,
            top: ICON_MARGIN + ICON_SPACING * index,
          }}
          isSelected={selectedIds.includes(entry.id)}
          isActive={!focusedId}
          onSelect={() =>
            !selectedIds.includes(entry.id) && setSelectedIds([entry.id])
          }
          onOpen={() => openTarget(entry.open)}
          onDrop={(x, y) => {
            const target = document.elementFromPoint(x, y);
            if (entry.canTrash && target?.closest('[data-dock-id="trash"]'))
              files.moveToTrash([entry.id]);
          }}
        />
      ))}

      {marquee.marquee && (
        <div
          aria-hidden
          className="fixed bg-white/15 ring-1 ring-inset ring-white/50 pointer-events-none"
          style={marquee.marquee}
        />
      )}

      <ContextMenu menu={contextMenu.menu} onClose={contextMenu.close} />

      <QuickLook
        item={
          isQuickLookOpen && selected
            ? toQuickLookItem(selected, () => openTarget(selected.open))
            : null
        }
        onClose={() => setIsQuickLookOpen(false)}
      />
    </div>
  );
};

export default Desktop;
