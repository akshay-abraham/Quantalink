import { describe, expect, it } from "vitest";
import { gmailComposeUrl } from "./compose-url";

describe("Gmail compose link", () => {
  it("encodes a complete draft without losing Unicode or newlines", () => {
    const url = new URL(
      gmailComposeUrl(
        "akshay@example.com",
        "Hello & thanks",
        "Hi Akshay,\nനമസ്കാരം"
      )
    );
    expect(url.origin).toBe("https://mail.google.com");
    expect(url.searchParams.get("view")).toBe("cm");
    expect(url.searchParams.get("fs")).toBe("1");
    expect(url.searchParams.get("to")).toBe("akshay@example.com");
    expect(url.searchParams.get("su")).toBe("Hello & thanks");
    expect(url.searchParams.get("body")).toBe("Hi Akshay,\nനമസ്കാരം");
  });
});
