"use client";

import React from "react";
import Image from "next/image";
import { IconSource } from "../../lib/icons";
import { useSystem } from "../../context/system-context";
import { cn } from "../../lib/utils";

interface AppIconProps {
  icon: IconSource;
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ icon, className }) => {
  const { isDark } = useSystem();
  const src = "dark" in icon ? (isDark ? icon.dark : icon.light) : icon;

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="128px"
      draggable={false}
      className={cn("object-contain select-none", className)}
    />
  );
};

export default AppIcon;
