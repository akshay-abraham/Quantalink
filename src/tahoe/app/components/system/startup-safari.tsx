"use client";

import { useEffect, useRef } from "react";
import { useWindows } from "../../context/window-context";
import { SITE_URL } from "../../lib/content/site";

export default function StartupSafari() {
  const { openApp } = useWindows();
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current || !window.matchMedia("(min-width: 768px)").matches)
      return;
    opened.current = true;
    openApp("safari", SITE_URL);
  }, [openApp]);

  return null;
}
