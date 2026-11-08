import { describe, expect, it } from "vitest";
import { siteFrameUrl } from "./site-frame";

const owner = "https://akshayabraham.vercel.app";
const local = "http://localhost:9002";

describe("Safari's classic site route", () => {
  it("loads the classic home while keeping the address separate", () => {
    expect(siteFrameUrl(local, owner, local)).toBe(`${local}/site`);
    expect(siteFrameUrl(`${owner}/#contact`, owner, local)).toBe(
      `${local}/site#contact`
    );
  });

  it("leaves other pages and external sites alone", () => {
    expect(siteFrameUrl(`${local}/about`, owner, local)).toBe(`${local}/about`);
    expect(siteFrameUrl(`${owner}/projects`, owner, local)).toBe(
      `${local}/projects`
    );
    expect(siteFrameUrl("https://example.com", owner, local)).toBe(
      "https://example.com"
    );
  });
});
