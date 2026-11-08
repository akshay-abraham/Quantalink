"use client";

import React from "react";
import { ContentProvider } from "./context/content-context";
import { SystemProvider } from "./context/system-context";
import { NotificationProvider } from "./context/notification-context";
import { OverlayProvider } from "./context/overlay-context";
import { WindowProvider } from "./context/window-context";
import { FileProvider } from "./context/file-context";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ContentProvider>
    <SystemProvider>
      <NotificationProvider>
        <OverlayProvider>
          <WindowProvider>
            <FileProvider>{children}</FileProvider>
          </WindowProvider>
        </OverlayProvider>
      </NotificationProvider>
    </SystemProvider>
  </ContentProvider>
);

export default Providers;
