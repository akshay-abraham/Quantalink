/** Route the owner's homepage to its classic view inside Tahoe Safari. */
export const siteFrameUrl = (
  address: string,
  ownerWebsite: string | undefined,
  currentOrigin: string
) => {
  try {
    const parsed = new URL(address);
    const ownerOrigin = ownerWebsite
      ? new URL(ownerWebsite).origin
      : currentOrigin;
    if (parsed.origin === currentOrigin || parsed.origin === ownerOrigin) {
      const path = parsed.pathname === "/" ? "/site" : parsed.pathname;
      return `${currentOrigin}${path}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Safari handles search and non-URL views elsewhere.
  }
  return address;
};
