"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppIcon from "../dock/app-icon";
import Symbol from "../symbol";
import { IconSource } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { FileEntry, canOpen } from "../../lib/file-system";

export interface QuickLookItem {
  id: string;
  name: string;
  kind: string;
  icon: IconSource;
  preview?: string;
  description?: string;
  tags?: string[];
  openLabel?: string;
  onOpen?: () => void;
}

interface QuickLookProps {
  item: QuickLookItem | null;
  onClose: () => void;
}

const QuickLook: React.FC<QuickLookProps> = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === "Escape" || (e.key === " " && !isTyping(e))) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="quick-look"
          className={cn(
            "fixed left-1/2 top-1/2 z-quick-look flex flex-col overflow-hidden rounded-[22px] bg-[#f4f2f5]/85 dark:bg-[#2a2429]/85 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_30px_80px_rgba(0,0,0,0.5),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] ring-[0.5px] ring-black/40 text-black/85 dark:text-white/90",
            item.preview
              ? "w-[min(720px,92vw)] h-[min(820px,82vh)]"
              : "w-[min(440px,92vw)]"
          )}
          initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
          animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
          exit={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        >
          <div className="h-11 shrink-0 flex items-center gap-2 px-3">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center active:bg-black/10 dark:active:bg-white/15"
              aria-label="Close"
            >
              <Symbol name="xmark" className="w-3 h-3" />
            </button>
            <div className="flex-grow text-center text-13 font-semibold truncate">
              {item.name}
            </div>
            {item.onOpen ? (
              <button
                onClick={() => {
                  item.onOpen?.();
                  onClose();
                }}
                className="h-7 px-3 rounded-full text-12 font-medium bg-black/5 dark:bg-white/10 active:bg-black/10 dark:active:bg-white/20"
              >
                {item.openLabel ?? "Open"}
              </button>
            ) : (
              <div className="w-7" />
            )}
          </div>
          {item.preview ? (
            <iframe
              src={`${item.preview}#toolbar=0&navpanes=0&view=FitH`}
              title={item.name}
              className="flex-grow w-full bg-[#525659]"
            />
          ) : (
            <div className="flex flex-col items-center text-center px-8 pt-2 pb-8">
              <div className="relative w-40 h-40">
                <AppIcon icon={item.icon} />
              </div>
              <div className="text-20 font-semibold mt-2">{item.name}</div>
              <div className="text-12 text-black/50 dark:text-white/50">
                {item.kind}
              </div>
              {item.description && (
                <p className="text-13 leading-relaxed mt-4 text-black/75 dark:text-white/75">
                  {item.description}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-11"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const isTyping = (e: KeyboardEvent) =>
  (e.target as HTMLElement).closest("input, textarea") !== null;

export default QuickLook;

export const toQuickLookItem = (
  entry: FileEntry,
  onOpen?: () => void
): QuickLookItem => ({
  id: entry.id,
  name: entry.name,
  kind: entry.info?.subtitle ?? entry.kind,
  icon: entry.icon,
  preview: entry.preview,
  description: entry.info?.description,
  tags: entry.info?.tags,
  openLabel: entry.preview
    ? "Open with Preview"
    : entry.open.type === "url"
      ? "Open Link"
      : "Open",
  onOpen: canOpen(entry) ? onOpen : undefined,
});
