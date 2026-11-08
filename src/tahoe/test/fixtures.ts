import { PortfolioContent, parsePortfolio } from "../app/lib/content/schema";

export const createContent = (
  overrides: Partial<PortfolioContent> = {}
): PortfolioContent =>
  parsePortfolio({
    site: { title: "Test Portfolio", description: "Fixture content" },
    profile: {
      // Deliberately fake, so fixture data can never be mistaken for the real owner.
      name: "Test Person",
      initials: "TP",
      username: "testuser",
      role: "Engineer",
      summary: "Builds things.",
      careerStart: "2020-01",
      email: "test@example.com",
      cv: "/cv.pdf",
      links: { github: "https://github.com/testuser" },
    },
    experiences: [
      {
        id: "acme",
        company: "Acme",
        role: "Engineer",
        start: "2021-03",
        description: "Did work.",
      },
    ],
    projects: [
      {
        id: "rocket",
        name: "Rocket",
        company: "Acme",
        description: "Goes up.",
        tags: ["Flutter", "Mobile"],
        link: "https://example.com/rocket",
      },
      {
        id: "secret",
        name: "Secret",
        company: "Acme",
        description: "Private.",
        tags: ["Golang"],
      },
    ],
    system: {
      defaultWallpaper: "plain",
      wallpapers: [{ id: "plain", name: "Plain", gradient: "#000" }],
      welcome: { title: "Hi", body: "Welcome" },
    },
    ...overrides,
  });
