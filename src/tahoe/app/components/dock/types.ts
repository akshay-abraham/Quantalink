import { IconSource } from "../../lib/icons";
import { MenuEntry } from "../menubar/menu-dropdown";

export interface DockItem {
  key: string;
  title: string;
  icon: IconSource;
  onClick: () => void;
  isRunning?: boolean;
  isLaunching?: boolean;
  isMinimizedWindow?: boolean;
  onDropFile?: (fileId: string) => void;
  menu?: MenuEntry[];
}
