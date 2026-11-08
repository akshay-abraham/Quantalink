"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import { useWindows } from "../../../context/window-context";
import { useContent } from "../../../context/content-context";
import { useOpenTarget } from "../../../hooks/use-open-file";
import { completions, runCommand } from "./commands";
import { Toolbar } from "../../window/toolbar";

interface Entry {
  id: number;
  input: string;
  output: React.ReactNode;
}

const Prompt: React.FC = () => {
  const { profile, system } = useContent();

  return (
    <span className="shrink-0 mr-2">
      <span className="text-green-400">
        {profile.username}@{system.hostname}
      </span>{" "}
      <span className="text-blue-400">~</span> %
    </span>
  );
};

const measureCharWidth = (element: HTMLElement) => {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return 0;
  const { fontSize, fontFamily } = getComputedStyle(element);
  context.font = `${fontSize} ${fontFamily}`;
  return context.measureText("M").width;
};

function useTerminalSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ columns: 80, rows: 24 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const charWidth = measureCharWidth(element);
    const style = getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const padding = parseFloat(style.paddingLeft) * 2;
    if (!charWidth || !lineHeight) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({
        columns: Math.max(1, Math.floor((width - padding) / charWidth)),
        rows: Math.max(1, Math.floor(height / lineHeight)),
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

const Terminal: React.FC = () => {
  const { openApp, closeApp } = useWindows();
  const content = useContent();
  const openTarget = useOpenTarget();
  const { profile } = content;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lastLogin] = useState(() =>
    new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const { columns, rows } = useTerminalSize(screenRef);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const submit = () => {
    const nextHistory = input.trim() ? [...history, input.trim()] : history;
    let cleared = false;

    const output = runCommand(input, {
      openApp,
      closeTerminal: () => closeApp("terminal"),
      clear: () => (cleared = true),
      history: nextHistory,
      content,
      openUrl: (url) => openTarget({ type: "url", url }),
    });

    setHistory(nextHistory);
    setHistoryIndex(null);
    setInput("");
    setEntries(
      cleared ? [] : [...entries, { id: nextId.current++, input, output }]
    );
  };

  const browseHistory = (direction: -1 | 1) => {
    if (!history.length) return;
    const current = historyIndex ?? history.length;
    const next = Math.min(Math.max(current + direction, 0), history.length);
    setHistoryIndex(next === history.length ? null : next);
    setInput(history[next] ?? "");
  };

  const autocomplete = () => {
    if (!input) return;
    const matches = completions.filter((c) => c.startsWith(input));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      setEntries([
        ...entries,
        {
          id: nextId.current++,
          input,
          output: matches.join("    "),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        submit();
        break;
      case "ArrowUp":
        e.preventDefault();
        browseHistory(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        browseHistory(1);
        break;
      case "Tab":
        e.preventDefault();
        autocomplete();
        break;
      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          setEntries([]);
        }
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          setEntries([
            ...entries,
            { id: nextId.current++, input: `${input}^C`, output: null },
          ]);
          setInput("");
          setHistoryIndex(null);
        }
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]/95 text-[#f2f2f2]">
      <Toolbar
        hasControls
        centerTitle
        title={
          <span className="text-13 font-semibold text-white/70">
            {profile.username} — -zsh — {columns}×{rows}
          </span>
        }
        className="h-[52px] border-b border-black/60"
      />
      <div
        ref={screenRef}
        className="selectable flex-grow overflow-y-auto font-mono text-12 leading-relaxed p-2 cursor-text"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div>Last login: {lastLogin} on ttys000</div>
        <div className="text-neutral-400 mb-1">
          Type `help` to see what you can do here.
        </div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex">
              <Prompt />
              <span className="break-all">{entry.input}</span>
            </div>
            {entry.output && (
              <div className="whitespace-pre-wrap break-words">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex" ref={bottomRef}>
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent outline-none caret-neutral-200"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
