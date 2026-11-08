"use client";

import React, { useRef, useState } from "react";
import DateTimeDisplay from "./date-time-display";
import MenuDropdown from "./menu-dropdown";
import { useMenus } from "./use-menus";
import ControlCenter from "./control-center";
import { BatteryStatus } from "./status-icons";
import Symbol from "../symbol";
import { useWindows } from "../../context/window-context";
import { useSystem } from "../../context/system-context";
import { useOverlays } from "../../context/overlay-context";
import { useNotifications } from "../../context/notification-context";
import { useClickOutside } from "../../hooks/use-click-outside";
import { useFullscreen } from "../../hooks/use-fullscreen";
import { useContent } from "../../context/content-context";
import { cn } from "../../lib/utils";
import { MENUBAR_HEIGHT } from "../../lib/constants";

interface MenuItemProps {
  label: React.ReactNode;
  isOpen: boolean;
  className?: string;
  onClick: () => void;
  onHover: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  isOpen,
  className,
  onClick,
  onHover,
}) => (
  <button
    aria-haspopup="menu"
    aria-expanded={isOpen}
    className={cn(
      "h-6 px-2.5 flex items-center rounded-full",
      isOpen && "bg-white/20",
      className
    )}
    onClick={onClick}
    onMouseEnter={onHover}
  >
    {label}
  </button>
);

const Menubar: React.FC = () => {
  const { fullscreenId } = useWindows();
  const { wallpaper } = useSystem();
  const { setSpotlightOpen } = useOverlays();
  const { notify } = useNotifications();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { system } = useContent();
  const isLightWallpaper = !!system.wallpapers.find((w) => w.id === wallpaper)
    ?.isLight;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isHidden = !!fullscreenId && !isRevealed && !openMenu;
  const menubarRef = useRef<HTMLElement>(null);

  useClickOutside(menubarRef, () => setOpenMenu(null), openMenu !== null);

  const menus = useMenus();

  return (
    <>
      {fullscreenId && (
        <div
          className="fixed inset-x-0 top-0 h-1.5"
          onMouseEnter={() => setIsRevealed(true)}
        />
      )}
      <nav
        ref={menubarRef}
        onMouseLeave={() => setIsRevealed(false)}
        style={{ height: MENUBAR_HEIGHT }}
        className={cn(
          "flex justify-between items-center text-13 font-medium transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          fullscreenId
            ? "bg-[#ececec]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-2xl text-black dark:text-white"
            : isLightWallpaper
              ? "text-black"
              : "text-white [text-shadow:0_0_8px_rgba(0,0,0,0.25)]",
          isHidden && "-translate-y-full"
        )}
      >
        <div className="flex items-center h-full pl-2.5">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={cn(
                "relative",
                !["apple", "app"].includes(menu.id) && "hidden md:block"
              )}
            >
              <MenuItem
                label={menu.label}
                isOpen={openMenu === menu.id}
                className={menu.id === "apple" ? "px-3.5" : undefined}
                onClick={() =>
                  setOpenMenu(openMenu === menu.id ? null : menu.id)
                }
                onHover={() => openMenu && setOpenMenu(menu.id)}
              />
              {openMenu === menu.id && (
                <MenuDropdown
                  entries={menu.entries}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center h-full mr-2.5 gap-0.5">
          <BatteryStatus />
          <button
            type="button"
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            title={isFullscreen ? "Exit full screen" : "Enter full screen"}
            aria-pressed={isFullscreen}
            onClick={async () => {
              setOpenMenu(null);
              if (!(await toggleFullscreen()))
                notify(
                  "Full screen unavailable",
                  "This browser or embedded preview does not allow full screen."
                );
            }}
            className="menubar-fullscreen-button h-6 min-w-6 px-1.5 flex items-center justify-center rounded-full"
          >
            <Symbol
              name={
                isFullscreen
                  ? "arrow-down-right-and-arrow-up-left"
                  : "arrow-up-left-and-arrow-down-right"
              }
              className="w-3.5 h-3.5"
            />
          </button>
          <MenuItem
            isOpen={false}
            onClick={() => {
              setOpenMenu(null);
              setSpotlightOpen(true);
            }}
            onHover={() => {}}
            label={
              <Symbol name="magnifyingglass" className="w-[15px] h-[15px]" />
            }
          />
          <div className="relative">
            <MenuItem
              isOpen={openMenu === "control-center"}
              onClick={() =>
                setOpenMenu(
                  openMenu === "control-center" ? null : "control-center"
                )
              }
              onHover={() => openMenu && setOpenMenu("control-center")}
              label={<Symbol name="switch-2" className="w-[17px] h-[15px]" />}
            />
            {openMenu === "control-center" && (
              <ControlCenter onClose={() => setOpenMenu(null)} />
            )}
          </div>
          <div className="flex gap-2 px-2.5">
            <DateTimeDisplay />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Menubar;
