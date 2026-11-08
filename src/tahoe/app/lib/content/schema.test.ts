import { describe, expect, it } from "vitest";
import { ContentValidationError, parsePortfolio } from "./schema";
import portfolio from "../../../data/portfolio.json";
import { createContent } from "../../../test/fixtures";

describe("parsePortfolio", () => {
  it("accepts the bundled portfolio.json", () => {
    expect(() => parsePortfolio(portfolio)).not.toThrow();
  });

  it("fills optional sections with defaults", () => {
    const content = createContent();
    expect(content.awards).toEqual([]);
    expect(content.skills).toEqual({});
    expect(content.system.hostname).toBe("portfolio");
    expect(content.profile.intro).toEqual([]);
  });

  it("reports every invalid field with its path", () => {
    const invalid = {
      ...portfolio,
      profile: { ...portfolio.profile, email: "nope", careerStart: "2022" },
    };

    try {
      parsePortfolio(invalid);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ContentValidationError);
      const message = (error as Error).message;
      expect(message).toContain("profile.email");
      expect(message).toContain("profile.careerStart");
    }
  });

  it("rejects a wallpaper without an image or gradient", () => {
    expect(() =>
      parsePortfolio({
        ...portfolio,
        system: {
          ...portfolio.system,
          wallpapers: [{ id: "empty", name: "Empty" }],
        },
      })
    ).toThrow(/src or a gradient/);
  });
});
