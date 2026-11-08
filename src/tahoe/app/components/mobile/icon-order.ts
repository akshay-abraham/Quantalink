import type { AppId } from "../../lib/apps";

export const defaultMobileOrder: AppId[] = [
  "about",
  "preview",
  "settings",
  "finder",
  "safari",
  "mail",
  "notes",
  "photos",
];
export const normalizeMobileOrder = (value: unknown): AppId[] => {
  const saved = Array.isArray(value)
    ? value.filter((id): id is AppId => defaultMobileOrder.includes(id))
    : [];
  return Array.from(new Set([...saved, ...defaultMobileOrder]));
};
export const moveMobileIcon = (order: AppId[], from: AppId, to: AppId) => {
  const next = [...order];
  const source = next.indexOf(from);
  const target = next.indexOf(to);
  if (source < 0 || target < 0) return order;
  next.splice(source, 1);
  next.splice(target, 0, from);
  return next;
};
