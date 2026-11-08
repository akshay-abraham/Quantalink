import { describe, expect, it } from "vitest";
import { createContent } from "../../../test/fixtures";
import { getProjectRecord, getProjectRecords, projectPath } from "./archive";

const content = createContent({
  experiences: [
    {
      id: "old",
      company: "Old Co",
      role: "Junior Engineer",
      start: "2020-01",
      end: "2021-01",
      description: "Older role.",
      projects: [
        {
          id: "shared",
          name: "Shared",
          type: "Shipped Product",
          role: "Full-Stack Development",
          description: "Built at work.",
          tags: ["React"],
          link: "https://example.com/shared",
        },
      ],
    },
    {
      id: "new",
      company: "New Co",
      role: "Engineer",
      start: "2021-02",
      description: "Newer role.",
      projects: [
        {
          id: "fresh",
          name: "Fresh",
          type: "Contributed Product",
          description: "Built at the new job.",
          tags: ["Hono"],
        },
      ],
    },
  ],
  projects: [
    {
      id: "shared",
      name: "Shared",
      company: "Side project",
      description: "The standalone write-up.",
      tags: ["Vite", "React"],
      github: "https://github.com/testuser/shared",
    },
    {
      id: "personal",
      name: "Personal",
      company: "Rust desktop app",
      description: "One of mine.",
      tags: ["Rust"],
    },
  ],
});

describe("getProjectRecords", () => {
  it("lists the newest work first, then personal projects", () => {
    expect(getProjectRecords(content).map((project) => project.id)).toEqual([
      "fresh",
      "shared",
      "personal",
    ]);
  });

  it("merges a project that is both shipped at work and listed on its own", () => {
    const shared = getProjectRecord(content, "shared")!;

    expect(shared.tags).toEqual(["React", "Vite"]);
    expect(shared.link).toBe("https://example.com/shared");
    expect(shared.github).toBe("https://github.com/testuser/shared");
    expect(shared.role).toBe("Full-Stack Development");
    expect(shared.tagline).toBe("Shipped Product");
    expect(shared.contexts).toEqual([
      {
        company: "Old Co",
        role: "Junior Engineer",
        start: "2020-01",
        end: "2021-01",
      },
    ]);
  });

  it("keeps personal projects without a work context", () => {
    expect(getProjectRecord(content, "personal")).toMatchObject({
      tagline: "Rust desktop app",
      contexts: [],
    });
  });

  it("resolves an unknown id to nothing", () => {
    expect(getProjectRecord(content, "nope")).toBeUndefined();
  });
});

describe("projectPath", () => {
  it("builds the public case-study URL", () => {
    expect(projectPath("haruru")).toBe("/projects/haruru");
  });
});
