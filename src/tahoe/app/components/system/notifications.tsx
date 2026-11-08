"use client";

import { useNotifications } from "../../context/notification-context";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppIcon from "../dock/app-icon";
import { icons } from "../../lib/icons";
import Symbol from "../symbol";

const Notifications: React.FC = () => {
  const { notifications, dismiss, hold, release } = useNotifications();

  return (
    <div className="absolute right-3 top-10 z-notifications w-[min(340px,calc(100vw-24px))] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onMouseEnter={() => hold(notification.id)}
            onMouseLeave={() => release(notification.id)}
            className="group relative pointer-events-auto flex items-center gap-3 p-3 rounded-[22px] bg-[#f4f2f5]/70 dark:bg-[#2a2429]/60 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] text-black dark:text-white cursor-default"
          >
            <div className="relative w-9 h-9 shrink-0">
              <AppIcon icon={icons.finder} />
            </div>
            <div className="min-w-0 flex-grow text-13 leading-[17px]">
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{notification.title}</span>
                <span className="text-12 text-black/45 dark:text-white/45">
                  now
                </span>
              </div>
              <div className="text-black/80 dark:text-white/80">
                {notification.body}
              </div>
            </div>
            <button
              onClick={() => dismiss(notification.id)}
              className="absolute -left-1.5 -top-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-[#f4f2f5] dark:bg-[#3a3439] shadow ring-[0.5px] ring-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <Symbol name="xmark" className="w-2 h-2" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
