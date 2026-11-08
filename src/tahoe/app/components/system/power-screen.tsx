"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Symbol from "../symbol";
import { useSystem } from "../../context/system-context";
import BootScreen from "./boot-screen";
import LockScreen from "./lock-screen";
import { SESSION_KEYS } from "../../lib/constants";
import { writeStorage } from "../../lib/storage";
import { useNotifications } from "../../context/notification-context";
import { useContent } from "../../context/content-context";

const WELCOME_DELAY_MS = 800;

const PowerScreen: React.FC = () => {
  const { system } = useContent();
  const { power, setPower } = useSystem();
  const { notify } = useNotifications();

  const finishBoot = () => {
    writeStorage(SESSION_KEYS.booted, true, "session");
    setPower("on");
    setTimeout(
      () => notify(system.welcome.title, system.welcome.body),
      WELCOME_DELAY_MS
    );
  };

  return (
    <AnimatePresence>
      {power !== "on" && (
        <motion.div
          key={power}
          className="absolute inset-0 z-power"
          initial={{ opacity: power === "booting" ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5 }}
        >
          {power === "booting" && <BootScreen onDone={finishBoot} />}
          {power === "locked" && <LockScreen onUnlock={() => setPower("on")} />}
          {power === "sleeping" && (
            <div
              className="h-full bg-black"
              onClick={() => setPower("locked")}
              onKeyDown={() => setPower("locked")}
              tabIndex={0}
              ref={(el) => el?.focus()}
            />
          )}
          {power === "off" && (
            <div className="h-full bg-black flex items-center justify-center">
              <button
                onClick={() => setPower("booting")}
                className="group flex flex-col items-center gap-3 text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                <span className="w-14 h-14 rounded-full ring-1 ring-current flex items-center justify-center">
                  <Symbol name="power" className="w-6 h-6" />
                </span>
                <span className="text-12 opacity-0 group-hover:opacity-100 transition-opacity">
                  Power On
                </span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PowerScreen;
