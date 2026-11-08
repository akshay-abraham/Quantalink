"use client";

import React from "react";
import { Appearance, useSystem } from "../../../../context/system-context";
import { cn } from "../../../../lib/utils";
import { SettingsGroup, SettingsRow } from "../settings-ui";

const appearanceOptions: { id: Appearance; label: string; preview: string }[] =
  [
    {
      id: "auto",
      label: "Auto",
      preview: "bg-[linear-gradient(135deg,#e5e5e5_50%,#2c2c2e_50%)]",
    },
    {
      id: "light",
      label: "Light",
      preview: "bg-gradient-to-br from-[#f5f5f7] to-[#d1d1d6]",
    },
    {
      id: "dark",
      label: "Dark",
      preview: "bg-gradient-to-br from-[#48484a] to-[#1c1c1e]",
    },
  ];

const AppearancePane: React.FC = () => {
  const { appearance, setAppearance } = useSystem();

  return (
    <SettingsGroup>
      <SettingsRow label="Appearance">
        <div className="flex gap-3 py-1">
          {appearanceOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setAppearance(option.id)}
              className="flex flex-col items-center gap-1.5 cursor-default"
            >
              <div
                className={cn(
                  "w-[68px] h-[44px] rounded-lg ring-1 ring-black/10",
                  option.preview,
                  appearance === option.id && "ring-[3px] ring-[#0a84ff]"
                )}
              />
              <span
                className={cn(
                  "text-11",
                  appearance === option.id
                    ? "font-semibold"
                    : "text-black/60 dark:text-white/60"
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </SettingsRow>
    </SettingsGroup>
  );
};

export default AppearancePane;
