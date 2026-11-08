"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, formatDuration, formatMonth } from "../../../lib/utils";
import { readStorage, writeStorage } from "../../../lib/storage";
import { STORAGE_KEYS } from "../../../lib/constants";
import { PortfolioContent } from "../../../lib/content/schema";
import { parseYearMonth } from "../../../lib/content/dates";
import { useContent } from "../../../context/content-context";
import { AppProps } from "../../../lib/apps";
import Symbol from "../../symbol";
import { Toolbar } from "../../window/toolbar";
import { useWindowFocus } from "../../window/window-focus";

interface Note {
  id: string;
  title: string;
  date: string;
  preview: string;
  content: React.ReactNode;
}

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    className="text-[#b8860b] dark:text-[#ffd52e] underline underline-offset-2"
  >
    {children}
  </a>
);

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight: React.FC<{ text: string; query: string }> = ({
  text,
  query,
}) => {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query.trim())})`, "i"));
  return (
    <>
      {parts.map((part, index) =>
        index % 2 ? (
          <mark
            key={index}
            className="bg-[#ffd52e]/70 dark:bg-[#ffd52e]/45 group-data-[selected=true]:bg-black/15 dark:group-data-[selected=true]:bg-white/20 text-inherit rounded-[2px]"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const readUnchecked = () =>
  readStorage<string[]>(STORAGE_KEYS.uncheckedNoteItems, []);

const ChecklistItem: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const [isChecked, setIsChecked] = useState(
    () => !readUnchecked().includes(id)
  );

  const toggle = () => {
    const unchecked = readUnchecked().filter((other) => other !== id);
    writeStorage(
      STORAGE_KEYS.uncheckedNoteItems,
      isChecked ? [...unchecked, id] : unchecked
    );
    setIsChecked(!isChecked);
  };

  return (
    <li className="flex items-center gap-2">
      <motion.button
        role="checkbox"
        aria-checked={isChecked}
        aria-label={String(children)}
        onClick={toggle}
        initial={false}
        animate={{ scale: isChecked ? [0.8, 1.15, 1] : [0.9, 1] }}
        transition={{ duration: 0.25 }}
        className={cn(
          "w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-colors duration-150",
          isChecked
            ? "bg-[#ffd52e]"
            : "ring-[1.5px] ring-inset ring-black/25 dark:ring-white/30"
        )}
      >
        {isChecked && (
          <Symbol name="checkmark" className="w-2.5 h-2.5 text-black" />
        )}
      </motion.button>
      {children}
    </li>
  );
};

const buildNotes = ({
  profile,
  experiences,
  skills,
  awards,
  contributions,
}: PortfolioContent): Note[] => [
  {
    id: "hello",
    title: "Hello 👋",
    date: "Pinned",
    preview: profile.summary,
    content: (
      <>
        <p>
          I&apos;m {profile.name}. {profile.summary}
        </p>
        {profile.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          Say hi at{" "}
          <ExternalLink href={`mailto:${profile.email}`}>
            {profile.email}
          </ExternalLink>
          {profile.links.github && (
            <>
              {" "}
              or find me on{" "}
              <ExternalLink href={profile.links.github}>GitHub</ExternalLink>
            </>
          )}
          {profile.links.linkedin && (
            <>
              {" "}
              and{" "}
              <ExternalLink href={profile.links.linkedin}>
                LinkedIn
              </ExternalLink>
            </>
          )}
          .
        </p>
      </>
    ),
  },
  ...experiences.map((experience) => ({
    id: experience.id,
    title: experience.company,
    date: formatMonth(parseYearMonth(experience.start)),
    preview: experience.role,
    content: (
      <>
        <p className="text-neutral-500 dark:text-neutral-400">
          {experience.role} · {formatMonth(parseYearMonth(experience.start))} –{" "}
          {formatMonth(parseYearMonth(experience.end))} (
          {formatDuration(
            parseYearMonth(experience.start),
            parseYearMonth(experience.end)
          )}
          )
        </p>
        <p>{experience.description}</p>
        {experience.projects.length > 0 && (
          <>
            <h3 className="font-semibold">Shipped & Contributed Products</h3>
            <ul className="list-disc pl-5 space-y-2">
              {experience.projects.map((project) =>
                typeof project === "string" ? (
                  <li key={project}>{project}</li>
                ) : (
                  <li key={project.id}>
                    <span className="font-semibold">
                      {project.link ? (
                        <ExternalLink href={project.link}>
                          {project.name}
                        </ExternalLink>
                      ) : (
                        project.name
                      )}
                    </span>
                    {project.type && (
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {" "}
                        · {project.type}
                      </span>
                    )}
                    <div className="text-13 text-black/75 dark:text-white/75 mt-0.5">
                      {project.description}
                    </div>
                  </li>
                )
              )}
            </ul>
          </>
        )}
        {experience.link && (
          <p>
            <ExternalLink href={experience.link}>
              {experience.link.replace(/https?:\/\/(www\.)?/, "")}
            </ExternalLink>
          </p>
        )}
      </>
    ),
  })),
  {
    id: "skills",
    title: "Skills",
    date: "Always learning",
    preview: Object.values(skills).flat().slice(0, 4).join(", "),
    content: (
      <>
        {Object.entries(skills).map(([group, items]) => (
          <div key={group}>
            <h3 className="font-semibold">{group}</h3>
            <ul className="mt-1 space-y-0.5">
              {items.map((item) => (
                <ChecklistItem key={item} id={`${group}/${item}`}>
                  {item}
                </ChecklistItem>
              ))}
            </ul>
          </div>
        ))}
      </>
    ),
  },
  ...contributions.map((contribution) => ({
    id: contribution.id,
    title: "Open Source",
    date: "Contributions",
    preview: `${contribution.repository} · ${contribution.status} · ${contribution.tags.join(", ")}`,
    content: (
      <>
        <div className="flex flex-wrap items-center gap-2 text-13">
          <span className="font-semibold">{contribution.repository}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            #{contribution.number}
          </span>
          <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 font-medium">
            {contribution.status}
          </span>
        </div>
        <h3 className="font-semibold">{contribution.title}</h3>
        <p>{contribution.description}</p>
        <p className="text-13 text-neutral-500 dark:text-neutral-400">
          {contribution.tags.join(" · ")}
        </p>
        <p>
          <ExternalLink href={contribution.link}>
            View pull request on GitHub ↗
          </ExternalLink>
        </p>
      </>
    ),
  })),
  {
    id: "awards",
    title: "Honors & Awards",
    date: awards[0].date,
    preview: awards.map((award) => award.title).join(", "),
    content: (
      <>
        {awards.map((award) => (
          <div key={award.title}>
            <h3 className="font-semibold">{award.title}</h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              {award.event} · {award.date}
            </p>
            <p className="mt-1">
              {award.description}{" "}
              {award.link && (
                <ExternalLink href={award.link}>Read more</ExternalLink>
              )}
            </p>
          </div>
        ))}
      </>
    ),
  },
];

const Notes: React.FC<AppProps> = ({ payload, openedAt }) => {
  const notes = buildNotes(useContent());
  const [selectedId, setSelectedId] = useState(payload ?? notes[0].id);
  const [showList, setShowList] = useState(!payload);
  const [search, setSearch] = useState("");
  const isFocused = useWindowFocus();

  useEffect(() => {
    if (payload) {
      setSelectedId(payload);
      setShowList(false);
    }
  }, [payload, openedAt]);

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.preview}`.toLowerCase().includes(search.toLowerCase())
  );
  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0];

  return (
    <div className="notes-layout flex h-full" data-show-list={showList}>
      <aside className="w-40 sm:w-64 shrink-0 flex flex-col select-none">
        <div className="handle h-[52px] shrink-0 desktop-only" />
        <h1 className="mobile-large-title">Notes</h1>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-black/5 dark:bg-white/[0.08]">
            <Symbol name="magnifyingglass" className="w-3.5 h-3.5 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>
        <div className="notes-list flex-grow min-h-0 overflow-y-auto px-2.5 pb-2">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelectedId(note.id);
                setShowList(false);
              }}
              data-selected={selectedNote.id === note.id}
              className={cn(
                "group w-full text-left px-3 py-2 rounded-[10px] cursor-default",
                selectedNote.id === note.id &&
                  (isFocused
                    ? "bg-[#ffd52e] dark:bg-[#6e5815]"
                    : "bg-black/10 dark:bg-white/10")
              )}
            >
              <div className="font-bold truncate">
                <Highlight text={note.title} query={search} />
              </div>
              <div className="flex gap-2 text-12">
                <span className="shrink-0">{note.date}</span>
                <span className="truncate text-black/50 dark:text-white/50">
                  <Highlight text={note.preview} query={search} />
                </span>
              </div>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center text-black/40 dark:text-white/40 mt-6">
              No Results
            </div>
          )}
        </div>
      </aside>
      <article className="flex-grow flex flex-col min-w-0 min-h-0 bg-white dark:bg-[#1e1e1e]">
        <Toolbar
          leading={
            <button
              className="mobile-notes-back"
              onClick={() => setShowList(true)}
            >
              ‹ Notes
            </button>
          }
        />
        <div className="selectable flex-grow min-h-0 overflow-y-auto px-6 sm:px-12 pb-8 selection:bg-[#ffd52e]/45">
          <div className="text-center text-12 text-black/40 dark:text-white/40 mb-4">
            {selectedNote.date}
          </div>
          <h1 className="text-26 font-bold mb-4">{selectedNote.title}</h1>
          <div className="space-y-4 text-14 leading-relaxed max-w-prose">
            {selectedNote.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default Notes;
