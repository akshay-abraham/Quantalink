"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface OverlayContextValue {
  isSpotlightOpen: boolean;
  setSpotlightOpen: (isOpen: boolean) => void;
  isLauncherOpen: boolean;
  setLauncherOpen: (isOpen: boolean) => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSpotlightOpen, setSpotlightOpen] = useState(false);
  const [isLauncherOpen, setLauncherOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSpotlightOpen,
      setSpotlightOpen,
      isLauncherOpen,
      setLauncherOpen,
    }),
    [isSpotlightOpen, isLauncherOpen]
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
};

export const useOverlays = () => {
  const context = useContext(OverlayContext);
  if (!context)
    throw new Error("useOverlays must be used inside OverlayProvider");
  return context;
};
