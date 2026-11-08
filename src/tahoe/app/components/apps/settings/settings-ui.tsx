import React from "react";

export const SettingsGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="rounded-xl bg-white dark:bg-white/[0.05] ring-[0.5px] ring-black/5 dark:ring-white/10 px-4 divide-y divide-black/5 dark:divide-white/[0.07]">
    {children}
  </div>
);

export const SettingsRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="flex max-md:flex-col max-md:items-start items-center justify-between gap-4 min-h-[44px] py-2">
    <div>{label}</div>
    {children}
  </div>
);
