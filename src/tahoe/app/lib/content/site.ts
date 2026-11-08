import localContent from "../../../data/portfolio.json";

const fallbackSiteUrl = "https://akshayabraham.vercel.app";

/** Canonical origin, without a trailing slash. */
export const SITE_URL = (
  localContent.profile.links.website ?? fallbackSiteUrl
).replace(/\/+$/, "");

export const absoluteUrl = (path: string) =>
  new URL(path, `${SITE_URL}/`).toString();

export const SITE_AUTHOR = localContent.profile.name;
export const SITE_ROLE = localContent.profile.role;
