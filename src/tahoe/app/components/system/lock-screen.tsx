"use client";

import React, { useEffect, useState } from "react";
import Wallpaper from "./wallpaper";
import Avatar from "../avatar";
import { useContent } from "../../context/content-context";

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const { profile } = useContent();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    window.addEventListener("keydown", onUnlock);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onUnlock);
    };
  }, [onUnlock]);

  return (
    <div
      className="relative h-full flex flex-col items-center justify-between py-[10vh] text-white cursor-default select-none"
      onClick={onUnlock}
    >
      <Wallpaper />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />
      <div className="relative text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="text-20 font-semibold opacity-90">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="text-96 font-bold tracking-tight">
          {now
            .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
            .replace(/\s?[AP]M/, "")}
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-2">
        <Avatar className="w-16 h-16 text-24 ring-2 ring-white/30" />
        <div className="font-semibold">{profile.name}</div>
        <div className="text-12 opacity-70">
          Click or press any key to unlock
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
