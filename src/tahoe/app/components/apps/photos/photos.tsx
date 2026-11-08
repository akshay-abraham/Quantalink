"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import moments from "../../../../data/moments.json";
import { Toolbar } from "../../window/toolbar";

type Moment = {
  title: string;
  tag: string;
  detail: string;
  date: string;
  postUrl?: string;
  photo: { src: string; alt: string };
};

export default function Photos() {
  const [selected, setSelected] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const entries: Moment[] = [...moments].reverse();
  const active = selected === null ? null : entries[selected];

  return (
    <div className="relative flex h-full flex-col bg-[#f7f7f9] text-[#24313b] dark:bg-[#252127] dark:text-white">
      <Toolbar
        hasControls
        title="Photos"
        className="border-b border-black/[0.06] bg-white/70 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.04]"
        trailing={
          <span className="pr-3 text-11 text-black/45 dark:text-white/45">
            {entries.length} moments
          </span>
        }
      />
      <div className="flex-1 overflow-y-auto px-5 pb-6 md:px-8">
        <div className="mb-5 border-b border-black/10 pb-5 dark:border-white/10">
          <p className="text-11 font-semibold uppercase tracking-[.18em] text-[#8b7468] dark:text-[#e9bbaa]">
            Akshay’s journey
          </p>
          <h2 className="mt-2 text-28 font-bold tracking-tight">
            Along the way
          </h2>
          <p className="mt-1 text-13 text-black/55 dark:text-white/55">
            People, projects, and the moments that changed how I build.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {entries.map((event, index) => (
            <button
              key={event.title}
              onClick={() => setSelected(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#ded9d5] text-left shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff] first:col-span-2 first:aspect-[2/1] md:first:row-span-2 md:first:aspect-auto dark:ring-white/[0.08]"
            >
              <Image
                src={event.photo.src}
                alt={event.photo.alt}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10 text-white">
                <span className="block text-10 opacity-80">{event.tag}</span>
                <strong className="mt-1 block text-12 leading-tight md:text-14">
                  {event.title}
                </strong>
              </span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.photo.src}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="absolute inset-0 z-20 flex flex-col bg-[#1d2025]/95 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <div className="flex h-12 shrink-0 items-center justify-between px-4">
              <span className="text-12 font-medium">
                {selected! + 1} of {entries.length}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full bg-white/15 px-3 py-1.5 text-12 hover:bg-white/25"
                aria-label="Close photo"
              >
                Done
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                src={active.photo.src}
                alt={active.photo.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="max-h-[32%] shrink-0 overflow-y-auto bg-black/25 px-5 py-4 md:px-7">
              <p className="text-11 text-white/60">{active.tag}</p>
              <h3 className="mt-1 text-17 font-semibold">{active.title}</h3>
              <p className="mt-2 max-w-2xl text-12 leading-relaxed text-white/75">
                {active.detail}
              </p>
              {active.postUrl && (
                <a
                  href={active.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-12 text-[#9fd2ff] underline"
                >
                  Read the post ↗
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
