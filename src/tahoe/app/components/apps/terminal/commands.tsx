import React from "react";
import { formatMonth, formatDuration } from "../../../lib/utils";
import { AppId } from "../../../lib/apps";
import { PortfolioContent } from "../../../lib/content/schema";
import { parseYearMonth } from "../../../lib/content/dates";

export interface CommandContext {
  openApp: (id: AppId, payload?: string) => void;
  openUrl: (url: string) => void;
  closeTerminal: () => void;
  clear: () => void;
  history: string[];
  content: PortfolioContent;
}

type Command = {
  description: string;
  run: (args: string[], context: CommandContext) => React.ReactNode;
};

const files: Record<string, (context: CommandContext) => React.ReactNode> = {
  "about.txt": ({ content }) => content.profile.summary,
  "skills.txt": (context) => commands.skills.run([], context),
  "contact.txt": (context) => commands.contact.run([], context),
};

const openTargets: Record<
  string,
  { label: string; open: (context: CommandContext) => void }
> = {
  finder: { label: "Finder", open: ({ openApp }) => openApp("finder") },
  experience: {
    label: "Experience",
    open: ({ openApp }) => openApp("finder", "experience"),
  },
  projects: {
    label: "Projects",
    open: ({ openApp }) => openApp("finder", "projects"),
  },
  contributions: {
    label: "Open Source",
    open: ({ openApp }) => openApp("finder", "contributions"),
  },
  notes: { label: "Notes", open: ({ openApp }) => openApp("notes") },
  photos: { label: "Photos", open: ({ openApp }) => openApp("photos") },
  safari: { label: "Safari", open: ({ openApp }) => openApp("safari") },
  mail: { label: "Mail", open: ({ openApp }) => openApp("mail") },
  settings: {
    label: "System Settings",
    open: ({ openApp }) => openApp("settings"),
  },
  about: { label: "About Me", open: ({ openApp }) => openApp("about") },
  cv: { label: "Portfolio.pdf", open: ({ openApp }) => openApp("preview") },
  portfolio: {
    label: "Portfolio.pdf",
    open: ({ openApp }) => openApp("preview"),
  },
  github: {
    label: "GitHub",
    open: ({ content, openUrl }) =>
      content.profile.links.github && openUrl(content.profile.links.github),
  },
  linkedin: {
    label: "LinkedIn",
    open: ({ content, openUrl }) =>
      content.profile.links.linkedin && openUrl(content.profile.links.linkedin),
  },
  website: {
    label: "website",
    open: ({ content, openUrl }) =>
      content.profile.links.website && openUrl(content.profile.links.website),
  },
};

const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-cyan-400">{children}</span>
);

