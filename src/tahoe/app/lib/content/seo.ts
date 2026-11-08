import type { Metadata } from "next";
import type { ProjectRecord } from "./archive";
import { projectPath } from "./archive";
import type { PortfolioContent } from "./schema";
import { SITE_AUTHOR, SITE_ROLE, SITE_URL, absoluteUrl } from "./site";

export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE_AUTHOR} — ${SITE_ROLE}`,
};

/**
 * Metadata for a public page. Each route states its own canonical URL, so no
 * page ever inherits `/` by accident.
 */
export const pageMetadata = (page: {
  title: string;
  description: string;
  path: string;
}): Metadata => ({
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    type: "website",
    url: page.path,
    siteName: SITE_AUTHOR,
    title: `${page.title} — ${SITE_AUTHOR}`,
    description: page.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${page.title} — ${SITE_AUTHOR}`,
    description: page.description,
    images: [OG_IMAGE],
  },
});

const person = (content: PortfolioContent) => ({
  "@type": "Person",
  name: content.profile.name,
  url: SITE_URL,
});

/** Identity markup for the homepage. Only facts that are already on the page. */
export const personJsonLd = (content: PortfolioContent) => {
  const { profile } = content;
  const current = content.experiences.find((experience) => !experience.end);
  const sameAs = [profile.links.github, profile.links.linkedin].filter(
    (link): link is string => Boolean(link)
  );
  const knowsAbout = Array.from(
    new Set([...profile.focus, ...Object.values(content.skills).flat()])
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    jobTitle: profile.role,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(current
      ? { worksFor: { "@type": "Organization", name: current.company } }
      : {}),
    ...(knowsAbout.length ? { knowsAbout } : {}),
  };
};

export const projectJsonLd = (
  project: ProjectRecord,
  content: PortfolioContent
) => {
  const url = absoluteUrl(projectPath(project.id));

  const shared = {
    "@context": "https://schema.org",
    name: project.name,
    description: project.description,
    url,
    author: person(content),
    ...(project.tags.length ? { keywords: project.tags.join(", ") } : {}),
  };

  if (project.github)
    return {
      ...shared,
      "@type": "SoftwareSourceCode",
      codeRepository: project.github,
      ...(project.link ? { sameAs: [project.link] } : {}),
    };

  return {
    ...shared,
    "@type": "SoftwareApplication",
    ...(project.link ? { url: project.link, sameAs: [url] } : {}),
  };
};
