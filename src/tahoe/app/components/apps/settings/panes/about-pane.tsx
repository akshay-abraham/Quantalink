"use client";

import React from "react";
import Avatar from "../../../avatar";
import { useContent } from "../../../../context/content-context";
import { SettingsGroup, SettingsRow } from "../settings-ui";

const AboutPane: React.FC = () => {
  const { profile } = useContent();

  return (
    <>
      <div className="flex flex-col items-center gap-2 py-4">
        <Avatar className="w-20 h-20 text-30" />
        <div className="text-20 font-bold">{profile.name}</div>
        <div className="text-black/50 dark:text-white/50">{profile.email}</div>
      </div>
      <SettingsGroup>
        <SettingsRow label="Name">
          <span className="text-black/50 dark:text-white/50">
            {profile.username}&apos;s Portfolio
          </span>
        </SettingsRow>
        <SettingsRow label="Built with">
          <span className="text-black/50 dark:text-white/50">
            Next.js, Tailwind CSS, Framer Motion
          </span>
        </SettingsRow>
        {profile.links.repository && (
          <SettingsRow label="Source">
            <a
              href={profile.links.repository}
              target="_blank"
              className="text-[#0a84ff]"
            >
              View on GitHub
            </a>
          </SettingsRow>
        )}
      </SettingsGroup>
    </>
  );
};

export default AboutPane;