export const commands: Record<string, Command> = {
  help: {
    description: "list available commands",
    run: () => (
      <div className="grid grid-cols-[110px_1fr]">
        {Object.entries(commands).map(([name, command]) => (
          <React.Fragment key={name}>
            <Accent>{name}</Accent>
            <span>{command.description}</span>
          </React.Fragment>
        ))}
      </div>
    ),
  },
  whoami: {
    description: "who is this guy?",
    run: (_, { content: { profile } }) => `${profile.name} - ${profile.role}`,
  },
  experience: {
    description: "where I have worked",
    run: (_, { content: { experiences } }) => (
      <div className="space-y-1.5">
        {experiences.map((experience) => (
          <div key={experience.id}>
            <div>
              <Accent>{experience.company}</Accent> - {experience.role}{" "}
              <span className="text-neutral-500">
                ({formatMonth(parseYearMonth(experience.start))} -{" "}
                {formatMonth(parseYearMonth(experience.end))})
              </span>
            </div>
            {experience.projects.length > 0 && (
              <div className="pl-3 text-neutral-400">
                {experience.projects.map((project) =>
                  typeof project === "string" ? (
                    <div key={project}>• {project}</div>
                  ) : (
                    <div key={project.id}>
                      • <Accent>{project.name}</Accent>
                      {project.type && (
                        <span className="text-neutral-500">
                          {" "}
                          [{project.type}]
                        </span>
                      )}
                      {project.link && (
                        <>
                          {" "}
                          -{" "}
                          <a
                            href={project.link}
                            target="_blank"
                            className="underline text-neutral-400"
                          >
                            {project.link}
                          </a>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        <div className="mt-1 text-neutral-500">
          Try `open experience` to browse them in Finder.
        </div>
      </div>
    ),
  },
  projects: {
    description: "things I have built",
    run: (_, { content: { projects } }) => (
      <div>
        {projects.map((project) => (
          <div key={project.id}>
            <Accent>{project.name}</Accent>{" "}
            <span className="text-neutral-500">- {project.company}</span>
          </div>
        ))}
        <div className="mt-1 text-neutral-500">
          Try `open projects` to browse them in Finder.
        </div>
      </div>
    ),
  },
  skills: {
    description: "what I work with",
    run: (_, { content: { skills } }) => (
      <div>
        {Object.entries(skills).map(([group, items]) => (
          <div key={group}>
            <Accent>{group}:</Accent> {items.join(", ")}
          </div>
        ))}
      </div>
    ),
  },
  awards: {
    description: "honors and awards",
    run: (_, { content: { awards } }) => (
      <div>
        {awards.map((award) => (
          <div key={award.title}>
            <Accent>{award.title}</Accent> - {award.event}{" "}
            <span className="text-neutral-500">({award.date})</span>
          </div>
        ))}
      </div>
    ),
  },
  contact: {
    description: "how to reach me",
    run: (_, { content: { profile } }) => (
      <div className="grid grid-cols-[90px_1fr]">
        <Accent>email</Accent>
        <a href={`mailto:${profile.email}`} className="underline">
          {profile.email}
        </a>
        {Object.entries(profile.links)
          .filter(([name, url]) => url && name !== "repository")
          .map(([name, url]) => (
            <React.Fragment key={name}>
              <Accent>{name}</Accent>
              <a href={url} target="_blank" className="underline">
                {url}
              </a>
            </React.Fragment>
          ))}
      </div>
    ),
  },
  open: {
    description: "open an app or link, e.g. `open cv`",
    run: ([target], context) => {
      if (!target)
        return `usage: open <${Object.keys(openTargets).join(" | ")}>`;
      const app = openTargets[target.toLowerCase()];
      if (!app)
        return `The file /Users/${context.content.profile.username}/${target} does not exist.`;
      app.open(context);
      return `Opening ${app.label}...`;
    },
  },
  ls: {
    description: "list files",
    run: () => (
      <div className="flex flex-wrap gap-x-6">
        {Object.keys(files).map((file) => (
          <span key={file}>{file}</span>
        ))}
        <span>Portfolio.pdf</span>
        <span className="text-blue-400 font-bold">experience</span>
        <span className="text-blue-400 font-bold">projects</span>
        <span className="text-blue-400 font-bold">contributions</span>
      </div>
    ),
  },
  cat: {
    description: "read a file, e.g. `cat about.txt`",
    run: ([file], context) => {
      if (!file) return "usage: cat <file>";
      if (file === "Portfolio.pdf")
        return "cat: Portfolio.pdf: binary file. Try `open portfolio`";
      const clean = file.replace(/\/$/, "");
      if (
        clean === "projects" ||
        clean === "experience" ||
        clean === "contributions"
      )
        return `cat: ${clean}: Is a directory`;
      return (
        files[file]?.(context) ?? `cat: ${file}: No such file or directory`
      );
    },
  },
  neofetch: {
    description: "system information",
    run: (_, { content: { profile, system } }) => (
      <div className="flex gap-6">
        <pre className="text-green-400 leading-tight">
          {`        .:'
    __ :'__
 .'\`__\`-'__\`\`.
:__________.-'
:_________:
 :_________\`-;
  \`.__.-.__.'`}
        </pre>
        <div>
          <div>
            <Accent>{profile.username}</Accent>@
            <Accent>{system.hostname}</Accent>
          </div>
          <div>-----------------</div>
          <div>
            <Accent>OS:</Accent> macOS Portfolio
          </div>
          <div>
            <Accent>Host:</Accent> {profile.name}
          </div>
          <div>
            <Accent>Uptime:</Accent>{" "}
            {formatDuration(parseYearMonth(profile.careerStart))} of shipping
          </div>
          <div>
            <Accent>Shell:</Accent> zsh
          </div>
          <div>
            <Accent>Resolution:</Accent> {window.innerWidth}x
            {window.innerHeight}
          </div>
        </div>
      </div>
    ),
  },
  date: {
    description: "print the current date",
    run: () => new Date().toString(),
  },
  echo: {
    description: "print text",
    run: (args) => args.join(" "),
  },
  history: {
    description: "previously run commands",
    run: (_, { history }) => (
      <div>
        {history.map((command, index) => (
          <div key={index}>
            <span className="text-neutral-500 mr-3">{index + 1}</span>
            {command}
          </div>
        ))}
      </div>
    ),
  },
  clear: {
    description: "clear the terminal",
    run: (_, { clear }) => {
      clear();
      return null;
    },
  },
  exit: {
    description: "close the terminal",
    run: (_, { closeTerminal }) => {
      closeTerminal();
      return null;
    },
  },
};

const easterEggs: Record<string, (context: CommandContext) => string> = {
  sudo: () => "Nice try. This incident will be reported.",
  rm: () => "Let's not do that.",
  cd: () => "zsh: this portfolio is read-only. Try `ls` or `open projects`.",
  pwd: ({ content }) => `/Users/${content.profile.username}`,
  vim: () => "You will never leave. Try `cat` instead.",
};

export const runCommand = (input: string, context: CommandContext) => {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return null;

  const command = commands[name.toLowerCase()];
  if (command) return command.run(args, context);
  if (easterEggs[name]) return easterEggs[name](context);
  return `zsh: command not found: ${name}`;
};

export const completions = [
  ...Object.keys(commands),
  ...Object.keys(openTargets).map((target) => `open ${target}`),
  ...Object.keys(files).map((file) => `cat ${file}`),
];
