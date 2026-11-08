"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Symbol from "../symbol";
import AppIcon from "../dock/app-icon";
import { SearchResult, buildSearchIndex, searchIndex } from "./search-index";
import { useOpenTarget } from "../../hooks/use-open-file";
import { useContent } from "../../context/content-context";
import { cn } from "../../lib/utils";
import { useSystem } from "../../context/system-context";
import { useOverlays } from "../../context/overlay-context";

const Spotlight: React.FC = () => {
  const content = useContent();
  const openTarget = useOpenTarget();
  const { power } = useSystem();
  const { isSpotlightOpen, setSpotlightOpen } = useOverlays();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && power === "on") {
        e.preventDefault();
        setSpotlightOpen(!isSpotlightOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpotlightOpen, setSpotlightOpen, power]);

  useEffect(() => {
    if (!isSpotlightOpen) setQuery("");
  }, [isSpotlightOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const index = useMemo(() => buildSearchIndex(content), [content]);
  const results = searchIndex(index, query);

  const select = (result?: SearchResult) => {
    if (!result) return;
    openTarget(result.target);
    setSpotlightOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setSpotlightOpen(false);
    if (e.key === "Enter") select(results[activeIndex]);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const direction = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.min(
        Math.max(activeIndex + direction, 0),
        results.length - 1
      );
      setActiveIndex(next);
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <motion.div
          className="absolute inset-0 z-spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSpotlightOpen(false);
          }}
        >
          <div className="absolute left-1/2 top-[22%] -translate-x-1/2 w-[min(640px,calc(100vw-32px))]">
            <motion.div
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className="rounded-[28px] bg-[#f4f2f5]/75 dark:bg-[#2a2429]/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] text-black dark:text-white overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 h-14">
                <Symbol
                  name="magnifyingglass"
                  className="w-[22px] h-[22px] opacity-50"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Spotlight Search"
                  className="flex-grow bg-transparent outline-none text-20 placeholder:text-neutral-400"
                />
              </div>
              {query.trim() && (
                <div
                  ref={listRef}
                  className="max-h-80 overflow-y-auto border-t border-black/10 dark:border-white/10 p-2"
                >
                  {results.length === 0 && (
                    <div className="text-center text-14 text-neutral-400 py-6">
                      No Results
                    </div>
                  )}
                  {results.map((result, index) => (
                    <React.Fragment key={result.id}>
                      {result.category !== results[index - 1]?.category && (
                        <div className="text-11 font-semibold text-neutral-400 px-2 pt-2 pb-1">
                          {result.category}
                        </div>
                      )}
                      <div
                        data-index={index}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={() => select(result)}
                        className={cn(
                          "flex items-center gap-3 px-2 py-1.5 rounded-[10px] cursor-default",
                          index === activeIndex && "bg-[#0a84ff] text-white"
                        )}
                      >
                        <div className="relative w-7 h-7 shrink-0">
                          <AppIcon icon={result.icon} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-14 truncate">{result.title}</div>
                          <div
                            className={cn(
                              "text-12 truncate",
                              index === activeIndex
                                ? "text-white/70"
                                : "text-neutral-400"
                            )}
                          >
                            {result.subtitle}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;
