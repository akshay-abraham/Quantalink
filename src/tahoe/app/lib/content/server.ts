import { LocalContentSource } from "./local-source";
import type { PortfolioContent } from "./schema";

/**
 * Content for the server-rendered pages. These read the bundled
 * data/portfolio.json at build time, so they stay static and crawlable.
 */
export const loadContent = (): Promise<PortfolioContent> =>
  new LocalContentSource().load();
