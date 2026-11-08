import React from "react";
import Symbol from "../../symbol";
import { Favorite } from "./favorites";
import { cn } from "../../../lib/utils";

interface BookmarksSidebarProps {
  favorites: Favorite[];
  currentUrl: string;
  onOpen: (url: string) => void;
}

const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  favorites,
  currentUrl,
  onOpen,
}) => (
  <aside
    aria-label="Favorites"
    className="w-56 max-md:w-full shrink-0 overflow-y-auto px-2.5 py-2 border-r border-black/5 dark:border-white/[0.06]"
  >
    <div className="px-2 pb-1 text-11 font-bold text-black/40 dark:text-white/35">
      Favorites
    </div>
    {favorites.map((favorite) => (
      <button
        key={favorite.url}
        onClick={() => onOpen(favorite.url)}
        className={cn(
          "w-full h-11 md:h-8 flex items-center gap-2 px-2 rounded-lg text-left text-13",
          currentUrl === favorite.url && "bg-black/[0.08] dark:bg-white/10"
        )}
      >
        <Symbol
          name="globe"
          className="w-4 h-4 text-[#007aff] dark:text-[#0a84ff]"
        />
        <span className="truncate">{favorite.title}</span>
      </button>
    ))}
  </aside>
);

export default BookmarksSidebar;
