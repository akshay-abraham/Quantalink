"use client";

import React, { useState } from "react";
import { useContent } from "../../../context/content-context";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";
import { gmailComposeUrl } from "./compose-url";

const Mail: React.FC = () => {
  const { profile } = useContent();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSend = Boolean(subject.trim() && message.trim());
  const draftUrl = gmailComposeUrl(
    profile.email,
    subject.trim(),
    message.trim()
  );

  const handleSend = () => {
    if (!canSend) return;
    window.open(draftUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        title={subject.trim() || "New Message"}
        trailing={
          <ToolbarGroup>
            <ToolbarButton
              symbol="paperplane"
              title="Continue in Gmail"
              disabled={!canSend}
              onClick={handleSend}
              className="enabled:text-[#0a84ff]"
            />
          </ToolbarGroup>
        }
      />
      <MailField label="To:">
        <span
          title={profile.name}
          className="max-w-full truncate rounded-full bg-[#0a84ff]/15 px-2 py-0.5 text-[#0a84ff]"
        >
          {profile.email}
        </span>
      </MailField>
      <MailField label="Subject:">
        <input
          aria-label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-grow bg-transparent outline-none"
        />
      </MailField>
      <textarea
        aria-label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
        }}
        placeholder={`Hi ${profile.name.split(" ")[0]},\n\n`}
        className="flex-grow resize-none bg-transparent outline-none p-4 text-14 leading-relaxed placeholder:text-black/30 dark:placeholder:text-white/30"
      />
      <div className="px-4 py-2 text-11 text-black/40 dark:text-white/40 border-t border-black/5 dark:border-white/5">
        <span>Continue in Gmail to send this message.</span>
        {canSend && (
          <a
            href={draftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-[#0a84ff] underline underline-offset-2"
          >
            Open draft
          </a>
        )}
      </div>
    </div>
  );
};

const MailField: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex items-center gap-2 mx-4 h-9 border-b border-black/5 dark:border-white/10">
    <div className="text-black/45 dark:text-white/45 w-14">{label}</div>
    {children}
  </div>
);

export default Mail;
