import { StaticImageData } from "next/image";
import type { AppId } from "./apps";
import { apps } from "./apps";
import { IconSource, icons } from "./icons";
import { PortfolioContent } from "./content/schema";

import FolderIcon from "../assets/icons/files/folder.png";
import ApplicationsFolderIcon from "../assets/icons/files/folder-applications.png";
import DesktopFolderIcon from "../assets/icons/files/folder-desktop.png";
import DocumentsFolderIcon from "../assets/icons/files/folder-documents.png";
import DownloadsFolderIcon from "../assets/icons/files/folder-downloads.png";
import PdfIcon from "../assets/icons/files/pdf.png";

export type OpenTarget =
  | { type: "app"; app: AppId; payload?: string }
  | { type: "url"; url: string }
  | { type: "folder"; location: Location }
  | { type: "none" };

export interface FileEntry {
  id: string;
  name: string;
  kind: string;
  icon: IconSource;
  canTrash: boolean;
  canRename: boolean;
  open: OpenTarget;
  preview?: string;
  info?: {
    subtitle: string;
    description: string;
    tags: string[];
    link?: string;
  };
}

export const folderIds = [
  "home",
  "recents",
  "applications",
  "desktop",
  "documents",
  "downloads",
  "experience",
  "projects",
  "contributions",
  "trash",
] as const;

export type FolderId = (typeof folderIds)[number];
export type Location = FolderId | `tag:${string}`;

const folderIcons: Record<FolderId, StaticImageData> = {
  home: FolderIcon,
  recents: FolderIcon,
  applications: ApplicationsFolderIcon,
  desktop: DesktopFolderIcon,
  documents: DocumentsFolderIcon,
  downloads: DownloadsFolderIcon,
  experience: FolderIcon,
  projects: FolderIcon,
  contributions: FolderIcon,
  trash: FolderIcon,
};

export const isLocation = (value?: string): value is Location =>
  !!value &&
  (folderIds.includes(value as FolderId) || value.startsWith("tag:"));

export const getTagFromLocation = (location: Location) =>
  location.startsWith("tag:") ? location.slice(4) : null;

export const getFolderName = (id: FolderId, username: string) =>
  id === "contributions"
    ? "Open Source"
    : id === "home"
      ? username
      : id[0].toUpperCase() + id.slice(1);

export const getLocationTitle = (location: Location, username: string) =>
  getTagFromLocation(location) ?? getFolderName(location as FolderId, username);

export const getProjectTags = (content: PortfolioContent) =>
  Array.from(
    new Set([
      ...content.contributions.flatMap((contribution) => contribution.tags),
      ...content.projects.flatMap((project) => project.tags),
      ...content.experiences.flatMap((experience) =>
        experience.projects.flatMap((project) =>
          typeof project === "string" ? [] : project.tags
        )
      ),
    ])
  );

export const folderEntry = (id: FolderId, username: string): FileEntry => ({
  id,
  name: getFolderName(id, username),
  kind: "Folder",
  icon: folderIcons[id],
  canTrash: false,
  canRename: false,
  open: { type: "folder", location: id },
});

