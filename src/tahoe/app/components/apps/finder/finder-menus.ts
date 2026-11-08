import { MenuEntry } from "../../menubar/menu-dropdown";
import { FileEntry, canOpen } from "../../../lib/file-system";
import { FinderView } from "./navigation";

interface ItemMenuActions {
  open: () => void;
  moveToTrash: () => void;
  putBack: () => void;
  showInfo: () => void;
  rename: () => void;
  quickLook: () => void;
}

export const buildItemMenu = (
  entry: FileEntry,
  isInTrash: boolean,
  actions: ItemMenuActions
): MenuEntry[] => {
  const quickLook = {
    label: `Quick Look “${entry.name}”`,
    onClick: actions.quickLook,
  };

  if (isInTrash)
    return [
      { label: "Put Back", onClick: actions.putBack },
      "separator",
      quickLook,
    ];

  const link = entry.info?.link;
  return [
    { label: "Open", disabled: !canOpen(entry), onClick: actions.open },
    "separator",
    {
      label: "Move to Trash",
      disabled: !entry.canTrash,
      onClick: actions.moveToTrash,
    },
    "separator",
    { label: "Get Info", onClick: actions.showInfo },
    { label: "Rename", disabled: !entry.canRename, onClick: actions.rename },
    quickLook,
    ...(link
      ? [
          "separator" as const,
          {
            label: "Copy Link",
            onClick: () => navigator.clipboard.writeText(link),
          },
        ]
      : []),
  ];
};

interface BackgroundMenuOptions {
  view: FinderView;
  onViewChange: (view: FinderView) => void;
  trash?: { isEmpty: boolean; onEmpty: () => void };
}

export const buildBackgroundMenu = ({
  view,
  onViewChange,
  trash,
}: BackgroundMenuOptions): MenuEntry[] => [
  ...(trash
    ? [
        {
          label: "Empty Trash",
          disabled: trash.isEmpty,
          onClick: trash.onEmpty,
        },
        "separator" as const,
      ]
    : []),
  {
    label: "as Icons",
    checked: view === "grid",
    onClick: () => onViewChange("grid"),
  },
  {
    label: "as List",
    checked: view === "list",
    onClick: () => onViewChange("list"),
  },
];
