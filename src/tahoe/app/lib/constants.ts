export const MENUBAR_HEIGHT = 32;
export const DOCK_RESERVED_HEIGHT = 92;
export const MOBILE_BREAKPOINT = 768;

export const DOCK_ICON_SIZE = 56;
export const DOCK_MAGNIFIED_SIZE = 84;
export const DOCK_MAGNIFY_RANGE = 170;

export const NOTIFICATION_DURATION_MS = 5000;
export const LAUNCH_BOUNCE_MS = 800;

export const STORAGE_KEYS = {
  appearance: "appearance",
  wallpaper: "wallpaper",
  brightness: "brightness",
  uncheckedNoteItems: "notes:unchecked",
  fileNames: "files:names",
  trashedFiles: "files:trashed",
} as const;

export const SESSION_KEYS = {
  booted: "booted",
  deletedFiles: "files:deleted",
} as const;
