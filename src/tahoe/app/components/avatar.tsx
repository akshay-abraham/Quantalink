"use client";

import React from "react";
import Image from "next/image";
import { cn } from "../lib/utils";
import { useContent } from "../context/content-context";

const Avatar: React.FC<{ className?: string }> = ({ className }) => {
  const { name } = useContent().profile;

  return (
    <div
      className={cn(
        "shrink-0 rounded-full bg-gradient-to-b from-[#a8adb8] to-[#7e838f] flex items-center justify-center text-white font-medium tracking-wide",
        className
      )}
    >
      <Image
        src="/akshay-abraham-aiboomi-portrait.webp"
        alt={name}
        width={128}
        height={128}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
