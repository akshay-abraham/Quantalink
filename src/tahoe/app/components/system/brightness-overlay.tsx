"use client";

import React from "react";
import { useSystem } from "../../context/system-context";

const BrightnessOverlay: React.FC = () => {
  const { brightness } = useSystem();

  return (
    <div
      className="absolute inset-0 z-brightness bg-black pointer-events-none"
      style={{ opacity: (1 - brightness) * 0.8 }}
    />
  );
};

export default BrightnessOverlay;
