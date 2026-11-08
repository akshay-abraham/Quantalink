import React from "react";
import { MenuEntry } from "./menu-dropdown";
import Symbol from "../symbol";
import { useWindows } from "../../context/window-context";
import { useSystem } from "../../context/system-context";
import { useNotifications } from "../../context/notification-context";
import { useContent } from "../../context/content-context";
import { getApp } from "../../lib/apps";
import { SESSION_KEYS } from "../../lib/constants";
import { removeStorage } from "../../lib/storage";
import { useOpenTarget } from "../../hooks/use-open-file";
import { useFullscreen } from "../../hooks/use-fullscreen";

export interface Menu {
  id: string;
  label: React.ReactNode;
  isPrimary?: boolean;
  entries: MenuEntry[];
}

export function useMenus(): Menu[] {
  const {
    windows,
    focusedId,
    openApp,
    closeApp,
    minimizeApp,
    focusApp,
    toggleMaximize,
    toggleFullscreen: toggleWindowFullscreen,
    fullscreenId,
    closeAll,
  } = useWindows();
  const {
    isFullscreen: isBrowserFullscreen,
    toggleFullscreen: toggleBrowserFullscreen,
  } = useFullscreen();
  const { isDark, setAppearance, setPower } = useSystem();
  const { notify } = useNotifications();
  const { profile, experiences } = useContent();
  const { links } = profile;
  const openTarget = useOpenTarget();

  const focusedApp = focusedId ? getApp(focusedId) : null;
  const appName = focusedApp?.name ?? "Finder";

  const copy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => notify("Copied", `${label} copied to clipboard.`));
  };

  const shutDown = (state: "booting" | "off") => {
    closeAll();
    removeStorage(SESSION_KEYS.booted, "session");
    setPower(state);
  };

  return [
    {
      id: "apple",
      label: (
        <>
          <Symbol name="applelogo" className="w-[15px] h-[17px] mt-[-2px]" />
          <span className="sr-only">Apple</span>
        </>
      ),
      entries: [
        { label: "About This Mac", onClick: () => openApp("about") },
        "separator",
        { label: "System Settings…", onClick: () => openApp("settings") },
        "separator",
        { label: "Sleep", onClick: () => setPower("sleeping") },
        { label: "Restart…", onClick: () => shutDown("booting") },
        { label: "Shut Down…", onClick: () => shutDown("off") },
        "separator",
        { label: "Lock Screen", onClick: () => setPower("locked") },
      ],
    },
    {
      id: "app",
      label: <span className="font-bold">{appName}</span>,
      entries: [
        {
          label: "About This Portfolio",
          onClick: () => openApp("settings", "about"),
        },
        "separator",
        {
          label: `Hide ${appName}`,
          disabled: !focusedId,
          onClick: () => focusedId && minimizeApp(focusedId),
        },
        {
          label: `Quit ${appName}`,
          disabled: !focusedId,
          onClick: () => focusedId && closeApp(focusedId),
        },
      ],
    },
    {
      id: "file",
      label: "File",
      entries: [
        { label: "New Finder Window", onClick: () => openApp("finder") },
        { label: "New Terminal Window", onClick: () => openApp("terminal") },
        { label: "New Message", onClick: () => openApp("mail") },
        "separator",
        {
          label: "Close Window",
          disabled: !focusedId,
          onClick: () => focusedId && closeApp(focusedId),
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      entries: [
        {
          label: "Copy Email Address",
          onClick: () => copy(profile.email, "Email address"),
        },
        {
          label: "Copy Portfolio Link",
          onClick: () => copy(window.location.href, "Portfolio link"),
        },
      ],
    },
    {
      id: "view",
      label: "View",
      entries: [
        {
          label: fullscreenId ? "Exit Full Screen" : "Enter Full Screen",
          disabled: !focusedId,
          onClick: () => focusedId && toggleWindowFullscreen(focusedId),
        },
        "separator",
        {
          label: "Dark Mode",
          checked: isDark,
          onClick: () => setAppearance(isDark ? "light" : "dark"),
        },
      ],
    },
    {
      id: "go",
      label: "Go",
      entries: [
        {
          label: "Experience",
          disabled: !experiences.length,
          onClick: () => openApp("finder", "experience"),
        },
        { label: "Projects", onClick: () => openApp("finder", "projects") },
        { label: "Documents", onClick: () => openApp("finder", "documents") },
        {
          label: "Applications",
          onClick: () => openApp("finder", "applications"),
        },
        "separator",
        ...[
          { label: "GitHub", url: links.github },
          { label: "LinkedIn", url: links.linkedin },
          { label: "Website", url: links.website },
        ]
          .filter((link) => link.url)
          .map((link) => ({
            label: link.label,
            onClick: () => openTarget({ type: "url", url: link.url! }),
          })),
      ],
    },
    {
      id: "window",
      label: "Window",
      entries: [
        {
          label: "Minimize",
          disabled: !focusedId || !!fullscreenId,
          onClick: () => focusedId && minimizeApp(focusedId),
        },
        {
          label: "Zoom",
          disabled: !focusedId || !!fullscreenId,
          onClick: () => focusedId && toggleMaximize(focusedId),
        },
        {
          label: isBrowserFullscreen ? "Exit Full Screen" : "Enter Full Screen",
          requiresUserActivation: true,
          onClick: async () => {
            if (!(await toggleBrowserFullscreen()))
              notify(
                "Full screen unavailable",
                "This browser or embedded preview does not allow full screen."
              );
          },
        },
        ...(windows.length ? ["separator" as const] : []),
        ...windows.map((w) => ({
          label: getApp(w.id).title,
          checked: w.id === focusedId,
          onClick: () => focusApp(w.id),
        })),
      ],
    },
    {
      id: "help",
      label: "Help",
      entries: [
        { label: "Terminal Commands", onClick: () => openApp("terminal") },
        {
          label: `Contact ${profile.name.split(" ")[0]}…`,
          onClick: () => openApp("mail"),
        },
        ...(links.repository
          ? [
              "separator" as const,
              {
                label: "View Source on GitHub",
                onClick: () => window.open(links.repository, "_blank"),
              },
            ]
          : []),
      ],
    },
  ];
}
