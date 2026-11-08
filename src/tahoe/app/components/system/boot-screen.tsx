"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useIsPresent } from "framer-motion";
import { useLatest } from "../../hooks/use-latest";

import AppleLogo from "../../assets/icons/apple.png";

const TICK_MS = 90;
const SETTLE_MS = 400;

const BootScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const isPresent = useIsPresent();
  const done = useLatest(onDone);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + Math.random() * 9 + 2));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100 || !isPresent) return;
    const timeout = setTimeout(() => done.current(), SETTLE_MS);
    return () => clearTimeout(timeout);
  }, [progress, isPresent, done]);

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
          className="h-full bg-white rounded-full transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BootScreen;
