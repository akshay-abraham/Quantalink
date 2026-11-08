"use client";

import React from "react";
import Symbol from "../symbol";
import { useBattery } from "../../hooks/use-battery";
import { cn } from "../../lib/utils";

export const BatteryStatus: React.FC = () => {
  const battery = useBattery();
  if (!battery) return null;

  const percentage = Math.round(battery.level * 100);

  return (
    <div
      className="hidden sm:flex items-center h-6 px-2.5"
      title={`Battery ${percentage}%${battery.charging ? ", charging" : ""}`}
    >
      <div className="relative w-[25px] h-[12px] rounded-[4px] border border-current p-[1.5px] opacity-90">
        <div
          className={cn(
            "h-full rounded-[2px]",
            percentage <= 20 && !battery.charging ? "bg-red-500" : "bg-current"
          )}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] rounded-r-sm bg-current" />
        {battery.charging && (
          <Symbol
            name="bolt-fill"
            className="absolute inset-0 m-auto w-2 h-2 text-black"
          />
        )}
      </div>
    </div>
  );
};
