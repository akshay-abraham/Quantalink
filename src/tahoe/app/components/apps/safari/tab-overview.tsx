import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Symbol from "../../symbol";
import { BrowserTab, tabUrl } from "./tabs";
import { getTabTitle } from "./tab-label";
import { cn } from "../../../lib/utils";

interface TabOverviewProps {
  tabs: BrowserTab[];
  activeId: number;
  onSelect: (id: number) => void;
  onClose: (id: number) => void;
  onNewTab: () => void;
  onDismiss: () => void;
}

const TabOverview: React.FC<TabOverviewProps> = ({
  tabs,
  activeId,
  onSelect,
  onClose,
  onNewTab,
  onDismiss,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      onClick={(e) => e.target === e.currentTarget && onDismiss()}
      className="safari-tab-overview absolute inset-0 z-20 overflow-y-auto p-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] content-start gap-6 bg-[#e8e6ea] dark:bg-[#211b20]"
    >
      <header className="safari-tabs-header">
        <span>
          {tabs.length} {tabs.length === 1 ? "Tab" : "Tabs"}
        </span>
        <button onClick={onDismiss}>Done</button>
      </header>
      {tabs.map((tab) => {
        const title = getTabTitle(tabUrl(tab));
        return (
          <div key={tab.id} className="group relative">
            <button
              onClick={() => onSelect(tab.id)}
              className={cn(
                "w-full aspect-[4/3] rounded-xl flex items-center justify-center text-36 font-semibold uppercase bg-white dark:bg-[#2f282e] shadow-md",
                tab.id === activeId && "ring-[3px] ring-[#0a84ff]"
              )}
            >
              {title[0]}
            </button>
            <div className="mt-2 text-12 text-center truncate">{title}</div>
            {tabs.length > 1 && (
              <button
                aria-label={`Close ${title}`}
                onClick={() => onClose(tab.id)}
                className="absolute -left-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center bg-[#f4f2f5] dark:bg-[#3a3439] shadow opacity-100 md:opacity-0 group-hover:opacity-100"
              >
                <Symbol name="xmark" className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onNewTab}
        aria-label="New Tab"
        className="aspect-[4/3] rounded-xl flex items-center justify-center border-2 border-dashed border-black/15 dark:border-white/15 text-black/40 dark:text-white/40"
      >
        <Symbol name="plus" className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default TabOverview;
