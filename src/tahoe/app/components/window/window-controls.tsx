import React, { memo, useState } from "react";
import Symbol from "../symbol";
import { cn } from "../../lib/utils";

interface WindowControlsProps {
  isFocused: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFullscreen: (e: React.MouseEvent) => void;
}

const WindowControls: React.FC<WindowControlsProps> = memo(
  ({ isFocused, isFullscreen, onClose, onMinimize, onFullscreen }) => {
    const [isHovered, setIsHovered] = useState(false);
    const showColors = isFocused || isHovered;

    return (
      <div
        className={cn(
          "window-controls absolute top-[19px] left-[19px] z-20 flex gap-[9px] transition-opacity duration-200",
          isFullscreen && !isHovered && "opacity-0"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <WindowControlButton
          label="Close"
          color={showColors ? "bg-[#ff5f57]" : undefined}
          isHovered={isHovered}
          icon={<Symbol name="xmark" className="text-[#4d0000] w-2 h-2" />}
          onClick={onClose}
        />
        <WindowControlButton
          label="Minimize"
          color={showColors && !isFullscreen ? "bg-[#febc2e]" : undefined}
          isHovered={isHovered && !isFullscreen}
          disabled={isFullscreen}
          icon={<Symbol name="minus" className="text-[#985700] w-2 h-2" />}
          onClick={onMinimize}
        />
        <WindowControlButton
          label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
          color={showColors ? "bg-[#28c840]" : undefined}
          isHovered={isHovered}
          onClick={onFullscreen}
          icon={
            <Symbol
              name={
                isFullscreen
                  ? "arrow-down-right-and-arrow-up-left"
                  : "arrow-up-left-and-arrow-down-right"
              }
              className="text-[#006500] w-2 h-2"
            />
          }
        />
      </div>
    );
  }
);

interface WindowControlButtonProps {
  label: string;
  color?: string;
  icon: React.ReactNode;
  isHovered?: boolean;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const WindowControlButton: React.FC<WindowControlButtonProps> = memo(
  ({ label, color, icon, isHovered, disabled, onClick }) => (
    <button
      aria-label={label}
      disabled={disabled}
      className={cn(
        "w-[14px] h-[14px] rounded-full flex items-center justify-center ring-[0.5px] ring-inset ring-black/20 enabled:active:brightness-75",
        color ?? "bg-black/15 dark:bg-white/20"
      )}
      onClick={onClick}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {isHovered && icon}
    </button>
  )
);

WindowControls.displayName = "WindowControls";
WindowControlButton.displayName = "WindowControlButton";

export default WindowControls;
