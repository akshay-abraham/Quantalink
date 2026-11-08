import React, { RefObject } from "react";
import Symbol from "../../symbol";
import AddressBar from "./address-bar";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";
import { cn } from "../../../lib/utils";

export interface SafariToolbarProps {
  addressRef: RefObject<HTMLInputElement | null>;
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onBack: () => void;
  onForward: () => void;
  onNavigate: (input: string) => void;
  onReload: () => void;
  onStop: () => void;
  onShare: () => void;
  onNewTab: () => void;
  onShowTabs: () => void;
}

const SafariToolbar: React.FC<SafariToolbarProps> = ({
  addressRef,
  url,
  isLoading,
  canGoBack,
  canGoForward,
  isSidebarOpen,
  onToggleSidebar,
  onBack,
  onForward,
  onNavigate,
  onReload,
  onStop,
  onShare,
  onNewTab,
  onShowTabs,
}) => (
  <Toolbar
    className="safari-toolbar"
    hasControls
    leading={
      <>
        <ToolbarGroup>
          <button
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            aria-pressed={isSidebarOpen}
            onClick={onToggleSidebar}
            className={cn(
              "h-7 px-2 rounded-full flex items-center gap-1.5 text-black/75 dark:text-white/85 active:bg-black/10 dark:active:bg-white/15",
              isSidebarOpen && "bg-black/10 dark:bg-white/15"
            )}
          >
            <Symbol name="sidebar-left" className="w-[18px] h-[18px]" />
            <Symbol name="chevron-down" className="w-2.5 h-2.5 opacity-70" />
          </button>
        </ToolbarGroup>
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
      </>
    }
    center={
      <AddressBar
        ref={addressRef}
        url={url}
        isLoading={isLoading}
        onSubmit={onNavigate}
        onReload={onReload}
        onStop={onStop}
      />
    }
    trailing={
      <ToolbarGroup>
        <ToolbarButton
          symbol="square-and-arrow-up"
          title="Share"
          disabled={!url}
          onClick={onShare}
        />
        <ToolbarButton symbol="plus" title="New Tab" onClick={onNewTab} />
        <ToolbarButton
          symbol="square-on-square"
          title="Show Tab Overview"
          onClick={onShowTabs}
        />
      </ToolbarGroup>
    }
  />
);

export default SafariToolbar;
