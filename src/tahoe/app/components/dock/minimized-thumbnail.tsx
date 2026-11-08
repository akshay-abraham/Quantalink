import React from "react";
import AppIcon from "./app-icon";
import { IconSource } from "../../lib/icons";

const MinimizedThumbnail: React.FC<{ icon: IconSource }> = ({ icon }) => (
  <div className="absolute inset-[8%] rounded-[6px] bg-[#e8e6ea] dark:bg-[#3a3039] shadow-[0_2px_6px_rgba(0,0,0,0.35)] ring-[0.5px] ring-black/30 overflow-hidden">
    <div className="flex gap-[2px] p-[4px]">
      <span className="w-[4px] h-[4px] rounded-full bg-[#ff5f57]" />
      <span className="w-[4px] h-[4px] rounded-full bg-[#febc2e]" />
      <span className="w-[4px] h-[4px] rounded-full bg-[#28c840]" />
    </div>
    <div className="absolute right-[-6%] bottom-[-6%] w-[55%] h-[55%]">
      <AppIcon icon={icon} />
    </div>
  </div>
);

export default MinimizedThumbnail;
