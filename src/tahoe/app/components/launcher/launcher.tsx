"use client";

import { useOverlays } from "../../context/overlay-context";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppIcon from "../dock/app-icon";
import Symbol from "../symbol";
import { apps } from "../../lib/apps";
import { useWindows } from "../../context/window-context";

const Launcher: React.FC = () => {
  const { isLauncherOpen, setLauncherOpen } = useOverlays();
  const { openApp } = useWindows();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLauncherOpen) return setSearch("");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLauncherOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLauncherOpen, setLauncherOpen]);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const launch = (id: (typeof apps)[number]["id"]) => {
    openApp(id);
    setLauncherOpen(false);
  };

  return (
    <AnimatePresence>
      {isLauncherOpen && (
        <motion.div
          className="absolute inset-0 z-launcher bg-black/30 backdrop-blur-3xl flex flex-col items-center pt-[8vh] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLauncherOpen(false);
          }}
        >
          <div className="flex items-center gap-2 w-60 h-9 px-3 rounded-full bg-white/15 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)]">
            <Symbol name="magnifyingglass" className="w-3.5 h-3.5 opacity-70" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredApps[0])
                  launch(filteredApps[0].id);
              }}
              placeholder="Search"
              className="flex-grow bg-transparent outline-none text-14 placeholder:text-white/60"
            />
          </div>
          <motion.div
            className="grid grid-cols-[repeat(auto-fill,120px)] justify-center gap-x-8 gap-y-6 w-full max-w-5xl px-8 mt-[8vh]"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.08 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setLauncherOpen(false);
            }}
          >
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => launch(app.id)}
                className="flex flex-col items-center gap-2 cursor-default"
              >
                <div className="relative w-24 h-24 active:brightness-75">
                  <AppIcon icon={app.icon} />
                </div>
                <span className="text-13 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                  {app.name}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Launcher;
