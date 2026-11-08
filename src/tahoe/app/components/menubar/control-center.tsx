"use client";

import React from "react";
import { motion } from "framer-motion";
import Symbol from "../symbol";
import { useSystem } from "../../context/system-context";
import { useWindows } from "../../context/window-context";
import { useFullscreen } from "../../hooks/use-fullscreen";
import { useOnline } from "../../hooks/use-online";
import { cn } from "../../lib/utils";

interface ControlTileProps {
  symbol: string;
  label: string;
  status: string;
  isActive: boolean;
  onClick?: () => void;
}

const ControlTile: React.FC<ControlTileProps> = ({
  symbol,
  label,
  status,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className="flex items-center gap-2 p-1.5 rounded-xl text-left enabled:hover:bg-black/5 dark:enabled:hover:bg-white/5 cursor-default"
  >
    <span
      className={cn(
        "w-7 h-7 shrink-0 rounded-full flex items-center justify-center",
        isActive ? "bg-[#0a84ff] text-white" : "bg-black/10 dark:bg-white/15"
      )}
    >
      <Symbol name={symbol} className="w-4 h-4" />
    </span>
    <span className="min-w-0">
      <span className="block text-12 font-semibold leading-tight">{label}</span>
      <span className="block text-11 opacity-60 leading-tight truncate">
        {status}
      </span>
    </span>
  </button>
);

const ControlCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { isDark, setAppearance, brightness, setBrightness } = useSystem();
  const { openApp } = useWindows();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isOnline = useOnline();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.16, ease: [0.2, 0.9, 0.3, 1] }}
      style={{ transformOrigin: "top right" }}
      className="absolute right-0 top-full mt-1 w-80 p-3 space-y-2.5 rounded-[24px] bg-[#f4f2f5]/70 dark:bg-[#2a2429]/60 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] text-black dark:text-white [text-shadow:none] font-normal z-50"
    >
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-[18px] bg-white/50 dark:bg-white/[0.08] p-1 flex flex-col">
          <ControlTile
            symbol={isOnline ? "wifi" : "wifi-slash"}
            label="Wi-Fi"
            status={isOnline ? "Connected" : "Offline"}
            isActive={isOnline}
          />
          <ControlTile
            symbol={isDark ? "moon-fill" : "sun-max-fill"}
            label="Dark Mode"
            status={isDark ? "On" : "Off"}
            isActive={isDark}
            onClick={() => setAppearance(isDark ? "light" : "dark")}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="rounded-[18px] bg-white/50 dark:bg-white/[0.08] p-1 flex-grow flex">
            <ControlTile
              symbol={
                isFullscreen
                  ? "arrow-down-right-and-arrow-up-left"
                  : "arrow-up-left-and-arrow-down-right"
              }
              label="Full Screen"
              status={isFullscreen ? "On" : "Off"}
              isActive={isFullscreen}
              onClick={toggleFullscreen}
            />
          </div>
          <div className="rounded-[18px] bg-white/50 dark:bg-white/[0.08] p-1 flex-grow flex">
            <ControlTile
              symbol="photo"
              label="Wallpaper"
              status="Change…"
              isActive={false}
              onClick={() => {
                openApp("settings", "wallpaper");
                onClose();
              }}
            />
          </div>
        </div>
      </div>
      <div className="rounded-[18px] bg-white/50 dark:bg-white/[0.08] px-3 py-2">
        <div className="text-12 font-semibold mb-1.5">Display</div>
        <div className="relative h-6 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white dark:bg-neutral-200"
            style={{ width: `${((brightness - 0.3) / 0.7) * 100}%` }}
          />
          <Symbol
            name="sun-max"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none"
          />
          <input
            type="range"
            min={0.3}
            max={1}
            step={0.01}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-default"
            aria-label="Display brightness"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ControlCenter;
