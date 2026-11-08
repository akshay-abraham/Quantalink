"use client";

import React, { RefObject, useCallback, useRef, useState } from "react";
import MenuDropdown, { MenuEntry } from "./menubar/menu-dropdown";
import { useClickOutside } from "../hooks/use-click-outside";

const MENU_WIDTH = 250;
const MENU_HEIGHT_ESTIMATE = 220;

interface ContextMenuState {
  x: number;
  y: number;
  entries: MenuEntry[];
}

export function useContextMenu(containerRef: RefObject<HTMLElement | null>) {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const open = useCallback(
    (e: React.MouseEvent, entries: MenuEntry[]) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenu({
        x: Math.max(
          0,
          Math.min(e.clientX - rect.left, rect.width - MENU_WIDTH)
        ),
        y: Math.max(
          0,
          Math.min(e.clientY - rect.top, rect.height - MENU_HEIGHT_ESTIMATE)
        ),
        entries,
      });
    },
    [containerRef]
  );

  const close = useCallback(() => setMenu(null), []);

  return { menu, open, close };
}

interface ContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menu, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, !!menu);

  if (!menu) return null;

  return (
    <div
      ref={ref}
      role="presentation"
      className="absolute z-50"
      style={{ left: menu.x, top: menu.y }}
    >
      <MenuDropdown
        className="top-0 mt-0"
        entries={menu.entries}
        onClose={onClose}
      />
    </div>
  );
};

export default ContextMenu;
