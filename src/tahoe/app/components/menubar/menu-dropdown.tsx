"use client";

import React, { useEffect, useState } from "react";
import Symbol from "../symbol";
import { cn } from "../../lib/utils";

export type MenuEntry =
  | {
      label: string;
      onClick?: () => void;
      disabled?: boolean;
      checked?: boolean;
      requiresUserActivation?: boolean;
    }
  | "separator";

interface MenuDropdownProps {
  entries: MenuEntry[];
  onClose: () => void;
  className?: string;
}

type MenuItem = Exclude<MenuEntry, "separator">;

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  entries,
  onClose,
  className,
}) => {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const isEnabled = (index: number) => {
    const entry = entries[index];
    return entry !== "separator" && !entry.disabled;
  };

  const select = (index: number) => {
    if (selected !== null || !isEnabled(index)) return;
    const entry = entries[index] as MenuItem;
    if (entry.requiresUserActivation) entry.onClick?.();
    setSelected(index);
    setTimeout(() => setIsClosing(true), 170);
    setTimeout(() => {
      if (!entry.requiresUserActivation) entry.onClick?.();
      onClose();
    }, 300);
  };

  useEffect(() => {
    const move = (direction: 1 | -1) => {
      let next = highlighted ?? (direction === 1 ? -1 : entries.length);
      do next += direction;
      while (next >= 0 && next < entries.length && !isEnabled(next));
      if (next >= 0 && next < entries.length) setHighlighted(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") move(1);
      else if (e.key === "ArrowUp") move(-1);
      else if (e.key === "Enter" && highlighted !== null) select(highlighted);
      else return;
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div
      role="menu"
      className={cn(
        "absolute top-full mt-1 min-w-[240px] p-[5px] rounded-[13px] bg-[#f4f2f5]/80 dark:bg-[#2a2429]/75 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] ring-[0.5px] ring-black/30 text-13 font-normal [text-shadow:none] text-black dark:text-white [--menu-text:black] dark:[--menu-text:white] z-50 transition-opacity duration-[130ms]",
        isClosing && "opacity-0",
        selected !== null && "pointer-events-none",
        className
      )}
      onMouseLeave={() => selected === null && setHighlighted(null)}
    >
      {entries.map((entry, index) =>
        entry === "separator" ? (
          <div
            key={index}
            role="separator"
            className="h-px my-[5px] mx-2.5 bg-black/10 dark:bg-white/10"
          />
        ) : (
          <button
            key={entry.label}
            role={entry.checked === undefined ? "menuitem" : "menuitemcheckbox"}
            aria-checked={entry.checked}
            disabled={entry.disabled}
            onMouseEnter={() => setHighlighted(entry.disabled ? null : index)}
            onClick={() => select(index)}
            className={cn(
              "w-full h-[24px] flex items-center pl-1.5 pr-5 rounded-[7px] text-left disabled:opacity-30",
              highlighted === index && "bg-[#0a84ff] text-white",
              selected === index && "animate-[menu-blink_80ms_steps(1)_2]"
            )}
          >
            <span className="w-4 shrink-0">
              {entry.checked && (
                <Symbol name="checkmark" className="w-[11px] h-[11px]" />
              )}
            </span>
            {entry.label}
          </button>
        )
      )}
    </div>
  );
};

export default MenuDropdown;
