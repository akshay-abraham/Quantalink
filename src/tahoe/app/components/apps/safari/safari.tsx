"use client";

import { useMobile } from "../../../hooks/use-mobile";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AppProps } from "../../../lib/apps";
import { useContent } from "../../../context/content-context";
import { useNotifications } from "../../../context/notification-context";
import { canGoBack, canGoForward } from "../../../lib/history";
import { canEmbed, getHost, toUrl } from "../../../lib/browser";
import { siteFrameUrl } from "../../../lib/site-frame";
import { PortfolioContent } from "../../../lib/content/schema";
import { useWindowFocus } from "../../window/window-focus";
import MobileSafariToolbar from "./mobile-safari-toolbar";
import SafariToolbar from "./safari-toolbar";
import TabBar from "./tab-bar";
import TabOverview from "./tab-overview";
import BookmarksSidebar from "./bookmarks-sidebar";
import StartPage, { START_PAGE } from "./start-page";
import BlockedPage from "./blocked-page";
import { getFavorites } from "./favorites";
import {
  BrowserTab,
  createTabs,
  selectActiveTab,
  tabUrl,
  tabsReducer,
} from "./tabs";

const FALLBACK_HOMEPAGE = "https://en.wikipedia.org";

const getHomepage = ({ system, profile }: PortfolioContent) =>
  system.browser.homepage ?? profile.links.website ?? FALLBACK_HOMEPAGE;

const openInNewTab = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

const frameKey = (tab: BrowserTab) =>
  `${tab.id}-${tabUrl(tab)}-${tab.reloadKey}`;

const Safari: React.FC<AppProps> = ({ payload, openedAt }) => {
  const isMobile = useMobile();
  const content = useContent();
  const { notify } = useNotifications();
  const isFocused = useWindowFocus();
  const homepage = getHomepage(content);
  const favorites = useMemo(
    () => getFavorites(content, homepage),
    [content, homepage]
  );

  const [state, dispatch] = useReducer(tabsReducer, null, () =>
    createTabs(payload ? toUrl(payload) : homepage)
  );
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShowingTabs, setIsShowingTabs] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);
  const hasMounted = useRef(false);

  const activeTab = selectActiveTab(state);
  const url = tabUrl(activeTab);
  const isStartPage = url === START_PAGE;
  const isLoading =
    !isStartPage && canEmbed(url) && !loaded.has(frameKey(activeTab));

  const navigate = (input: string) => {
    const next = input === START_PAGE ? START_PAGE : toUrl(input);
    if (next) dispatch({ type: "navigate", url: next });
    if (isMobile) setIsSidebarOpen(false);
  };

  const openTab = (input = START_PAGE) => {
    dispatch({
      type: "open",
      url: input === START_PAGE ? START_PAGE : toUrl(input),
    });
    setIsShowingTabs(false);
  };

  const markLoaded = (key: string) =>
    setLoaded((current) => new Set(current).add(key));

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ url }).catch(() => undefined);
      return;
    }
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      notify("Link Copied", url);
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      notify("Copy Link", "Touch and hold the selected address to copy it.");
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (payload) openTab(payload);
  }, [payload, openedAt]);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey) return;
      if (e.key === "l") {
        e.preventDefault();
        addressRef.current?.focus();
      } else if (e.key === "r") {
        e.preventDefault();
        dispatch({ type: "reload" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const BrowserToolbar = isMobile ? MobileSafariToolbar : SafariToolbar;
  return (
    <div className="h-full min-h-0 flex flex-col bg-white dark:bg-[#282025]">
      <BrowserToolbar
        addressRef={addressRef}
        url={isStartPage ? "" : url}
        isLoading={isLoading}
        canGoBack={canGoBack(activeTab.history)}
        canGoForward={canGoForward(activeTab.history)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        onBack={() => dispatch({ type: "step", direction: -1 })}
        onForward={() => dispatch({ type: "step", direction: 1 })}
        onNavigate={navigate}
        onReload={() => dispatch({ type: "reload" })}
        onStop={() => markLoaded(frameKey(activeTab))}
        onShare={share}
        onNewTab={() => openTab()}
        onShowTabs={() => setIsShowingTabs((isShowing) => !isShowing)}
      />

      {!isMobile && state.tabs.length > 1 && (
        <TabBar
          tabs={state.tabs}
          activeId={state.activeId}
          onSelect={(id) => dispatch({ type: "select", id })}
          onClose={(id) => dispatch({ type: "close", id })}
        />
      )}

      <div className="relative flex flex-grow min-h-0">
        {isSidebarOpen && (
          <BookmarksSidebar
            favorites={favorites}
            currentUrl={url}
            onOpen={navigate}
          />
        )}

        <div
          className={
            isMobile && isSidebarOpen ? "hidden" : "relative flex-grow min-w-0"
          }
        >
          {isLoading && (
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px] z-10 overflow-hidden"
            >
              <div className="h-full w-1/3 bg-[#0a84ff] animate-[safari-progress_1.2s_ease-in-out_infinite]" />
            </div>
          )}

          {state.tabs.map((tab) => {
            const tabAddress = tabUrl(tab);
            const isActive = tab.id === state.activeId;
            return (
              <div
                key={tab.id}
                className={isActive ? "absolute inset-0" : "hidden"}
              >
                {tabAddress === START_PAGE ? (
                  <StartPage favorites={favorites} onOpen={navigate} />
                ) : canEmbed(tabAddress) ? (
                  <iframe
                    key={frameKey(tab)}
                    src={siteFrameUrl(
                      tabAddress,
                      content.profile.links.website,
                      window.location.origin
                    )}
                    title={getHost(tabAddress)}
                    onLoad={() => markLoaded(frameKey(tab))}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="w-full h-full bg-white"
                  />
                ) : (
                  <BlockedPage
                    host={getHost(tabAddress)}
                    onOpen={() => openInNewTab(tabAddress)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {isShowingTabs && (
          <TabOverview
            tabs={state.tabs}
            activeId={state.activeId}
            onSelect={(id) => {
              dispatch({ type: "select", id });
              setIsShowingTabs(false);
            }}
            onClose={(id) => dispatch({ type: "close", id })}
            onNewTab={() => openTab()}
            onDismiss={() => setIsShowingTabs(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Safari;
