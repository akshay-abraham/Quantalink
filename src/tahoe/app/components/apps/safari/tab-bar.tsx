import React from "react";
import Symbol from "../../symbol";
import { BrowserTab, tabUrl } from "./tabs";
import { getTabTitle } from "./tab-label";
import { cn } from "../../../lib/utils";

interface TabBarProps {
  tabs: BrowserTab[];
  activeId: number;
  onSelect: (id: number) => void;
  onClose: (id: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeId,
  onSelect,
  onClose,
}) => (
  <div
    role="tablist"
    className="flex overflow-x-auto gap-1 px-2.5 pb-2 shrink-0"
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeId;
      return (
        <div
          key={tab.id}
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(tab.id)}
          className={cn(
            "group relative flex-1 min-w-0 max-md:min-w-[140px] h-11 md:h-7 flex items-center justify-center px-7 rounded-full text-12",
            isActive
              ? "bg-black/[0.07] dark:bg-white/[0.12] font-medium"
              : "text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
          )}
        >
          <button
            aria-label={`Close ${getTabTitle(tabUrl(tab))}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
            className="absolute left-1.5 w-6 h-6 md:w-4 md:h-4 rounded-full flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/15"
          >
            <Symbol name="xmark" className="w-2 h-2" />
          </button>
          <span className="truncate">{getTabTitle(tabUrl(tab))}</span>
        </div>
      );
    })}
  </div>
);

export default TabBar;
