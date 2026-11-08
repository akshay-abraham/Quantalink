import { PortfolioContent, parsePortfolio } from "./schema";

export interface ContentSource {
  load(signal?: AbortSignal): Promise<PortfolioContent>;
}

const REQUEST_TIMEOUT_MS = 10_000;

export class ApiContentSource implements ContentSource {
  constructor(private readonly url: string) {}

  async load(signal?: AbortSignal) {
    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const response = await fetch(this.url, {
      headers: { Accept: "application/json" },
      signal:
        signal && "any" in AbortSignal
          ? AbortSignal.any([signal, timeout])
          : (signal ?? timeout),
    });
    if (!response.ok)
      throw new Error(
        `Failed to load content from ${this.url} (${response.status})`
      );
    return parsePortfolio(await response.json());
  }
}

export const contentSource: ContentSource = new ApiContentSource(
  "/api/portfolio"
);
