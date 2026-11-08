"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { PortfolioContent } from "../lib/content/schema";
import { ContentSource, contentSource } from "../lib/content/source";

import AppleLogo from "../assets/icons/apple.png";

const ContentContext = createContext<PortfolioContent | null>(null);

interface ContentProviderProps {
  source?: ContentSource;
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  source = contentSource,
  children,
}) => {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    source
      .load(controller.signal)
      .then(setContent)
      .catch((e: Error) => {
        if (!controller.signal.aborted) setError(e.message);
      });

    return () => controller.abort();
  }, [source, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  if (!content)
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-6 text-white/70 text-13">
        <Image
          src={AppleLogo}
          alt=""
          width={70}
          height={86}
          className="invert"
          priority
        />
        {error && (
          <div role="alert" className="flex flex-col items-center gap-4">
            <pre className="max-w-lg whitespace-pre-wrap text-center font-sans">
              {error}
            </pre>
            <button
              onClick={retry}
              className="h-7 px-4 rounded-full bg-white/15 active:bg-white/25 text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context)
    throw new Error("useContent must be used inside ContentProvider");
  return context;
};
