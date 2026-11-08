"use client";

import React from "react";
import dynamic from "next/dynamic";
import { IconSource, icons } from "./icons";

const lazyApp = (load: () => Promise<{ default: React.FC<AppProps> }>) =>
  dynamic(load, { ssr: false });

const Finder = lazyApp(() => import("../components/apps/finder/finder"));
const Terminal = lazyApp(() => import("../components/apps/terminal/terminal"));
const Notes = lazyApp(() => import("../components/apps/notes/notes"));
const Preview = lazyApp(() => import("../components/apps/preview/preview"));
const Mail = lazyApp(() => import("../components/apps/mail/mail"));
const Settings = lazyApp(() => import("../components/apps/settings/settings"));
const About = lazyApp(() => import("../components/apps/about/about"));
const Safari = lazyApp(() => import("../components/apps/safari/safari"));
const Photos = lazyApp(() => import("../components/apps/photos/photos"));

export type AppId =
  | "finder"
  | "safari"
  | "about"
  | "notes"
  | "terminal"
  | "preview"
  | "mail"
  | "settings"
  | "photos";

export interface AppProps {
  payload?: string;
  openedAt: number;
}

export interface App {
  id: AppId;
  name: string;
  title: string;
  icon: IconSource;
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
  embedsContent?: boolean;
  component: React.ComponentType<AppProps>;
}

export const apps: App[] = [
  {
    id: "safari",
    name: "Safari",
    title: "Safari",
    icon: icons.safari,
    size: { width: 1040, height: 700 },
    minSize: { width: 480, height: 320 },
    embedsContent: true,
    component: Safari,
  },
  {
    id: "finder",
    name: "Finder",
    title: "Finder",
    icon: icons.finder,
    size: { width: 920, height: 560 },
    minSize: { width: 420, height: 280 },
    component: Finder,
  },
  {
    id: "about",
    name: "Contacts",
    title: "Contacts",
    icon: icons.contacts,
    size: { width: 640, height: 440 },
    component: About,
  },
  {
    id: "notes",
    name: "Notes",
    title: "Notes",
    icon: icons.notes,
    size: { width: 880, height: 560 },
    minSize: { width: 420, height: 280 },
    component: Notes,
  },
  {
    id: "terminal",
    name: "Terminal",
    title: "Terminal",
    icon: icons.terminal,
    size: { width: 680, height: 440 },
    component: Terminal,
  },
  {
    id: "preview",
    name: "Preview",
    title: "Portfolio.pdf",
    icon: icons.preview,
    embedsContent: true,
    size: { width: 720, height: 580 },
    component: Preview,
  },
  {
    id: "mail",
    name: "Mail",
    title: "New Message",
    icon: icons.mail,
    size: { width: 560, height: 460 },
    minSize: { width: 380, height: 320 },
    component: Mail,
  },
  {
    id: "settings",
    name: "System Settings",
    title: "System Settings",
    icon: icons.settings,
    size: { width: 780, height: 540 },
    minSize: { width: 520, height: 360 },
    component: Settings,
  },
  {
    id: "photos",
    name: "Photos",
    title: "Photos",
    icon: icons.photos,
    size: { width: 900, height: 620 },
    minSize: { width: 470, height: 340 },
    component: Photos,
  },
];

const appsById = new Map(apps.map((app) => [app.id, app]));

export const getApp = (id: AppId): App => {
  const app = appsById.get(id);
  if (!app) throw new Error(`Unknown app: ${id}`);
  return app;
};
