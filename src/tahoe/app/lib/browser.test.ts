import { describe, expect, it } from "vitest";
import { SEARCH_URL, canEmbed, getHost, toUrl } from "./browser";

describe("toUrl", () => {
  it("adds https to bare domains", () => {
    expect(toUrl("example.com")).toBe("https://example.com/");
    expect(toUrl("en.wikipedia.org/wiki/Nepal")).toBe(
      "https://en.wikipedia.org/wiki/Nepal"
    );
  });

  it("keeps explicit protocols", () => {
    expect(toUrl("http://example.com")).toBe("http://example.com/");
  });

  it("searches anything that isn't a URL", () => {
    expect(toUrl("macos portfolio")).toBe(`${SEARCH_URL}macos%20portfolio`);
    expect(toUrl("hello")).toBe(`${SEARCH_URL}hello`);
  });

  it("never navigates to non-web protocols", () => {
    expect(toUrl("javascript:alert(1)")).toContain(SEARCH_URL);
    expect(toUrl("file:///etc/passwd")).toContain(SEARCH_URL);
  });

  it("ignores empty input", () => {
    expect(toUrl("   ")).toBe("");
  });
});

describe("hosts", () => {
  it("shows the host without www", () => {
    expect(getHost("https://www.example.com/about")).toBe("example.com");
  });

  it("knows which sites refuse to be embedded", () => {
    expect(canEmbed("https://github.com/octocat")).toBe(false);
    expect(canEmbed("https://gist.github.com/x")).toBe(false);
    expect(canEmbed("https://en.wikipedia.org")).toBe(true);
    expect(canEmbed("https://notgithub.com")).toBe(true);
  });
});
