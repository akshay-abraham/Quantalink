import { AppId, getApp } from "../../lib/apps";
import { icons } from "../../lib/icons";
import { useFiles } from "../../context/file-context";
import { useOverlays } from "../../context/overlay-context";
import { useWindows } from "../../context/window-context";
import { DockItem } from "./types";
import { EMPTY_TRASH_PAYLOAD } from "../apps/finder/navigation";

import TrashIcon from "../../assets/icons/files/trash.png";
import TrashFullIcon from "../../assets/icons/files/trash-full.png";

const PINNED_APPS: AppId[] = [
  "finder",
  "safari",
  "about",
  "notes",
  "photos",
  "terminal",
  "mail",
  "settings",
];

export function useDockItems(): DockItem[][] {
  const { windows, launching, openApp, focusApp, minimizeApp, closeApp } =
    useWindows();
  const { isLauncherOpen, setLauncherOpen } = useOverlays();
  const { trashed, moveToTrash } = useFiles();

  const appMenu = (id: AppId): DockItem["menu"] => {
    const isOpen = windows.some((w) => w.id === id);
    if (id === "finder")
      return [
        { label: "New Finder Window", onClick: () => openApp("finder") },
        ...(isOpen
          ? [{ label: "Hide", onClick: () => minimizeApp("finder") }]
          : []),
      ];
    return isOpen
      ? [
          { label: "Show", onClick: () => focusApp(id) },
          "separator",
          { label: "Hide", onClick: () => minimizeApp(id) },
          { label: "Quit", onClick: () => closeApp(id) },
        ]
      : [{ label: "Open", onClick: () => openApp(id) }];
  };

  const appItem = (id: AppId): DockItem => ({
    key: id,
    title: getApp(id).name,
    icon: getApp(id).icon,
    onClick: () => {
      setLauncherOpen(false);
      openApp(id);
    },
    isRunning: id === "finder" || windows.some((w) => w.id === id),
    isLaunching: launching === id,
    menu: appMenu(id),
  });

  const [finder, ...pinned] = PINNED_APPS.map(appItem);
  const settings = pinned.pop()!;

  const launcher: DockItem = {
    key: "apps",
    title: "Apps",
    icon: icons.apps,
    onClick: () => setLauncherOpen(!isLauncherOpen),
  };

  const running = windows
    .filter((w) => !PINNED_APPS.includes(w.id))
    .map((w) => appItem(w.id));

  const minimized = windows
    .filter((w) => w.isMinimized)
    .map<DockItem>((w) => ({
      key: `minimized-${w.id}`,
      title: getApp(w.id).title,
      icon: getApp(w.id).icon,
      isMinimizedWindow: true,
      onClick: () => focusApp(w.id),
    }));

  const trash: DockItem = {
    key: "trash",
    title: "Trash",
    icon: trashed.length ? TrashFullIcon : TrashIcon,
    onClick: () => openApp("finder", "trash"),
    onDropFile: (fileId) => moveToTrash([fileId]),
    menu: [
      { label: "Open", onClick: () => openApp("finder", "trash") },
      "separator",
      {
        label: "Empty Trash",
        disabled: !trashed.length,
        onClick: () => openApp("finder", EMPTY_TRASH_PAYLOAD),
      },
    ],
  };

  return [
    [finder, launcher, ...pinned, settings],
    running,
    [...minimized, trash],
  ].filter((group) => group.length);
}
