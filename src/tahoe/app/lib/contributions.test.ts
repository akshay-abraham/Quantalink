import { describe, expect, it } from "vitest";
import data from "../../data/portfolio.json";
import { parsePortfolio } from "./content/schema";
import {
  buildFileEntries,
  listLocation,
  getLocationTitle,
} from "./file-system";
import {
  buildSearchIndex,
  searchIndex,
} from "../components/spotlight/search-index";

const sampleContribution = {
  id: "sample-contribution",
  repository: "example/repo",
  title: "Sample contribution",
  number: 1,
  status: "Merged",
  description: "A test contribution for navigation and search.",
  tags: ["Test"],
  link: "https://github.com/example/repo/pull/1",
};
const content = parsePortfolio({
  ...data,
  contributions: [sampleContribution],
});
const entries = buildFileEntries(content);
const state = { trashed: [], isVisible: () => true };

describe("open-source contributions", () => {
  it("exposes the section on the desktop and its contribution in Finder", () => {
    expect(getLocationTitle("contributions", content.profile.username)).toBe(
      "Open Source"
    );
    expect(
      listLocation("desktop", entries, content.profile.username, state).some(
        (e) => e.id === "contributions"
      )
    ).toBe(true);
    const contribution = listLocation(
      "contributions",
      entries,
      content.profile.username,
      state
    ).find((entry) => entry.id === "sample-contribution");
    expect(contribution?.open).toEqual({
      type: "app",
      app: "notes",
      payload: "sample-contribution",
    });
    expect(contribution?.info?.link).toBe(
      "https://github.com/example/repo/pull/1"
    );
  });
  it("finds contributions through Spotlight and tags", () => {
    expect(
      searchIndex(buildSearchIndex(content), "example/repo")[0].target
    ).toEqual({
      type: "app",
      app: "notes",
      payload: "sample-contribution",
    });
    expect(
      listLocation("tag:Test", entries, content.profile.username, state).some(
        (e) => e.id === "sample-contribution"
      )
    ).toBe(true);
  });
});
