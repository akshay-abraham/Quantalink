const TAG_COLORS = [
  "bg-[#ff453a]",
  "bg-[#ff9f0a]",
  "bg-[#ffd60a]",
  "bg-[#32d74b]",
  "bg-[#0a84ff]",
  "bg-[#bf5af2]",
  "bg-[#98989d]",
];

export const MAX_SIDEBAR_TAGS = TAG_COLORS.length;

export const getTagColor = (tags: string[], tag: string) =>
  TAG_COLORS[tags.indexOf(tag) % TAG_COLORS.length] ?? TAG_COLORS.at(-1)!;
