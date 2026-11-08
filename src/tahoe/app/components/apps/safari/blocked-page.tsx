import React from "react";
import Symbol from "../../symbol";

interface BlockedPageProps {
  host: string;
  onOpen: () => void;
}

const BlockedPage: React.FC<BlockedPageProps> = ({ host, onOpen }) => (
  <div className="h-full flex flex-col items-center justify-center gap-3 px-8 text-center">
    <Symbol
      name="exclamationmark-triangle"
      className="w-10 h-10 text-black/30 dark:text-white/30"
    />
    <div className="text-17 font-semibold">
      Safari can&apos;t show “{host}” here
    </div>
    <p className="text-13 text-black/55 dark:text-white/55 max-w-sm">
      This website doesn&apos;t allow itself to be displayed inside other pages.
    </p>
    <button
      onClick={onOpen}
      className="mt-2 h-7 px-4 rounded-full bg-[#0a84ff] text-white text-13 active:brightness-90"
    >
      Open in New Tab
    </button>
  </div>
);

export default BlockedPage;
