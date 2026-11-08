import { describe, expect, it } from "vitest";
import {
  buildFileEntries,
  getLocationTitle,
  isLocation,
  listLocation,
} from "./file-system";
import { createContent } from "../../test/fixtures";

const content = createContent();
const entries = buildFileEntries(content);
const fileState = (trashed: string[] = []) => ({
  trashed,
  isVisible: (id: string) => !trashed.includes(id),
});
const ids = (list: { id: string }[]) => list.map((entry) => entry.id);

describe("file system", () => {
  it("validates locations", () => {
    expect(isLocation("projects")).toBe(true);
    expect(isLocation("tag:Flutter")).toBe(true);
    expect(isLocation("nowhere")).toBe(false);
    expect(isLocation(undefined)).toBe(false);
  });

  it("titles the home folder with the username", () => {
    expect(getLocationTitle("home", "testuser")).toBe("testuser");
    expect(getLocationTitle("tag:Mobile", "testuser")).toBe("Mobile");
  });

  it("lists projects and filters them by tag", () => {
    expect(
      ids(listLocation("projects", entries, "testuser", fileState()))
    ).toEqual(["rocket", "secret"]);
    expect(
      ids(listLocation("tag:Golang", entries, "testuser", fileState()))
    ).toEqual(["secret"]);
  });

  it("moves trashed files out of their folder and into the Trash", () => {
    const state = fileState(["rocket", "cv"]);
    expect(ids(listLocation("projects", entries, "testuser", state))).toEqual([
      "secret",
    ]);
    expect(ids(listLocation("documents", entries, "testuser", state))).toEqual(
      []
    );
    expect(ids(listLocation("trash", entries, "testuser", state))).toEqual([
      "cv",
      "rocket",
    ]);
  });

  it("only opens projects that have a link", () => {
    const [rocket, secret] = entries.projects;
    expect(rocket.open).toEqual({
      type: "url",
      url: "https://example.com/rocket",
    });
    expect(secret.open).toEqual({ type: "none" });
  });

  it("protects applications and folders from rename and trash", () => {
    const [finder] = entries.applications;
    expect(finder.canTrash).toBe(false);
    expect(finder.canRename).toBe(false);
  });

  it("keeps experience projects distinct from projects with the same ID", () => {
    const overlapping = createContent({
      experiences: [
        {
          id: "acme",
          company: "Acme",
          role: "Engineer",
          start: "2021-03",
          description: "Did work.",
          projects: [
            {
              id: "rocket",
              name: "Rocket at Acme",
              description: "Built it.",
              tags: ["Flutter"],
            },
          ],
        },
      ],
    });
    const files = buildFileEntries(overlapping);
    const tagItems = listLocation(
      "tag:Flutter",
      files,
      "testuser",
      fileState()
    );
    expect(ids(tagItems)).toContain("rocket");
    expect(ids(tagItems)).toContain("experience-project:acme:rocket");
    expect(new Set(ids(tagItems)).size).toBe(tagItems.length);
  });
});
