"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../lib/storage";
import { SESSION_KEYS, STORAGE_KEYS } from "../lib/constants";

interface FileContextValue {
  trashed: string[];
  deleted: string[];
  names: Record<string, string>;
  moveToTrash: (ids: string[]) => void;
  putBack: (ids: string[]) => void;
  emptyTrash: () => void;
  rename: (id: string, name: string) => void;
  getName: (id: string, fallback: string) => string;
  isVisible: (id: string) => boolean;
}

const FileContext = createContext<FileContextValue | null>(null);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trashed, setTrashed] = useState(() =>
    readStorage<string[]>(STORAGE_KEYS.trashedFiles, [])
  );
  const [deleted, setDeleted] = useState(() =>
    readStorage<string[]>(SESSION_KEYS.deletedFiles, [], "session")
  );
  const [names, setNames] = useState(() =>
    readStorage<Record<string, string>>(STORAGE_KEYS.fileNames, {})
  );

  useEffect(() => writeStorage(STORAGE_KEYS.trashedFiles, trashed), [trashed]);
  useEffect(
    () => writeStorage(SESSION_KEYS.deletedFiles, deleted, "session"),
    [deleted]
  );
  useEffect(() => writeStorage(STORAGE_KEYS.fileNames, names), [names]);

  const moveToTrash = (ids: string[]) => {
    setTrashed((prev) => [...prev.filter((id) => !ids.includes(id)), ...ids]);
  };

  const putBack = (ids: string[]) => {
    setTrashed((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const emptyTrash = () => {
    setDeleted((prev) => [...prev, ...trashed]);
    setTrashed([]);
  };

  const rename = (id: string, name: string) => {
    if (name.trim()) setNames((prev) => ({ ...prev, [id]: name.trim() }));
  };

  const getName = (id: string, fallback: string) => names[id] ?? fallback;

  const isVisible = (id: string) =>
    !trashed.includes(id) && !deleted.includes(id);

  return (
    <FileContext.Provider
      value={{
        trashed,
        deleted,
        names,
        moveToTrash,
        putBack,
        emptyTrash,
        rename,
        getName,
        isVisible,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFiles must be used inside FileProvider");
  return context;
};

export const FILE_DRAG_TYPE = "application/x-portfolio-file";
