import React, { useState } from "react";
import Symbol from "../../symbol";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";
import { FinderView } from "./navigation";

interface FinderToolbarProps {
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  view: FinderView;
  onViewChange: (view: FinderView) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const FinderToolbar: React.FC<FinderToolbarProps> = ({
  title,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  view,
  onViewChange,
  search,
  onSearchChange,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <Toolbar
      className="max-sm:pl-[92px]"
      title={title}
      leading={
        <ToolbarGroup>
          <ToolbarButton
            symbol="chevron-left"
            title="Back"
            disabled={!canGoBack}
            onClick={onBack}
          />
          <div className="w-px h-4 bg-black/10 dark:bg-white/15" />
          <ToolbarButton
            symbol="chevron-right"
            title="Forward"
            disabled={!canGoForward}
            onClick={onForward}
          />
        </ToolbarGroup>
      }
      trailing={
        <>
          <ToolbarGroup className="hidden md:flex">
            <ToolbarButton
              symbol="square-grid-2x2"
              title="Icons"
              isActive={view === "grid"}
              onClick={() => onViewChange("grid")}
            />
            <ToolbarButton
              symbol="list-bullet"
              title="List"
              isActive={view === "list"}
              onClick={() => onViewChange("list")}
            />
          </ToolbarGroup>
          {isSearching ? (
            <ToolbarGroup className="px-3 gap-1.5 ring-[3px] ring-[#0a84ff]/50">
              <Symbol
                name="magnifyingglass"
                className="w-3.5 h-3.5 opacity-60"
              />
              <input
                autoFocus
                aria-label="Search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={() => !search && setIsSearching(false)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") return;
                  onSearchChange("");
                  setIsSearching(false);
                }}
                placeholder="Search"
                className="w-32 bg-transparent outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
              />
            </ToolbarGroup>
          ) : (
            <ToolbarGroup className="px-0.5">
              <ToolbarButton
                symbol="magnifyingglass"
                title="Search"
                onClick={() => setIsSearching(true)}
              />
            </ToolbarGroup>
          )}
        </>
      }
    />
  );
};

export default FinderToolbar;
