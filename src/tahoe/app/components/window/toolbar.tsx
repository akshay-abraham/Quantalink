import React from "react";
import Symbol from "../symbol";
import { cn } from "../../lib/utils";
import { useWindowFocus } from "./window-focus";

interface ToolbarProps {
  title?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  center?: React.ReactNode;
  hasControls?: boolean;
  centerTitle?: boolean;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  leading,
  trailing,
  center,
  hasControls,
  centerTitle,
  className,
}) => {
  const isFocused = useWindowFocus();

  return (
    <div
      className={cn(
        "app-toolbar handle relative h-[52px] shrink-0 flex items-center gap-2.5 px-2.5 transition-opacity duration-200",
        hasControls && "pl-[92px]",
        !isFocused && "[&>*]:opacity-50",
        className
      )}
    >
      {leading}
      {title && (
        <div
          className={cn(
            "text-15 font-bold truncate",
            centerTitle && "absolute inset-x-28 text-center pointer-events-none"
          )}
        >
          {title}
        </div>
      )}
      {center ? (
        <div className="flex-grow flex justify-center min-w-0">{center}</div>
      ) : (
        <div className="flex-grow" />
      )}
      {trailing}
    </div>
  );
};

export const ToolbarGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "flex items-center h-9 rounded-full px-1 bg-white/80 dark:bg-white/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.12),inset_0_0_0_0.5px_rgba(0,0,0,0.12)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_0.5px_0_rgba(255,255,255,0.15),inset_0_0_0_0.5px_rgba(255,255,255,0.08)] backdrop-blur-xl",
      className
    )}
  >
    {children}
  </div>
);

interface ToolbarButtonProps {
  symbol: string;
  title: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  symbol,
  title,
  onClick,
  isActive,
  disabled,
  className,
}) => (
  <button
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-7 min-w-7 px-1.5 rounded-full flex items-center justify-center text-black/75 dark:text-white/85 enabled:active:bg-black/10 dark:enabled:active:bg-white/15 disabled:opacity-30",
      isActive && "bg-black/10 dark:bg-white/15",
      className
    )}
  >
    <Symbol name={symbol} className="w-[17px] h-[17px]" />
  </button>
);
