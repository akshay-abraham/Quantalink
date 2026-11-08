import { PortfolioContent } from "../../../lib/content/schema";
import { getHost } from "../../../lib/browser";

const MAX_FAVORITES = 12;

export interface Favorite {
  url: string;
  title: string;
}

export const getFavorites = (
  { profile, projects, experiences }: PortfolioContent,
  homepage: string
): Favorite[] => {
  const experienceProjectLinks = experiences.flatMap((experience) =>
    experience.projects.flatMap((project) =>
      typeof project !== "string" && project.link
        ? [[project.link, project.name] as const]
        : []
    )
  );
  const projectTitles = new Map([
    ...experienceProjectLinks,
    ...projects.flatMap((project) =>
      project.link ? [[project.link, project.name] as const] : []
    ),
  ]);
  const urls = Array.from(
    new Set(
      [
        homepage,
        profile.links.website,
        ...Array.from(projectTitles.keys()),
      ].filter((url): url is string => !!url)
    )
  );

  return urls
    .slice(0, MAX_FAVORITES)
    .map((url) => ({ url, title: projectTitles.get(url) ?? getHost(url) }));
};
