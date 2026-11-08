import React from "react";
import AppIcon from "../../dock/app-icon";
import { FileEntry, canOpen } from "../../../lib/file-system";
import { cn } from "../../../lib/utils";

interface FinderDetailProps {
  entry: FileEntry;
  getTagColor: (tag: string) => string;
  onOpen: () => void;
}

const FinderDetail: React.FC<FinderDetailProps> = ({
  entry,
  getTagColor,
  onOpen,
}) => {
  if (!entry.info) return null;
  const { subtitle, description, tags } = entry.info;

  return (
    <aside className="w-60 shrink-0 border-l border-black/5 dark:border-white/[0.06] p-4 overflow-y-auto hidden lg:flex flex-col items-center text-center">
      <div className="relative w-28 h-28 mb-2">
        <AppIcon icon={entry.icon} />
      </div>
      <div className="font-semibold text-14">{entry.name}</div>
      <div className="text-12 text-black/50 dark:text-white/50 mb-3">
        {subtitle}
      </div>
      <p className="text-12 leading-relaxed text-black/70 dark:text-white/70">
        {description}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-11"
            >
              <span className={cn("w-2 h-2 rounded-full", getTagColor(tag))} />
              {tag}
            </span>
          ))}
        </div>
      )}
      {canOpen(entry) && (
        <button
          onClick={onOpen}
          className="mt-4 h-7 px-4 rounded-full bg-[#0a84ff] text-white text-12 font-medium active:brightness-90"
        >
          Open
        </button>
      )}
    </aside>
  );
};

export default FinderDetail;
