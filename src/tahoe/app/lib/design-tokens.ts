const SF_UNITS_PER_EM = 2048;

// SF Pro `trak` table (font units per size); browsers ignore it, so apply it as letter-spacing.
const SF_TRACKING: Record<number, number> = {
  11: 12,
  12: 0,
  13: -12,
  14: -22,
  15: -32,
  16: -40,
  17: -52,
  20: -46,
  22: -24,
  24: 6,
  26: 17,
  28: 28,
  30: 27,
  36: 21,
  96: 0,
};

export const fontSizes = Object.fromEntries(
  Object.entries(SF_TRACKING).map(([size, track]) => [
    size,
    [
      `${size}px`,
      { letterSpacing: `${(track / SF_UNITS_PER_EM).toFixed(4)}em` },
    ],
  ])
) as Record<string, [string, { letterSpacing: string }]>;

export const fontSizeKeys = Object.keys(fontSizes);

export const layers = {
  windows: "10",
  "quick-look": "24",
  launcher: "25",
  fullscreen: "25",
  dock: "26",
  menubar: "30",
  spotlight: "40",
  notifications: "40",
  brightness: "50",
  power: "60",
};
