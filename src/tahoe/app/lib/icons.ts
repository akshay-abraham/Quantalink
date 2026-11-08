import { StaticImageData } from "next/image";

import Finder from "../assets/icons/apps/finder.png";
import FinderLight from "../assets/icons/apps/light/finder.png";
import Contacts from "../assets/icons/apps/contacts.png";
import ContactsLight from "../assets/icons/apps/light/contacts.png";
import Notes from "../assets/icons/apps/notes.png";
import NotesLight from "../assets/icons/apps/light/notes.png";
import Terminal from "../assets/icons/apps/terminal.png";
import TerminalLight from "../assets/icons/apps/light/terminal.png";
import Preview from "../assets/icons/apps/preview.png";
import PreviewLight from "../assets/icons/apps/light/preview.png";
import Mail from "../assets/icons/apps/mail.png";
import MailLight from "../assets/icons/apps/light/mail.png";
import Settings from "../assets/icons/apps/settings.png";
import SettingsLight from "../assets/icons/apps/light/settings.png";
import Apps from "../assets/icons/apps/apps.png";
import Safari from "../assets/icons/apps/safari.png";
import SafariLight from "../assets/icons/apps/light/safari.png";
import AppsLight from "../assets/icons/apps/light/apps.png";
import PhotosDark from "../assets/icons/apps/photos-dark.webp";
import PhotosLight from "../assets/icons/apps/photos-light.webp";

export interface ThemedIcon {
  dark: StaticImageData;
  light: StaticImageData;
}

export type IconSource = StaticImageData | ThemedIcon;

export const icons = {
  finder: { dark: Finder, light: FinderLight },
  contacts: { dark: Contacts, light: ContactsLight },
  notes: { dark: Notes, light: NotesLight },
  terminal: { dark: Terminal, light: TerminalLight },
  preview: { dark: Preview, light: PreviewLight },
  mail: { dark: Mail, light: MailLight },
  settings: { dark: Settings, light: SettingsLight },
  apps: { dark: Apps, light: AppsLight },
  safari: { dark: Safari, light: SafariLight },
  photos: { dark: PhotosDark, light: PhotosLight },
};
