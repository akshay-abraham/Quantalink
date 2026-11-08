"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLatest } from "../../hooks/use-latest";

import AppleLogo from "../../assets/icons/apple.png";

const BOOT_DURATION_MS = 800;
const SETTLE_MS = 150;

const BootScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const done = useLatest(onDone);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(100));
    const timeout = setTimeout(
      () => done.current(),
      BOOT_DURATION_MS + SETTLE_MS
    );
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [done]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-14 bg-black">
      <Image
        src={AppleLogo}
        alt=""
        width={70}
        height={86}
        className="invert"
        priority
      />
      <div className="w-48 h-[5px] rounded-full bg-neutral-700 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-[width] duration-[800ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BootScreen;
