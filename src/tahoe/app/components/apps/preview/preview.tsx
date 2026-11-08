"use client";

import React from "react";
import { useContent } from "../../../context/content-context";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";

const Preview: React.FC = () => {
  const { profile } = useContent();

  const download = () => {
    const link = document.createElement("a");
    link.href = profile.cv;
    link.download = `${profile.name} - Portfolio.pdf`;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        title={
          <div className="leading-tight">
            <div>Portfolio.pdf</div>
            <div className="text-11 font-normal text-black/50 dark:text-white/50">
              Page 1 of 1
            </div>
          </div>
        }
        trailing={
          <ToolbarGroup>
            <ToolbarButton
              symbol="square-and-arrow-down"
              title="Download"
              onClick={download}
            />
            <ToolbarButton
              symbol="arrow-up-forward-square"
              title="Open in New Tab"
              onClick={() => window.open(profile.cv, "_blank")}
            />
          </ToolbarGroup>
        }
      />
      <a
        href={profile.cv}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden px-4 py-3 text-[#0a84ff] underline"
      >
        Open portfolio overview in your browser
      </a>
      <iframe
        src={`${profile.cv}#view=FitH&toolbar=0&navpanes=0`}
        title="Portfolio overview"
        className="flex-grow w-full bg-[#525659]"
      />
    </div>
  );
};

export default Preview;
