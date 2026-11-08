"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import AppIcon from "./app-icon";
import MinimizedThumbnail from "./minimized-thumbnail";
import MenuDropdown from "../menubar/menu-dropdown";
import { useClickOutside } from "../../hooks/use-click-outside";
import { DockItem as DockItemData } from "./types";
import { getMagnifiedSize } from "./magnification";
import { FILE_DRAG_TYPE } from "../../context/file-context";
import { cn } from "../../lib/utils";

const MAGNIFY_SPRING = { mass: 0.2, stiffness: 520, damping: 42 };

interface DockItemProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
}

const DockItem: React.FC<DockItemProps> = ({ item, mouseX }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  useClickOutside(containerRef, closeMenu, isMenuOpen);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - bounds.x - bounds.width / 2;
  });
  const size = useSpring(
    useTransform(distance, getMagnifiedSize),
    MAGNIFY_SPRING
  );

  const acceptsDrop = (e: React.DragEvent) =>
    !!item.onDropFile && e.dataTransfer.types.includes(FILE_DRAG_TYPE);

  return (
    <div ref={containerRef} className="relative flex items-end">
      {isMenuOpen && item.menu && (
        <MenuDropdown
          entries={item.menu}
          onClose={closeMenu}
          className="top-auto bottom-full mt-0 mb-3 left-1/2 -translate-x-1/2 min-w-[180px]"
        />
      )}
      <motion.button
        ref={ref}
        aria-label={item.title}
        data-dock-id={item.key}
        style={{ width: size, height: size }}
        onClick={() => {
          closeMenu();
          item.onClick();
        }}
        onContextMenu={(e) => {
          if (!item.menu) return;
          e.preventDefault();
          setIsMenuOpen(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={(e) => {
          if (!acceptsDrop(e)) return;
          e.preventDefault();
          setIsDropTarget(true);
        }}
        onDragLeave={() => setIsDropTarget(false)}
        onDrop={(e) => {
          setIsDropTarget(false);
          const fileId = e.dataTransfer.getData(FILE_DRAG_TYPE);
          if (fileId) item.onDropFile?.(fileId);
        }}
        animate={item.isLaunching ? { y: [0, -26, 0, -13, 0] } : { y: 0 }}
        transition={{
          duration: 0.9,
          times: [0, 0.3, 0.55, 0.78, 1],
          ease: "easeInOut",
        }}
        className="flex items-center justify-center relative"
      >
        <AnimatePresence>
          {isHovered && !isMenuOpen && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, x: "-50%" }}
              animate={{ opacity: 1, x: "-50%" }}
              exit={{ opacity: 0, x: "-50%", transition: { duration: 0.1 } }}
              transition={{ duration: 0.1 }}
              className="absolute left-1/2 -top-[38px] px-2.5 h-[26px] flex items-center whitespace-pre rounded-[8px] text-13 text-white bg-[#1e1e1e]/75 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_0_0_0.5px_rgba(255,255,255,0.18)] pointer-events-none"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
        <span
          className={cn(
            "relative w-full h-full active:brightness-[0.55]",
            isDropTarget && "brightness-[0.6]"
          )}
        >
          {item.isMinimizedWindow ? (
            <MinimizedThumbnail icon={item.icon} />
          ) : (
            <AppIcon icon={item.icon} />
          )}
        </span>
        {item.isRunning && (
          <span
            aria-hidden
            className="absolute -bottom-[5px] w-[5px] h-[5px] rounded-full bg-white/75"
          />
        )}
      </motion.button>
    </div>
  );
};

export default DockItem;
