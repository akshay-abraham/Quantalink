"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSystem } from "../../context/system-context";
import { useContent } from "../../context/content-context";

const Wallpaper: React.FC = () => {
  const { wallpaper, phase } = useSystem();
  const reduceMotion = useReducedMotion();
  const { wallpapers } = useContent().system;
  const selected =
    wallpaper === "dynamic-tahoe" && phase ? `tahoe-${phase}` : wallpaper;
  const current = wallpapers.find((w) => w.id === selected) ?? wallpapers[0];

  return (
    <div className="absolute inset-0 bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={current.id}
          className="absolute inset-0"
          style={{ background: current.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          {current.src && (
            <Image
              src={current.src}
              alt={current.name}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              unoptimized
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Wallpaper;
