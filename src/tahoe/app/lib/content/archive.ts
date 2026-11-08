import type { CaseStudy, PortfolioContent } from "./schema";

export interface ProjectContext {
  company: string;
  role: string;
  start: string;
  end?: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  /** Short subtitle: the product type at work, or the project's own tagline. */
  tagline?: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  /** The role held on the project, when it shipped inside a job. */
  role?: string;
  contexts: ProjectContext[];
  caseStudy?: CaseStudy;
}

export interface ContributionRecord {
  id: string;
  repository: string;
  title: string;
  number: number;
  status: string;
  description: string;
  tags: string[];
  link: string;
}

export const projectPath = (id: string) => `/projects/${id}`;

const mergeTags = (current: string[], incoming: string[]) =>
  Array.from(new Set([...current, ...incoming]));

/**
 * One record per project, so every project has exactly one public URL.
 *
 * Work projects come first (newest role first), then personal projects. An id
 * that appears both at work and in the project list — Hayon, for example — is
 * merged into a single record with both of its contexts.
 */
export const getProjectRecords = (
  content: PortfolioContent
): ProjectRecord[] => {
  const records = new Map<string, ProjectRecord>();

  const upsert = (
    incoming: Omit<ProjectRecord, "contexts">,
    context?: ProjectContext
  ) => {
    const existing = records.get(incoming.id);
    const merged: ProjectRecord = existing
      ? {
          ...existing,
          tagline: existing.tagline ?? incoming.tagline,
          tags: mergeTags(existing.tags, incoming.tags),
          link: existing.link ?? incoming.link,
          github: existing.github ?? incoming.github,
          role: existing.role ?? incoming.role,
          caseStudy: existing.caseStudy ?? incoming.caseStudy,
          contexts: [...existing.contexts, ...(context ? [context] : [])],
        }
      : { ...incoming, contexts: context ? [context] : [] };

    records.set(incoming.id, merged);
  };

  const experiences = [...content.experiences].sort((a, b) =>
    b.start.localeCompare(a.start)
  );

  for (const experience of experiences) {
    const context: ProjectContext = {
      company: experience.company,
      role: experience.role,
      start: experience.start,
      end: experience.end,
    };

    for (const project of experience.projects) {
      if (typeof project === "string") continue;

      upsert(
        {
          id: project.id,
          name: project.name,
          tagline: project.type,
          description: project.description,
          tags: project.tags,
          link: project.link,
          github: project.github,
          role: project.role,
          caseStudy: project.caseStudy,
        },
        context
      );
    }
  }

  for (const project of content.projects) {
    upsert({
      id: project.id,
      name: project.name,
      tagline: project.company,
      description: project.description,
      tags: project.tags,
      link: project.link,
      github: project.github,
      caseStudy: project.caseStudy,
    });
  }

  return Array.from(records.values());
};

export const getProjectRecord = (
  content: PortfolioContent,
  id: string
): ProjectRecord | undefined =>
  getProjectRecords(content).find((project) => project.id === id);
