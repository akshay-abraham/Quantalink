import React from "react";
import { Favorite } from "./favorites";
import { getHost } from "../../../lib/browser";

export const START_PAGE = "about:start";

interface StartPageProps {
  favorites: Favorite[];
  onOpen: (url: string) => void;
}

const StartPage: React.FC<StartPageProps> = ({ favorites, onOpen }) => (
  <div className="h-full overflow-y-auto px-8 py-10">
    <h2 className="text-20 font-bold mb-5 max-w-3xl mx-auto">Favorites</h2>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-5 max-w-3xl mx-auto">
      {favorites.map((favorite) => (
        <button
          key={favorite.url}
          onClick={() => onOpen(favorite.url)}
          className="flex flex-col items-center gap-2 group"
        >
          <span className="w-16 h-16 rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/10 shadow-sm text-24 font-semibold uppercase group-active:brightness-90">
            {getHost(favorite.url)[0]}
          </span>
          <span className="text-11 text-center truncate w-full">
            {favorite.title}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default StartPage;
