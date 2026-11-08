import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiContentSource } from "./source";
import { ContentValidationError } from "./schema";
import portfolio from "../../../data/portfolio.json";

const mockFetch = (response: Partial<Response>) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(response as Response);

describe("ApiContentSource", () => {
  afterEach(() => vi.restoreAllMocks());

  it("loads and validates content from the endpoint", async () => {
    const fetchSpy = mockFetch({ ok: true, json: async () => portfolio });

    const content = await new ApiContentSource("/api/portfolio").load();

    expect(content.profile.name).toBe(portfolio.profile.name);
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/portfolio",
      expect.objectContaining({ headers: { Accept: "application/json" } })
    );
  });

  it("fails with the status code when the request fails", async () => {
    mockFetch({ ok: false, status: 503 });
    await expect(new ApiContentSource("/api").load()).rejects.toThrow("(503)");
  });

  it("rejects responses that do not match the schema", async () => {
    mockFetch({ ok: true, json: async () => ({ profile: {} }) });
    await expect(new ApiContentSource("/api").load()).rejects.toBeInstanceOf(
      ContentValidationError
    );
  });
});
