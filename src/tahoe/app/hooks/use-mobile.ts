"use client";

import { useSyncExternalStore } from "react";
import { MOBILE_BREAKPOINT } from "../lib/constants";

const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

export const useMobile = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
