"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppIcon from "../dock/app-icon";
import { IconSource } from "../../lib/icons";

interface AlertSheetProps {
  isOpen: boolean;
  icon: IconSource;
  title: string;
  message: string;
  confirmLabel: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertSheet: React.FC<AlertSheetProps> = ({
  isOpen,
  icon,
  title,
  message,
  confirmLabel,
  isDestructive,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-30 flex justify-center bg-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="mt-14 w-[260px] h-fit p-4 rounded-[22px] flex flex-col items-center text-center bg-[#f4f2f5]/90 dark:bg-[#2f292e]/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_0_0_0.5px_rgba(255,255,255,0.2)] ring-[0.5px] ring-black/40"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 40 }}
          >
            <div className="relative w-16 h-16">
              <AppIcon icon={icon} />
            </div>
            <div className="text-13 font-bold mt-3">{title}</div>
            <div className="text-11 mt-1.5 text-black/70 dark:text-white/70">
              {message}
            </div>
            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                onClick={onConfirm}
                className={
                  isDestructive
                    ? "h-7 rounded-full text-13 text-white bg-[#ff453a] active:brightness-90"
                    : "h-7 rounded-full text-13 text-white bg-[#0a84ff] active:brightness-90"
                }
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="h-7 rounded-full text-13 bg-black/5 dark:bg-white/10 active:bg-black/10 dark:active:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertSheet;
