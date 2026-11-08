"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import moments from "../../../../data/moments.json";
import { useWindows } from "../../../context/window-context";
import { cn } from "../../../lib/utils";
import Symbol from "../../symbol";
import Sidebar, { type SidebarSection } from "../../window/sidebar";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";

type Moment = {
  title: string;
  tag: string;
  detail: string;
  date: string;
  postUrl?: string;
  photo: { src: string; alt: string };
};

const entries: Moment[] = [...moments].reverse();
const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))];
const sidebarSections: SidebarSection[] = [
  {
    title: "Library",
    items: [{ id: "all", label: "All Photos", symbol: "photo" }],
  },
  {
    title: "Years",
    items: years.map((year) => ({ id: year, label: year, symbol: "clock" })),
  },
];

export default function Photos() {
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { windows, toggleMaximize } = useWindows();
  const isMaximized = windows.find((item) => item.id === "photos")?.isMaximized;

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesYear = year === "all" || entry.date.startsWith(year);
      const text = `${entry.title} ${entry.tag} ${entry.detail}`.toLowerCase();
      return matchesYear && text.includes(search);
    });
  }, [year, query]);
  const selectedIndex = visible.findIndex(
    (entry) => entry.photo.src === selected
  );
  const active = selectedIndex < 0 ? null : visible[selectedIndex];
  const isViewing = active !== null;

  useEffect(() => {
    if (!isViewing) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, [isViewing]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setSelected(null);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        const next = selectedIndex + (event.key === "ArrowLeft" ? -1 : 1);
        if (visible[next]) setSelected(visible[next].photo.src);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [active, selectedIndex, visible]);

  const chooseYear = (next: string) => {
    setSelected(null);
    setYear(next);
  };

  return (
    <div className="photos-app relative flex h-full text-[#242329] dark:text-white">
      <Sidebar
        className="photos-sidebar"
        sections={sidebarSections}
        selectedId={year}
        onSelect={chooseYear}
        header={
          <div className="px-4 pb-5 pt-2">
            <p className="text-19 font-semibold tracking-tight">Photos</p>
            <p className="mt-0.5 text-11 text-black/45 dark:text-white/45">
              Your moments, in one place
            </p>
          </div>
        }
      />
      <div className="photos-content flex min-w-0 flex-1 flex-col bg-white dark:bg-[#282025]">
        <Toolbar
          hasControls
          title={year === "all" ? "All Photos" : year}
          className="photos-toolbar border-b border-black/[0.06] dark:border-white/[0.07]"
          trailing={
            <div className="flex items-center gap-2 pr-1">
              <span className="photos-count text-11 text-black/45 dark:text-white/45">
                {visible.length} {visible.length === 1 ? "photo" : "photos"}
              </span>
              {isSearching ? (
                <ToolbarGroup className="gap-1.5 px-3 ring-[3px] ring-[#0a84ff]/40">
                  <Symbol
                    name="magnifyingglass"
                    className="h-3.5 w-3.5 opacity-60"
                  />
                  <input
                    autoFocus
                    type="search"
                    aria-label="Search photos"
                    placeholder="Search photos"
                    value={query}
                    onChange={(event) => {
                      setSelected(null);
                      setQuery(event.target.value);
                    }}
                    onBlur={() => !query && setIsSearching(false)}
                    onKeyDown={(event) => {
                      if (event.key !== "Escape") return;
                      setQuery("");
                      setIsSearching(false);
                    }}
                    className="w-28 min-w-0 bg-transparent text-12 outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
                  />
                </ToolbarGroup>
              ) : (
                <ToolbarGroup>
                  <ToolbarButton
                    symbol="magnifyingglass"
                    title="Search photos"
                    onClick={() => setIsSearching(true)}
                  />
                </ToolbarGroup>
              )}
              <ToolbarGroup>
                <ToolbarButton
                  symbol={
                    isMaximized
                      ? "arrow-down-right-and-arrow-up-left"
                      : "arrow-up-left-and-arrow-down-right"
                  }
                  title={
                    isMaximized
                      ? "Restore Photos window"
                      : "Expand Photos window"
                  }
                  onClick={() => toggleMaximize("photos")}
                />
              </ToolbarGroup>
            </div>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-6 md:px-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-black/[0.07] pb-5 dark:border-white/[0.08]">
            <div>
              <p className="text-10 font-semibold uppercase tracking-[.18em] text-[#817184] dark:text-[#c8accb]">
                {year === "all" ? "The collection" : "From the archive"}
              </p>
              <h2 className="mt-1 text-28 font-semibold tracking-tight">
                {year === "all" ? "Along the way" : `Moments from ${year}`}
              </h2>
              <p className="mt-1 text-12 text-black/50 dark:text-white/50">
                People, projects, and moments worth remembering.
              </p>
            </div>
          </div>
          <div className="mb-4 flex gap-2 photos-mobile-years">
            {["all", ...years].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => chooseYear(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-11",
                  year === item
                    ? "bg-[#303037] text-white dark:bg-white dark:text-[#242329]"
                    : "bg-black/5 dark:bg-white/10"
                )}
              >
                {item === "all" ? "All Photos" : item}
              </button>
            ))}
          </div>
          {visible.length ? (
            <div
              className="photos-grid grid gap-2.5"
              data-curated={
                year === "all" && !query.trim() ? "true" : undefined
              }
            >
              {visible.map((event) => (
                <button
                  key={event.photo.src}
                  type="button"
                  onClick={() => setSelected(event.photo.src)}
                  aria-label={`View ${event.title}`}
                  className="photos-tile group relative overflow-hidden rounded-xl bg-[#ded9d5] text-left shadow-[0_3px_12px_rgba(0,0,0,0.09)] ring-1 ring-black/[0.04] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:ring-white/[0.08]"
                >
                  <Image
                    src={event.photo.src}
                    alt={event.photo.alt}
                    fill
                    sizes="(max-width: 720px) 50vw, (max-width: 1100px) 32vw, 25vw"
                    className={cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.035]",
                      event.photo.src.includes("yc-startup-school") &&
                        "object-bottom",
                      event.photo.src.includes("first-presentation") &&
                        "object-top"
                    )}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-3.5 pb-3.5 pt-12 text-white">
                    <span className="block truncate text-10 font-medium text-white/80">
                      {event.tag}
                    </span>
                    <strong className="mt-1 block line-clamp-2 text-13 leading-tight drop-shadow-sm">
                      {event.title}
                    </strong>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-52 flex-col items-center justify-center text-black/40 dark:text-white/40">
              <Symbol name="photo" className="h-8 w-8" />
              <p className="mt-3 text-12">No photos found</p>
            </div>
          )}
        </div>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                key="photo-viewer"
                role="dialog"
                aria-modal="true"
                aria-label={active.title}
                className="fixed inset-0 z-[55] flex flex-col bg-[#111115] text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                <div className="flex h-14 shrink-0 items-center gap-4 border-b border-white/10 bg-white/[0.04] px-5">
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Close full-screen photo"
                    className="flex h-8 items-center gap-2 rounded-full bg-white/10 px-3 text-12 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                  >
                    <Symbol name="chevron-left" className="h-3 w-3" />
                    All Photos
                  </button>
                  <div className="min-w-0 flex-1 truncate text-center text-13 font-medium">
                    {active.title}
                  </div>
                  <span className="w-16 text-right text-11 text-white/55">
                    {selectedIndex + 1} of {visible.length}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                  <div className="relative min-h-0 flex-1 bg-[#0a0a0d]">
                    <Image
                      src={active.photo.src}
                      alt={active.photo.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      className="object-contain p-3 lg:p-6"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelected(visible[selectedIndex - 1].photo.src)
                      }
                      disabled={selectedIndex === 0}
                      aria-label="Previous photo"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 backdrop-blur-md hover:bg-black/70 disabled:opacity-25"
                    >
                      <Symbol name="chevron-left" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelected(visible[selectedIndex + 1].photo.src)
                      }
                      disabled={selectedIndex === visible.length - 1}
                      aria-label="Next photo"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 backdrop-blur-md hover:bg-black/70 disabled:opacity-25"
                    >
                      <Symbol name="chevron-right" className="h-4 w-4" />
                    </button>
                  </div>
                  <aside className="max-h-[27vh] w-full shrink-0 overflow-y-auto border-t border-white/10 bg-[#1c1b20] px-6 py-6 lg:max-h-none lg:w-[min(340px,30vw)] lg:border-l lg:border-t-0">
                    <p className="text-10 font-semibold uppercase tracking-[.16em] text-white/45">
                      {active.tag}
                    </p>
                    <h3 className="mt-3 text-20 font-semibold leading-tight">
                      {active.title}
                    </h3>
                    <p className="mt-4 text-13 leading-relaxed text-white/65">
                      {active.detail}
                    </p>
                    {active.postUrl && (
                      <a
                        href={active.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-block text-12 text-[#8bc5ff] underline underline-offset-2"
                      >
                        Read the post ↗
                      </a>
                    )}
                  </aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
