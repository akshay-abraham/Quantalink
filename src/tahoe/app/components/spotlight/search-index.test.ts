import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchIndex } from "./search-index";
import { createContent } from "../../../test/fixtures";

const index = buildSearchIndex(createContent());
const titles = (query: string) => searchIndex(index, query).map((r) => r.title);

describe("spotlight search", () => {
  it("returns nothing for an empty query", () => {
    expect(searchIndex(index, "   ")).toEqual([]);
  });

  it("matches titles and subtitles case-insensitively", () => {
    expect(titles("rocket")).toEqual(["Rocket"]);
    expect(titles("FLUTTER")).toEqual(["Rocket"]);
  });

  it("requires every word to match", () => {
    expect(titles("acme golang")).toEqual(["Secret"]);
  });

  it("only indexes links that exist", () => {
    expect(titles("github")).toEqual(["GitHub"]);
    expect(titles("linkedin")).toEqual([]);
  });

  it("opens projects in Finder with the project selected", () => {
    const [rocket] = searchIndex(index, "rocket");
    expect(rocket.target).toEqual({
      type: "app",
      app: "finder",
      payload: "projects/rocket",
    });
  });
});
