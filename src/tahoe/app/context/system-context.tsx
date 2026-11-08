"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContent } from "./content-context";
import { SESSION_KEYS, STORAGE_KEYS } from "../lib/constants";
import { readStorage, writeStorage } from "../lib/storage";
import { getTimePhase, isDarkPhase, TimePhase } from "../lib/time-wallpaper";

export type Appearance = "light" | "dark" | "auto";
export type PowerState = "booting" | "locked" | "on" | "sleeping" | "off";

interface SystemContextValue {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  isDark: boolean;
  phase: TimePhase | null;
  wallpaper: string;
  setWallpaper: (id: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  power: PowerState;
  setPower: (state: PowerState) => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

// Safe to read storage during render: providers mount client-side, after content loads.
const usePersistentState = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  const update = useCallback(
    (next: T) => {
      setValue(next);
      writeStorage(key, next);
    },
    [key]
  );

  return [value, update] as const;
};

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { system } = useContent();
  const [appearance, setAppearance] = usePersistentState<Appearance>(
    STORAGE_KEYS.appearance,
    system.defaultAppearance
  );
  const [storedWallpaper, setWallpaper] = usePersistentState(
    STORAGE_KEYS.wallpaper,
    system.defaultWallpaper
  );
  const wallpaper = system.wallpapers.some(
    (item) => item.id === storedWallpaper
  )
    ? storedWallpaper
    : system.defaultWallpaper;
  const [brightness, setBrightness] = usePersistentState(
    STORAGE_KEYS.brightness,
    1
  );
  const [power, setPower] = useState<PowerState>(() =>
    readStorage(SESSION_KEYS.booted, false, "session") ? "on" : "booting"
  );
  const [phase, setPhase] = useState<TimePhase | null>(null);

  useEffect(() => {
    const update = () => setPhase(getTimePhase(new Date()));
    update();
    const interval = window.setInterval(update, 60_000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const autoDark =
    wallpaper === "dynamic-tahoe"
      ? phase !== null && isDarkPhase(phase)
      : !system.wallpapers.find((item) => item.id === wallpaper)?.isLight;
  const isDark = appearance === "auto" ? autoDark : appearance === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
      isDark,
      phase,
      wallpaper,
      setWallpaper,
      brightness,
      setBrightness,
      power,
      setPower,
    }),
    [
      appearance,
      setAppearance,
      isDark,
      phase,
      wallpaper,
      setWallpaper,
      brightness,
      setBrightness,
      power,
    ]
  );

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used inside SystemProvider");
  return context;
};