export const buildFileEntries = ({
  profile,
  projects,
  experiences,
  contributions,
}: PortfolioContent) => {
  const cv: FileEntry = {
    id: "cv",
    name: "Portfolio.pdf",
    kind: "PDF Document",
    icon: PdfIcon,
    canTrash: true,
    canRename: true,
    preview: profile.cv,
    open: { type: "app", app: "preview" },
    info: {
      subtitle: "PDF Document",
      description: `Curriculum vitae of ${profile.name}.`,
      tags: [],
    },
  };

  const about: FileEntry = {
    id: "about",
    name: "About Me",
    kind: "Contact",
    icon: icons.contacts,
    canTrash: true,
    canRename: true,
    open: { type: "app", app: "about" },
    info: { subtitle: "Contact", description: profile.summary, tags: [] },
  };

  const experienceEntries = experiences.flatMap<FileEntry>((experience) => [
    {
      id: experience.id,
      name: experience.company,
      kind: "Note",
      icon: icons.notes,
      canTrash: true,
      canRename: true,
      open: { type: "app", app: "notes", payload: experience.id },
      info: {
        subtitle: experience.role,
        description: experience.description,
        tags: [],
        link: experience.link,
      },
    },
    ...experience.projects.flatMap<FileEntry>((project) =>
      typeof project === "string"
        ? []
        : [
            {
              id: `experience-project:${experience.id}:${project.id}`,
              name: project.name,
              kind: project.type ?? "Contributed Product",
              icon: FolderIcon,
              canTrash: true,
              canRename: true,
              open: project.link
                ? { type: "url", url: project.link }
                : { type: "none" },
              info: {
                subtitle: [experience.company, project.type]
                  .filter(Boolean)
                  .join(" · "),
                description: project.description,
                tags: project.tags,
                link: project.link,
              },
            },
          ]
    ),
  ]);

  const projectEntries = projects.map<FileEntry>((project) => ({
    id: project.id,
    name: project.name,
    kind: "Folder",
    icon: FolderIcon,
    canTrash: true,
    canRename: true,
    open:
      project.link || project.github
        ? { type: "url", url: project.link ?? project.github! }
        : { type: "none" },
    info: {
      subtitle: project.company,
      description: project.description,
      tags: project.tags,
      link: project.link,
    },
  }));

  const openSourceProjects = projects.flatMap<FileEntry>((project) =>
    project.github
      ? [
          {
            id: `repo:${project.id}`,
            name: project.name,
            kind: "GitHub Repository",
            icon: FolderIcon,
            canTrash: true,
            canRename: true,
            open: { type: "url", url: project.github },
            info: {
              subtitle: "GitHub Repository",
              description: project.description,
              tags: project.tags,
              link: project.github,
            },
          },
        ]
      : []
  );

  const applications = apps.map<FileEntry>((app) => ({
    id: app.id,
    name: app.name,
    kind: "Application",
    icon: app.icon,
    canTrash: false,
    canRename: false,
    open: { type: "app", app: app.id },
  }));

  return {
    cv,
    about,
    experiences: experienceEntries,
    projects: projectEntries,
    openSourceProjects,
    contributions: contributions.map<FileEntry>((contribution) => ({
      id: contribution.id,
      name: `${contribution.repository} #${contribution.number}`,
      kind: `${contribution.status} Pull Request`,
      icon: icons.notes,
      canTrash: true,
      canRename: true,
      open: { type: "app", app: "notes", payload: contribution.id },
      info: {
        subtitle: `${contribution.status} · ${contribution.title}`,
        description: contribution.description,
        tags: contribution.tags,
        link: contribution.link,
      },
    })),
    applications,
  };
};

export type FileEntries = ReturnType<typeof buildFileEntries>;

interface FileState {
  trashed: string[];
  isVisible: (id: string) => boolean;
}

export const listLocation = (
  location: Location,
  entries: FileEntries,
  username: string,
  { trashed, isVisible }: FileState
): FileEntry[] => {
  const visible = (list: FileEntry[]) => list.filter((e) => isVisible(e.id));
  const tag = getTagFromLocation(location);
  if (tag)
    return visible(
      [
        ...entries.experiences,
        ...entries.projects,
        ...entries.contributions,
      ].filter((e) => e.info?.tags.includes(tag))
    );

  switch (location as FolderId) {
    case "home":
      return (
        [
          "applications",
          "desktop",
          "documents",
          "downloads",
          "experience",
          "projects",
          "contributions",
        ] as const
      ).map((id) => folderEntry(id, username));
    case "recents":
      return visible([
        entries.cv,
        ...entries.experiences.slice(0, 2),
        ...entries.projects.slice(0, 2),
      ]);
    case "applications":
      return entries.applications;
    case "desktop":
      return visible([
        entries.about,
        folderEntry("experience", username),
        folderEntry("projects", username),
        folderEntry("contributions", username),
        entries.cv,
      ]);
    case "documents":
    case "downloads":
      return visible([entries.cv]);
    case "experience":
      return visible(entries.experiences);
    case "contributions":
      return visible([...entries.openSourceProjects, ...entries.contributions]);
    case "projects":
      return visible(entries.projects);
    case "trash":
      return [
        entries.cv,
        entries.about,
        ...entries.experiences,
        ...entries.projects,
        ...entries.openSourceProjects,
        ...entries.contributions,
      ].filter((e) => trashed.includes(e.id));
  }
};

export const canOpen = (entry: FileEntry) => entry.open.type !== "none";
