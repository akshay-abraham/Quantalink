"use client";

import React from "react";
import Symbol from "../../../symbol";
import { useSystem } from "../../../../context/system-context";
import { SettingsGroup, SettingsRow } from "../settings-ui";

const DisplaysPane: React.FC = () => {
  const { brightness, setBrightness } = useSystem();

  return (
    <SettingsGroup>
      <SettingsRow label="Brightness">
        <div className="flex items-center gap-2 w-56 max-w-full">
          <Symbol name="sun-max" className="w-3 h-3 opacity-50" />
          <input
            type="range"
            min={0.3}
            max={1}
            step={0.01}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-grow accent-[#0a84ff]"
          />
          <Symbol name="sun-max" className="w-4 h-4 opacity-70" />
        </div>
      </SettingsRow>
    </SettingsGroup>
  );
};

export default DisplaysPane;
