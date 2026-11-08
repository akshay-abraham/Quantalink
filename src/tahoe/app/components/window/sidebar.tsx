import React, { useState } from "react";
import Symbol from "../symbol";
import { cn } from "../../lib/utils";
import { useWindowFocus } from "./window-focus";
import { FILE_DRAG_TYPE } from "../../context/file-context";

export interface SidebarItem {
  id: string;
  label: string;
  symbol?: string;
  dot?: string;
  icon?: React.ReactNode;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDropItem?: (id: string, fileId: string) => void;
  header?: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  selectedId,
  onSelect,
  onDropItem,
  header,
  className,
}) => {
  const isFocused = useWindowFocus();
  const [isBrowsing, setIsBrowsing] = useState(false);

  return (
    <>
      <div className="mobile-sidebar-select">
        <button
          className="mobile-browse-button"
          onClick={() => setIsBrowsing(true)}
        >
          ‹ Browse
        </button>
        {isBrowsing && (
          <div className="mobile-browse-sheet">
            <header className="mobile-navigation">
              <h2>Browse</h2>
              <button onClick={() => setIsBrowsing(false)}>Done</button>
            </header>
            <nav aria-label="Browse folders">
              {sections.map((section, index) => (
                <section key={section.title ?? index}>
                  {section.title && <h3>{section.title}</h3>}
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      aria-current={selectedId === item.id ? "page" : undefined}
                      onClick={() => {
                        onSelect(item.id);
                        setIsBrowsing(false);
                      }}
                    >
                      {item.symbol && (
                        <Symbol
                          name={item.symbol}
                          className="w-5 h-5 text-[#007aff]"
                        />
                      )}
                      <span>{item.label}</span>
                      <span className="ml-auto">›</span>
                    </button>
                  ))}
                </section>
              ))}
            </nav>
          </div>
        )}
      </div>
      <aside
        className={cn(
          "app-sidebar w-[200px] shrink-0 hidden sm:flex flex-col select-none",
          className
        )}
      >
        <div className="handle h-[52px] shrink-0" />
        {header}
        <nav className="flex-grow overflow-y-auto px-2.5 pb-3">
          {sections.map((section, index) => (
            <div key={section.title ?? index} className="mb-3">
              {section.title && (
                <div className="px-2 pb-1 text-11 font-bold text-black/40 dark:text-white/35">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  onDragOver={(e) => {
                    if (
                      !onDropItem ||
                      !e.dataTransfer.types.includes(FILE_DRAG_TYPE)
                    )
                      return;
                    e.preventDefault();
                    e.currentTarget.classList.add("ring-2", "ring-[#0a84ff]");
                  }}
                  onDragLeave={(e) =>
                    e.currentTarget.classList.remove("ring-2", "ring-[#0a84ff]")
                  }
                  onDrop={(e) => {
                    e.currentTarget.classList.remove(
                      "ring-2",
                      "ring-[#0a84ff]"
                    );
                    const fileId = e.dataTransfer.getData(FILE_DRAG_TYPE);
                    if (fileId) onDropItem?.(item.id, fileId);
                  }}
                  className={cn(
                    "w-full h-8 flex items-center gap-2 px-2 rounded-lg text-left text-14 cursor-default",
                    selectedId === item.id && "bg-black/[0.08] dark:bg-white/10"
                  )}
                >
                  {item.symbol && (
                    <Symbol
                      name={item.symbol}
                      className={cn(
                        "w-[18px] h-[18px] transition-colors duration-200",
                        isFocused
                          ? "text-[#007aff] dark:text-[#0a84ff]"
                          : "text-black/40 dark:text-white/40"
                      )}
                    />
                  )}
                  {item.dot && (
                    <span
                      className={cn("w-3 h-3 mx-[3px] rounded-full", item.dot)}
                    />
                  )}
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
