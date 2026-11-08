export const SEARCH_URL = "https://www.bing.com/search?q=";

// These sites refuse to render inside frames (X-Frame-Options / frame-ancestors).
const UNFRAMEABLE_HOSTS = [
  "github.com",
  "google.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "reddit.com",
  "duckduckgo.com",
  "apps.apple.com",
  "play.google.com",
];

const looksLikeUrl = (input: string) =>
  /^[a-z][a-z\d+.-]*:\/\//i.test(input) ||
  (!/\s/.test(input) && /^[^.]+\.[^.]{2,}/.test(input)) ||
  /^localhost(:\d+)?(\/|$)/.test(input);

export const toUrl = (input: string): string => {
  const value = input.trim();
  if (!value) return "";
  if (!looksLikeUrl(value)) return `${SEARCH_URL}${encodeURIComponent(value)}`;

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : `${SEARCH_URL}${encodeURIComponent(value)}`;
  } catch {
    return `${SEARCH_URL}${encodeURIComponent(value)}`;
  }
};

export const getHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const isSecure = (url: string) => url.startsWith("https://");

export const canEmbed = (url: string) => {
  const host = getHost(url);
  return !UNFRAMEABLE_HOSTS.some(
    (blocked) => host === blocked || host.endsWith(`.${blocked}`)
  );
};
